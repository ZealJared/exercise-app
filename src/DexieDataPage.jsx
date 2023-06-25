import React, { useState, useEffect } from 'react';
import db from './db';

function DexieDataPage() {
    const [exercises, setExercises] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const exercisesData = await db.exercises.toArray();
            const routinesData = await db.routines.toArray();
            const schedulesData = await db.scheduledRoutines.toArray();
            const logsData = await db.exerciseLogs.toArray();

            setExercises(exercisesData);
            setRoutines(routinesData);
            setSchedules(schedulesData);
            setLogs(logsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteExercise = async (id) => {
        try {
            await db.exercises.delete(id);
            setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== id));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const deleteRoutine = async (id) => {
        try {
            await db.routines.delete(id);
            setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== id));
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            await db.scheduledRoutines.delete(id);
            setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const deleteLog = async (id) => {
        try {
            await db.exerciseLogs.delete(id);
            setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    const deleteAllData = async () => {
        try {
            await Promise.all([
                db.exercises.clear(),
                db.routines.clear(),
                db.scheduledRoutines.clear(),
                db.exerciseLogs.clear(),
            ]);
            setExercises([]);
            setRoutines([]);
            setSchedules([]);
            setLogs([]);
        } catch (error) {
            console.error('Error deleting all data:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Dexie Data</h2>
            <h3>Exercises</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.id}>
                            <td>{exercise.name}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteExercise(exercise.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Routines</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {routines.map((routine) => (
                        <tr key={routine.id}>
                            <td>{routine.name}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteRoutine(routine.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Schedules</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Routine</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule) => (
                        <tr key={schedule.id}>
                            <td>{routines.find((routine) => routine.id.toString() === schedule.routineId.toString())?.name}</td>
                            <td>{new Date(schedule.routineDate).toDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteSchedule(schedule.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Logs</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Routine</th>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Weight</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{routines.find((routine) => routine.id.toString() === log.routineId.toString())?.name}</td>
                            <td>{exercises.find((exercise) => exercise.id.toString() === log.exerciseId.toString())?.name}</td>
                            <td>{log.setsCompleted}</td>
                            <td>{log.weightUsed}</td>
                            <td>{log.date.toDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteLog(log.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-danger" onClick={deleteAllData}>
                Delete All Data
            </button>
        </div>
    );
}

export default DexieDataPage;
