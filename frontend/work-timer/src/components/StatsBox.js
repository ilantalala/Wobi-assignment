function StatsBox({ statistics, formatDisplayDate }) {
    if (!statistics) return null;
  
    return (
      <div className="stats-container">
        <h2>Statistics</h2>
        {Object.entries(statistics).map(([username, stats]) => (
          <div key={username} className="user-stats">
            <h3>{username}'s Stats</h3>
            <div className="stats-details">
              <p>Records: {stats.totalRecords}</p>
              <p>Entries: {stats.entries}</p>
              <p>Exits: {stats.exits}</p>
              <p>Avg Stay: {stats.averageStayTime} mins</p>
              {stats.lastRecord && (
                <p>Last Record: {stats.lastRecord.type} at {formatDisplayDate(stats.lastRecord.timestamp)}</p>
              )}
              <div className="monthly-stats">
                <h4>Monthly:</h4>
                {Object.entries(stats.monthlyStats)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([month, count]) => (
                    <p key={month}>{month}: {count}</p>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  export default StatsBox