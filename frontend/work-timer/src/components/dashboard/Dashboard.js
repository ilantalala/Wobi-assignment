import React, { useEffect, useState, useRef } from "react";
import { getCurrentTime } from "../../services/timeService";
import { addRecord } from "../../services/recordsService";
import { formatGermanTime } from "../../utils/timeFormatter";
import "./Dashboard.css";

function Dashboard({ user, setUser }) {
  // Store the display time as a simple string
  const [displayTime, setDisplayTime] = useState("Loading...");
  const [message, setMessage] = useState("");

  // Use a ref to store the last valid server time for calculations
  const lastServerTimeRef = useRef(null);
  // Store offset between updates
  const offsetMsRef = useRef(0);
  // Track the last update time
  const lastUpdateRef = useRef(Date.now());

  const handleTimeRecord = async (type) => {
    try {
      await addRecord(user.username, type);
      
      setMessage(`Successfully recorded ${type}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to record time");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Calculate current time based on last server time plus elapsed milliseconds
  const updateDisplayTime = () => {
    if (!lastServerTimeRef.current) return;

    try {
      // Calculate how much time has passed since our last server update
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      // Add the elapsed time to our offset
      offsetMsRef.current += elapsed;

      // If more than 1 second has passed, update the display and reset the offset
      if (offsetMsRef.current >= 1000) {
        // How many seconds to add
        const secondsToAdd = Math.floor(offsetMsRef.current / 1000);
        // Remaining milliseconds
        offsetMsRef.current = offsetMsRef.current % 1000;

        // Parse the current time components
        const [datePart, timePart] = lastServerTimeRef.current.split(", ");
        const [hourStr, minuteStr, secondStr] = timePart.split(":");

        // Add the elapsed seconds
        let seconds = parseInt(secondStr, 10) + secondsToAdd;
        let minutes = parseInt(minuteStr, 10);
        let hours = parseInt(hourStr, 10);

        // Handle rollovers
        if (seconds >= 60) {
          minutes += Math.floor(seconds / 60);
          seconds = seconds % 60;
        }

        if (minutes >= 60) {
          hours += Math.floor(minutes / 60);
          minutes = minutes % 60;
        }

        if (hours >= 24) {
          hours = hours % 24;
          // We'll let the next server sync handle date changes
        }

        // Format the new time
        const newTime = `${datePart}, ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

        // Update the reference and the display
        lastServerTimeRef.current = newTime;
        setDisplayTime(newTime);
      }
    } catch (err) {
      console.error("Error updating time:", err);
    }
  };

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const data = await getCurrentTime();

        if (data && data.currentTime) {
          // Format the server time to German time
          const germanTime = formatGermanTime(data.currentTime);

          // Update our references
          lastServerTimeRef.current = germanTime;
          lastUpdateRef.current = Date.now();
          offsetMsRef.current = 0;

          // Update the display
          setDisplayTime(germanTime);
        }
      } catch (err) {
        console.error("Error fetching time:", err);
      }
    };

    // Fetch the time immediately
    fetchServerTime();

    // Set up intervals for server sync and local updates
    const serverSyncInterval = setInterval(fetchServerTime, 30000); // Sync with server every 30 seconds
    const updateInterval = setInterval(updateDisplayTime, 50); // Update display frequently for smooth seconds

    return () => {
      clearInterval(serverSyncInterval);
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}!</h1>
      
      <div className="time-container">
        <h2>Current Time in Germany</h2>
        <div className="time-display">{displayTime}</div>
      </div>
      
      <div className="record-actions">
        <button className="entry-btn" onClick={() => handleTimeRecord("entry")}>Entry</button>
        <button className="exit-btn" onClick={() => handleTimeRecord("exit")}>Exit</button>
      </div>
      
      {message && <div className="message">{message}</div>}
      
      <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}

export default Dashboard;