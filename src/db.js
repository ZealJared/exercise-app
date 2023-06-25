import Dexie from 'dexie';

const db = new Dexie('ExerciseAppDatabase');

// Define the database schema
db.version(1).stores({
  routines: '++id,name,exerciseIds',
  exercises: '++id,name,setCount,repCount',
  exerciseLogs: '++id,routineId,exerciseId,date,setsCompleted,weightUsed',
  scheduledRoutines: '++id,routineId,routineDate,repeatDays',
});

export default db;
