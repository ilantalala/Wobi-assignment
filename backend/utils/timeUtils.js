const fetch = require('node-fetch');

// Get current time in Germany timezone
async function getGermanyTime() {
  try {
    // Try to get time from timeapi.io with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout if request completes
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.dateTime) {
      // Create a standardized UTC-based ISO string from the API response
      const apiDate = new Date(data.dateTime);
      console.log(`Time received from API: ${apiDate.toISOString()}`);
      return apiDate.toISOString();
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching time from API:', error);
    console.log('Using fallback time calculation method');
    
    // Use Date.UTC to construct a UTC date representing Berlin time
    const now = new Date();
    
    // Format the current time to Berlin timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Get the formatted Berlin time string
    const berlinString = formatter.format(now).replace(',', '');
    console.log("Berlin formatted time:", berlinString);
    
    // Parse the components
    const [datePart, timePart] = berlinString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    // Create a proper date using Date.UTC to ensure consistent timezone handling
    const berlinDate = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1, // Month is 0-indexed in JS Date
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(second, 10)
      )
    );
    
    console.log(`Fallback Germany time: ${berlinDate.toISOString()}`);
    return berlinDate.toISOString();
  }
}

// Calculate statistics for user attendance
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

module.exports = {
  getGermanyTime,
  calculateUserStatistics
};