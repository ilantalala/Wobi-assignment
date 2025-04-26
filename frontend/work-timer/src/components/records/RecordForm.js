import React from 'react';
import './RecordForm.css';

function RecordForm({ record, onSave, onCancel }) {
  return (
    <div className="record-form">
      <input
        type="datetime-local"
        defaultValue={record.timestamp.slice(0, 16)}
        onChange={(e) => record.timestamp = new Date(e.target.value).toISOString()}
      />
      <select
        defaultValue={record.type}
        onChange={(e) => record.type = e.target.value}
      >
        <option value="entry">Entry</option>
        <option value="exit">Exit</option>
      </select>
      <div className="form-buttons">
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default RecordForm;