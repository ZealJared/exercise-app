import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import db from './db';

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const [routines, setRoutines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const routinesData = await db.routines.toArray();
      const schedulesData = await db.scheduledRoutines.toArray();
      const exercisesData = await db.exercises.toArray();

      setRoutines(routinesData);
      setSchedules(schedulesData);
      setExercises(exercisesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateEvents = () => {
    const events = [];

    schedules.forEach((schedule) => {
      const routine = routines.find((routine) => routine.id.toString() === schedule.routineId);
      const start = moment(schedule.routineDate).toDate();

      // Repeat the scheduled routine for the next 6 months
      let currentDate = moment(start);
      const endDate = moment().add(6, 'months');

      while (currentDate.isSameOrBefore(endDate, 'day')) {
        const repeatedStart = moment(currentDate).toDate();
        const repeatedEnd = moment(currentDate).add(1, 'hour').toDate();

        events.push({
          id: schedule.id,
          routineId: routine.id.toString(),
          title: routine.name,
          start: repeatedStart,
          end: repeatedEnd,
        });

        currentDate = moment(currentDate).add(schedule.repeatDays, 'days');
      }
    });

    return events;
  };

  const events = generateEvents();

  const handleEventClick = (event) => {
    const today = moment().startOf('day');
    const eventStart = moment(event.start).startOf('day');

    // Only show modal for routine events that occur today
    if (eventStart.isSame(today)) {
      setSelectedEvent(event);
      fetchExerciseLogs(event.routineId);
    }
  };

  const fetchExerciseLogs = async (routineId) => {
    try {
      const exerciseLogsData = await db.exerciseLogs.where({ routineId: routineId.toString() }).toArray();
      setExerciseLogs(exerciseLogsData);
      initializeFormValues(routineId, exerciseLogsData);
    } catch (error) {
      console.error('Error fetching exercise logs:', error);
    }
  };

  const initializeFormValues = (routineId, exerciseLogsData) => {
    const initialFormValues = {};
    exercises.forEach((exercise) => {
      const log = exerciseLogsData.find(
        (log) => log.routineId === routineId.toString() && log.exerciseId === exercise.id.toString()
      );
      const setsValue = log ? log.setsCompleted : exercise.setCount;
      const weightValue = log ? log.weightUsed : getLatestWeightForExercise(exercise.id.toString());

      initialFormValues[exercise.id.toString()] = {
        sets: setsValue,
        weight: weightValue,
      };
    });

    setFormValues(initialFormValues);
  };

  const getLatestWeightForExercise = (exerciseId) => {
    const logsForExercise = exerciseLogs.filter((log) => log.exerciseId === exerciseId.toString());
    if (logsForExercise.length > 0) {
      const sortedLogs = logsForExercise.sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedLogs[0].weightUsed;
    }
    return 0;
  };

  const handleSetsChange = (event, exerciseId) => {
    const newFormValues = {
      ...formValues,
      [exerciseId]: {
        ...formValues[exerciseId],
        sets: event.target.value,
      },
    };
    setFormValues(newFormValues);
  };

  const handleWeightChange = (event, exerciseId) => {
    const newFormValues = {
      ...formValues,
      [exerciseId]: {
        ...formValues[exerciseId],
        weight: event.target.value,
      },
    };
    setFormValues(newFormValues);
  };

  const closeLogModal = () => {
    setSelectedEvent(null);
    setExerciseLogs([]);
    setFormValues({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedEvent) {
      return;
    }

    const routineId = selectedEvent.routineId;
    const exerciseLogsData = [...exerciseLogs];

    try {
      const exercisesToUpdate = Object.keys(formValues);

      for (const exerciseId of exercisesToUpdate) {
        const log = exerciseLogsData.find(
          (log) => log.routineId === routineId && log.exerciseId === exerciseId
        );

        const newLog = {
          routineId,
          exerciseId,
          setsCompleted: parseInt(formValues[exerciseId].sets),
          weightUsed: parseFloat(formValues[exerciseId].weight),
          date: new Date(),
        };

        if (log) {
          await db.exerciseLogs.update(log.id, newLog);
          const updatedLogs = exerciseLogsData.map((entry) =>
            entry.id === log.id ? { ...entry, ...newLog } : entry
          );
          setExerciseLogs(updatedLogs);
        } else {
          const newLogId = await db.exerciseLogs.add(newLog);
          newLog.id = newLogId;
          exerciseLogsData.push(newLog);
          setExerciseLogs(exerciseLogsData);
        }
      }

      closeLogModal();
    } catch (error) {
      console.error('Error saving exercise logs:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectEvent={handleEventClick}
      />

      {selectedEvent && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log Exercises - {selectedEvent.title}</h5>
                <button type="button" className="close btn btn-outline-primary" onClick={closeLogModal}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Render exercise logs and input fields for logging */}
                  {routines
                    .find((routine) => routine.id.toString() === selectedEvent.routineId)
                    ?.exerciseIds.map((exerciseId) => {
                      const exercise = exercises.find((ex) => ex.id.toString() === exerciseId);
                      const setsValue = formValues[exerciseId]?.sets || exercise.setCount;
                      const weightValue = formValues[exerciseId]?.weight || getLatestWeightForExercise(exerciseId);

                      return (
                        <div key={exerciseId} className="mb-3">
                          <h6>{exercise.name}</h6>
                          <p>
                            Goal Reps: {exercise.repCount}
                            <br />
                            Goal Sets: {exercise.setCount}
                          </p>
                          <label>Sets:</label>
                          <input
                            type="number"
                            min="0"
                            value={setsValue}
                            onChange={(event) => handleSetsChange(event, exerciseId)}
                          />
                          <br />
                          <label>Weight:</label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={weightValue}
                            onChange={(event) => handleWeightChange(event, exerciseId)}
                          />
                        </div>
                      );
                    })}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeLogModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
