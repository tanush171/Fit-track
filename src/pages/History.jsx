import React, { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Accordion, Card, Button, Table, Row, Col } from 'react-bootstrap';
import { Trash2, Calendar, Dumbbell, Award } from 'lucide-react';

const History = () => {
  const { workouts, deleteWorkout } = useContext(WorkoutContext);

  // Helper calculation function to add up total weight for an individual exercise block
  const calculateExerciseVolume = (sets) => {
    return sets.reduce((total, set) => {
      const weight = parseFloat(set.weight) || 0;
      const reps = parseFloat(set.reps) || 0;
      return total + (weight * reps);
    }, 0);
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-5 border border-secondary rounded bg-black p-4 mt-3">
        <Dumbbell size={48} className="text-muted mb-3" />
        <h4>No Workouts Logged Yet</h4>
        <p className="text-muted">Head over to the 'Log Workout' tab to submit your first session!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-info fw-bold">Workout History Archive</h3>
      
      <Accordion defaultActiveKey="0" className="fittrack-accordion">
        {workouts.map((workout, index) => (
          <Accordion.Item eventKey={index.toString()} key={workout.id} className="bg-black text-white border-secondary mb-3 rounded">
            
            {/* Accordion header card wrapper */}
            <Accordion.Header className="bg-black text-white">
              <div className="d-flex justify-content-between align-items-center w-100 pe-3 text-white">
                <div>
                  <h5 className="mb-1 text-info fw-semibold">{workout.name}</h5>
                  <div className="d-flex gap-3 text-muted small">
                    <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {workout.date}</span>
                    <span className="d-flex align-items-center gap-1"><Dumbbell size={14} /> {workout.exercises.length} Exercises</span>
                  </div>
                </div>
              </div>
            </Accordion.Header>

            {/* Accordion body expand workspace panel */}
            <Accordion.Body className="bg-dark text-white border-top border-secondary p-4">
              {workout.notes && (
                <div className="bg-black p-2 rounded mb-3 border border-secondary border-opacity-50 small">
                  <strong className="text-info">Notes:</strong> {workout.notes}
                </div>
              )}

              {workout.exercises.map((ex, exIdx) => (
                <div key={ex.uniqueId || exIdx} className="mb-4 bg-black p-3 rounded border border-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-white fw-bold">{ex.name}</h6>
                    <span className="small text-muted">Vol: {calculateExerciseVolume(ex.sets).toLocaleString()} Kg</span>
                  </div>
                  
                  <Table responsive borderless size="sm" className="text-white mb-0 text-center">
                    <thead>
                      <tr className="text-muted small border-bottom border-secondary">
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((set, setIdx) => (
                        <tr key={setIdx} className="small">
                          <td>{set.setNum}</td>
                          <td>{set.weight} kg</td>
                          <td>{set.reps} reps</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}

              <div className="d-flex justify-content-end mt-3">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="d-flex align-items-center gap-2"
                  onClick={() => {
                    if(confirm("Are you sure you want to delete this workout entry?")) {
                      deleteWorkout(workout.id);
                    }
                  }}
                >
                  <Trash2 size={14} /> Remove Session Log
                </Button>
              </div>
            </Accordion.Body>

          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default History;