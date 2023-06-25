

import React, { useEffect, useState } from 'react';
import db from './db';
import ExerciseForm from './ExerciseForm';
import RoutineForm from './RoutineForm';
import ScheduleForm from './ScheduleForm';
import CalendarPage from './CalendarPage';

function Home() {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [scheduledRoutines, setScheduledRoutines] = useState([]);

  useEffect(() => {
    // Fetch initial data from IndexedDB
    fetchExercises();
    fetchRoutines();
    fetchScheduledRoutines();
  }, []);

  const fetchExercises = async () => {
    const exerciseList = await db.exercises.toArray();
    setExercises(exerciseList);
  };

  const fetchRoutines = async () => {
    const routineList = await db.routines.toArray();
    setRoutines(routineList);
  };

  const fetchScheduledRoutines = async () => {
    const scheduledRoutineList = await db.scheduledRoutines.toArray();
    setScheduledRoutines(scheduledRoutineList);
  };

  const handleExerciseSubmit = async (exercise) => {
    await db.exercises.add(exercise);
    fetchExercises();
  };

  const handleRoutineSubmit = async (routine) => {
    await db.routines.add(routine);
    fetchRoutines();
  };

  const handleScheduleSubmit = async (schedule) => {
    await db.scheduledRoutines.add(schedule);
    fetchScheduledRoutines();
  };

  return (
    <div>
      <h1>Exercise App</h1>
      <ExerciseForm onSubmit={handleExerciseSubmit} />
      <RoutineForm onSubmit={handleRoutineSubmit} exercises={exercises} />
      <ScheduleForm
        onSubmit={handleScheduleSubmit}
        routines={routines}
        scheduledRoutines={scheduledRoutines}
      />
      <CalendarPage routines={routines} schedules={scheduledRoutines} />
    </div>
  );
}

export default Home;
