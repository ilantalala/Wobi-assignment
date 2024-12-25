function RecordItem({ record, onEdit, onDelete }) {
    return (
      <div className="record-item">
        <p>Type: {record.type}</p>
        <p>Time: {record.timestamp}</p>
        <div className="buttons">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    );
  }
  export default RecordItem