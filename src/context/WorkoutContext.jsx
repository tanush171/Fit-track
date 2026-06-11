import React, { createContext, useState, useEffect } from 'react';

// Initialize the Context
export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  // 1. Read from LocalStorage instantly on startup (Lazy Initialization)
  const [workouts, setWorkouts] = useState(() => {
    const cachedData = localStorage.getItem('fittrack_history');
    return cachedData ? JSON.parse(cachedData) : [];
  });

  // A hardcoded dictionary library of gym exercises to choose from
  const [exerciseLibrary] = useState([
    { id: 'ex1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
    { id: 'ex2', name: 'Squat', muscle: 'Legs', equipment: 'Barbell' },
    { id: 'ex3', name: 'Pull-up', muscle: 'Back', equipment: 'Bodyweight' },
    { id: 'ex4', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Dumbbell' },
    { id: 'ex5', name: 'Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  ]);

  // 2. Automatically sync state changes to LocalStorage via side-effect hook
  useEffect(() => {
    localStorage.setItem('fittrack_history', JSON.stringify(workouts));
  }, [workouts]);

  // 3. CRUD: CREATE Operation
  const addWorkout = (newWorkout) => {
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  // 4. CRUD: DELETE Operation
  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  };

  return (
    <WorkoutContext.Provider value={{ workouts, exerciseLibrary, addWorkout, deleteWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};