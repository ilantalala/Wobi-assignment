import React from 'react';
import { formatDisplayDate } from '../../utils/timeFormatter';
import './RecordItem.css';

function RecordItem({ record, onEdit, onDelete }) {
  return (
    <div className="record-item">
      <div className="record-info">
        <p className="record-type">
          <span className="label">Type:</span> 
          <span className={`type-value ${record.type}`}>{record.type}</span>
        </p>
        <p className="record-time">
          <span className="label">Time:</span> 
          <span className="time-value">{formatDisplayDate(record.timestamp)}</span>
        </p>
      </div>
      <div className="record-buttons">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default RecordItem;