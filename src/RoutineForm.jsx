import React, { useState } from 'react';

function RoutineForm({ onSubmit, exercises }) {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedExercises.length > 0) {
      const routine = { name, exerciseIds: selectedExercises };
      onSubmit(routine);
      setName('');
      setSelectedExercises([]);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Add Routine</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="routineName" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="routineName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exerciseSelect" className="form-label">
              Exercises:
            </label>
            <input
              type="text"
              className="form-control"
              id="exerciseSearch"
              placeholder="Search exercises"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select
              multiple
              className="form-select"
              id="exerciseSelect"
              value={selectedExercises}
              onChange={(e) =>
                setSelectedExercises(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {filteredExercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default RoutineForm;
