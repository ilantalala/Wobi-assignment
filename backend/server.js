const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const TIME_RECORDS_FILE = path.join(__dirname, 'data', 'attendance.json');

// Helper functions
async function getGermanyTime() {
  const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.dateTime;
}

async function saveAttendance(newAttendance) {
  await fs.writeFile(TIME_RECORDS_FILE, JSON.stringify(newAttendance, null, 2));
}

async function readAttendanceFile() {
  try {
    await fs.access(TIME_RECORDS_FILE);
  } catch {
    await fs.writeFile(TIME_RECORDS_FILE, '{}');
  }
  
  const data = await fs.readFile(TIME_RECORDS_FILE, 'utf8');
  return JSON.parse(data);
}

async function calculateUserStatistics(records) {
  const entries = records.filter(r => r.type === 'entry').length;
  const exits = records.filter(r => r.type === 'exit').length;
  
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  let totalStayTime = 0;
  let stayCount = 0;
  
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    if (sortedRecords[i].type === 'entry' && sortedRecords[i + 1].type === 'exit') {
      const entry = new Date(sortedRecords[i].timestamp);
      const exit = new Date(sortedRecords[i + 1].timestamp);
      totalStayTime += (exit - entry) / (1000 * 60);
      stayCount++;
      i++;
    }
  }

  const monthlyStats = {};
  records.forEach(record => {
    const date = new Date(record.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
  });

  return {
    totalRecords: records.length,
    entries,
    exits,
    averageStayTime: stayCount > 0 ? Math.round(totalStayTime / stayCount) : 0,
    lastRecord: records.length > 0 ? records[records.length - 1] : null,
    monthlyStats
  };
}

// API Routes
app.get('/api/current-time', async (req, res) => {
  try {
    const time = await getGermanyTime();
    res.json({ currentTime: time });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch time', details: error.message });
  }
});

app.get('/api/time-records', async (req, res) => {
  try {
    const records = await readAttendanceFile();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.post('/api/time-record', async (req, res) => {
  const { username, type } = req.body;
  
  try {
    const records = await readAttendanceFile();
    if (!records[username]) {
      records[username] = [];
    }

    const germanyTime = await getGermanyTime();
    records[username].push({ type, timestamp: germanyTime });
    
    await saveAttendance(records);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error recording time' });
  }
});

app.put('/api/time-records/:username/:index', async (req, res) => {
  try {
    const { username, index } = req.params;
    const updatedRecord = req.body;
    const records = await readAttendanceFile();
    const recordIndex = parseInt(index);
    
    if (records[username]?.[recordIndex]) {
      const timestamp = new Date(updatedRecord.timestamp);
      timestamp.setHours(timestamp.getHours() + 2);
      
      records[username][recordIndex] = {
        type: updatedRecord.type,
        timestamp: timestamp.toISOString()
      };
      
      await saveAttendance(records);
      res.json({ success: true, updatedRecord: records[username][recordIndex] });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

app.delete('/api/time-records/:username/:index', async (req, res) => {
  try {
    const { username, index } = req.params;
    const records = await readAttendanceFile();
    const recordIndex = parseInt(index);
    
    if (records[username]?.[recordIndex]) {
      records[username].splice(recordIndex, 1);
      await saveAttendance(records);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.get('/api/statistics', async (req, res) => {
  try {
    const records = await readAttendanceFile();
    const statistics = {};

    for (const [username, userRecords] of Object.entries(records)) {
      statistics[username] = await calculateUserStatistics(userRecords);
    }

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate statistics' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const usersData = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const user = usersData[username];
    
    if (user?.password === password) {
      res.json({ 
        success: true, 
        user: { username: user.username, role: user.role }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
});

app.listen(port);