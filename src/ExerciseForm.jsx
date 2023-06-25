import React, { useState } from 'react';

function ExerciseForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [repCount, setRepCount] = useState('');
  const [setCount, setSetCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && repCount && setCount) {
      const exercise = { name, repCount, setCount };
      onSubmit(exercise);
      setName('');
      setRepCount('');
      setSetCount('');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Add Exercise</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exerciseName" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="exerciseName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repCount" className="form-label">
              Rep Count:
            </label>
            <input
              type="number"
              className="form-control"
              id="repCount"
              value={repCount}
              onChange={(e) => setRepCount(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="setCount" className="form-label">
              Set Count:
            </label>
            <input
              type="number"
              className="form-control"
              id="setCount"
              value={setCount}
              onChange={(e) => setSetCount(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      </div>
    </div>
  );
}

export default ExerciseForm;
