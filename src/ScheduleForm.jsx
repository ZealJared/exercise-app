import React, { useState } from 'react';

function ScheduleForm({ routines, onSubmit }) {
  const [routineId, setRoutineId] = useState('');
  const [routineDate, setRoutineDate] = useState('');
  const [repeatDays, setRepeatDays] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any validation or data formatting if needed

    // Create a new schedule object
    const schedule = {
      routineId,
      routineDate: new Date(new Date(routineDate).toUTCString().slice(0, 25)),
      repeatDays,
    };

    // Pass the new schedule to the onSubmit callback
    onSubmit(schedule);

    // Reset the form
    setRoutineId('');
    setRoutineDate('');
    setRepeatDays('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="routineId" className="form-label">
          Select Routine
        </label>
        <select
          className="form-select"
          id="routineId"
          value={routineId}
          onChange={(e) => setRoutineId(e.target.value)}
          required
        >
          <option value="">Select a Routine</option>
          {routines.map((routine) => (
            <option key={routine.id} value={routine.id}>
              {routine.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="routineDate" className="form-label">
          Routine Date
        </label>
        <input
          type="date"
          className="form-control"
          id="routineDate"
          value={routineDate}
          onChange={(e) => setRoutineDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="repeatDays" className="form-label">
          Repeat Every (Days)
        </label>
        <input
          type="number"
          className="form-control"
          id="repeatDays"
          value={repeatDays}
          onChange={(e) => setRepeatDays(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Add Schedule
      </button>
    </form>
  );
}

export default ScheduleForm;
