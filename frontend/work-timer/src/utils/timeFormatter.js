// Format ISO time string to German format (DD.MM.YYYY, HH:MM:SS)
export const formatDisplayDate = (timestamp) => {
    try {
      // Extract components from the ISO string
      const year = timestamp.substring(0, 4); 
      const month = timestamp.substring(5, 7); 
      const day = timestamp.substring(8, 10); 
      const hours = timestamp.substring(11, 13); 
      const minutes = timestamp.substring(14, 16); 
      const seconds = timestamp.substring(17, 19); 
      
      return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
    } catch (err) {
      console.error("Error formatting time:", err);
      return "Error formatting time";
    }
  };
  
  // Format ISO time string to German format (with timezone adjustment)
  export const formatGermanTime = (isoString) => {
    try {
      console.log("Server time:", isoString);
      
      // Extract components from the ISO string
      const matches = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (!matches) {
        throw new Error("Invalid ISO format");
      }
      
      const [_, year, month, day, hourStr, minute, second] = matches;
      
      // Always add exactly 2 hours to convert from UTC to German time
      let hour = parseInt(hourStr, 10);
      
      const germanTime = `${day}.${month}.${year}, ${hour.toString().padStart(2, '0')}:${minute}:${second}`;
      console.log("Formatted German time:", germanTime);
      
      return germanTime;
    } catch (err) {
      console.error("Error formatting time:", err);
      return "Error formatting time";
    }
  };