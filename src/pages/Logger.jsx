import React, { useState, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Card, Button, Form, Table, Row, Col } from 'react-bootstrap';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const Logger = ({ onSaveSuccess }) => {
  const { exerciseLibrary, addWorkout } = useContext(WorkoutContext);
  
  // State for tracking the active workout session metadata
  const [workoutName, setWorkoutName] = useState('Morning Workout');
  const [notes, setNotes] = useState('');
  
  // Array holding active exercises in this specific workout log
  const [activeExercises, setActiveExercises] = useState([]);

  // 1. Core Logic: Add an exercise block to our log
  const handleAddExercise = (exerciseId) => {
    if (!exerciseId) return;
    const selected = exerciseLibrary.find((ex) => ex.id === exerciseId);
    
    setActiveExercises((prev) => [
      ...prev,
      {
        ...selected,
        uniqueId: Date.now().toString() + Math.random(), // Unique hook key
        sets: [{ setNum: 1, weight: '', reps: '' }]      // Initialize with 1 default set
      }
    ]);
  };

  // 2. Core Logic: Add a new row/set to an exercise block
  const handleAddSet = (exerciseUniqueId) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.uniqueId === exerciseUniqueId) {
          return {
            ...ex,
            sets: [...ex.sets, { setNum: ex.sets.length + 1, weight: '', reps: '' }]
          };
        }
        return ex;
      })
    );
  };

  // 3. Core Logic: Update dynamic input fields for an exact set row
  const handleSetChange = (exerciseUniqueId, setIndex, field, value) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.uniqueId === exerciseUniqueId) {
          const updatedSets = ex.sets.map((set, idx) => {
            if (idx === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          });
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  // 4. Core Logic: Remove an exercise block entirely
  const handleRemoveExercise = (exerciseUniqueId) => {
    setActiveExercises((prev) => prev.filter((ex) => ex.uniqueId !== exerciseUniqueId));
  };

  // 5. CRUD: Submitting data to context
  const handleFinishWorkout = (e) => {
    e.preventDefault();
    if (activeExercises.length === 0) {
      alert('Please add at least one exercise to your workout!');
      return;
    }

    const completedWorkout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toLocaleDateString(),
      notes: notes,
      exercises: activeExercises
    };

    addWorkout(completedWorkout);
    alert('Workout successfully saved to history!');
    
    // Clear the inputs and redirect back to the dashboard tab
    setActiveExercises([]);
    setNotes('');
    onSaveSuccess('dashboard');
  };

  return (
    <Form onSubmit={handleFinishWorkout}>
      <Card className="bg-black text-white border-secondary mb-4 p-3">
        <Card.Body>
          <Row className="align-items-center g-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="text-info small fw-bold">Workout Title</Form.Label>
                <Form.Control 
                  type="text" 
                  value={workoutName} 
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="text-info small fw-bold">Quick Notes</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Feeling strong today..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Select Box dropdown to add structural exercises */}
      <Card className="bg-black text-white border-secondary mb-4 p-2">
        <Card.Body className="d-flex align-items-center gap-3">
          <Form.Select 
            className="bg-dark text-white border-secondary"
            defaultValue=""
            onChange={(e) => {
              handleAddExercise(e.target.value);
              e.target.value = ""; // Reset dropdown value after picking
            }}
          >
            <option value="" disabled>➕ Click to add an exercise...</option>
            {exerciseLibrary.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle})</option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      {/* Dynamically mapped log tables for each selected exercise */}
      {activeExercises.map((ex) => (
        <Card key={ex.uniqueId} className="bg-black text-white border-secondary mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center border-bottom border-secondary bg-dark p-3">
            <div>
              <h5 className="mb-0 text-info fw-bold">{ex.name}</h5>
              <span className="badge bg-secondary text-capitalize mt-1">{ex.muscle}</span>
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveExercise(ex.uniqueId)}>
              <Trash2 size={16} />
            </Button>
          </Card.Header>
          <Card.Body>
           <Table responsive borderless className="text-white mb-2">
  <thead>
    <tr className="text-muted border-bottom border-secondary small text-center">
      <th style={{ width: '10%' }}>Set</th>
      {/* CHANGED HERE: Changed lbs to kg */}
      <th style={{ width: '45%' }}>Weight (kg)</th>
      <th style={{ width: '45%' }}>Reps</th>
    </tr>
              </thead>
              <tbody>
                {ex.sets.map((set, index) => (
                  <tr key={index} className="text-center align-middle">
                    <td className="fw-bold">{set.setNum}</td>
                    <td>
                      <Form.Control 
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) => handleSetChange(ex.uniqueId, index, 'weight', e.target.value)}
                        className="bg-dark text-white border-secondary text-center"
                        required
                        min="0"
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) => handleSetChange(ex.uniqueId, index, 'reps', e.target.value)}
                        className="bg-dark text-white border-secondary text-center"
                        required
                        min="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-info" size="sm" className="w-100 mt-2 d-flex align-items-center justify-content-center gap-2" onClick={() => handleAddSet(ex.uniqueId)}>
              <Plus size={16} /> Add Set
            </Button>
          </Card.Body>
        </Card>
      ))}

      {activeExercises.length > 0 && (
        <Button variant="info" type="submit" className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 text-dark">
          <CheckCircle size={20} /> Finish Workout Session
        </Button>
      )}
    </Form>
  );
};

export default Logger;