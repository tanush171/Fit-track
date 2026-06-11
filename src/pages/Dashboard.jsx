import React, { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Dumbbell, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { workouts } = useContext(WorkoutContext);

  // --- MATHEMATICAL AGGREGATIONS (Pure JavaScript Logic) ---
  
  // 1. Total Volume across all logged workouts
  const totalVolume = workouts.reduce((grandTotal, workout) => {
    const workoutVol = workout.exercises.reduce((exTotal, ex) => {
      return exTotal + ex.sets.reduce((setTotal, set) => {
        const w = parseFloat(set.weight) || 0;
        const r = parseFloat(set.reps) || 0;
        return setTotal + (w * r);
      }, 0);
    }, 0);
    return grandTotal + workoutVol;
  }, 0);

  // 2. Average exercises performed per workout
  const avgExercises = workouts.length > 0 
    ? (workouts.reduce((total, w) => total + w.exercises.length, 0) / workouts.length).toFixed(1)
    : 0;

  // 3. Format raw workout entries into coordinate metrics for Recharts
  const chartData = [...workouts].reverse().map((workout) => {
    const volume = workout.exercises.reduce((exTotal, ex) => {
      return exTotal + ex.sets.reduce((setTotal, set) => {
        return setTotal + ((parseFloat(set.weight) || 0) * (parseFloat(set.reps) || 0));
      }, 0);
    }, 0);

    return {
      date: workout.date.substring(0, 5), // Truncate date string for cleaner axis room
      Volume: volume
    };
  });

  return (
    <Container fluid className="p-0">
      <h3 className="mb-4 text-info fw-bold">Performance Dashboard</h3>

      {/* KPI Highlight Metrics Grid */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} lg={4}>
          <Card className="bg-black text-white border-secondary p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="p-3 bg-dark rounded text-info"><Activity size={24} /></div>
              <div>
                <Card.Subtitle className="text-muted small mb-1">Total Workouts</Card.Subtitle>
                <Card.Title className="fs-3 fw-bold mb-0">{workouts.length}</Card.Title>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="bg-black text-white border-secondary p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="p-3 bg-dark rounded text-info"><TrendingUp size={24} /></div>
              <div>
                <Card.Subtitle className="text-muted small mb-1">Total Weight Lifted</Card.Subtitle>
                <Card.Title className="fs-3 fw-bold mb-0">{totalVolume.toLocaleString()} Kg</Card.Title>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={4}>
          <Card className="bg-black text-white border-secondary p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="p-3 bg-dark rounded text-info"><Dumbbell size={24} /></div>
              <div>
                <Card.Subtitle className="text-muted small mb-1">Avg Exercises / Session</Card.Subtitle>
                <Card.Title className="fs-3 fw-bold mb-0">{avgExercises}</Card.Title>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recharts Progress Trend Graph Layout */}
      <Card className="bg-black text-white border-secondary p-4">
        <Card.Title className="text-info fw-semibold mb-4 d-flex align-items-center gap-2">
          <Calendar size={18} /> Estimated Volume Trends over Time
        </Card.Title>
        <Card.Body className="p-0">
          {workouts.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="date" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#444', color: '#fff' }} />
                  <Line type="monotone" dataKey="Volume" stroke="#0dcaf0" strokeWidth={3} dot={{ fill: '#0dcaf0', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              Add workout records to generate structural progress charts dynamically.
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;