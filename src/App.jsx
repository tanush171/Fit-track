import React, { useState } from 'react';
import { WorkoutProvider } from './context/WorkoutContext';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Logger from './pages/Logger';
import History from './pages/History';     
import Dashboard from './pages/Dashboard';
import RestTimer from './components/RestTimer'; 

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'logger':
        return <Logger onSaveSuccess={setCurrentTab} />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WorkoutProvider>
      <div className="bg-dark text-white min-vh-100" style={{ backgroundColor: '#121212' }}>
        <Container fluid className="p-0">
          <Row className="g-0">
            {/* Sidebar Column: Spans full width (12) on mobile, but collapses to its normal width (2) on desktop (md) */}
            <Col xs={12} md={3} lg={2}>
              <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
            </Col>
            
            {/* Main Content Workspace Column: Spans full width (12) on mobile/tablet, and takes center stage (7) on desktop (lg) */}
            <Col xs={12} md={12} lg={7} className="p-4" style={{ background: '#181818' }}>
              {renderPage()}
            </Col>
            
            {/* Rest Timer Column: Spans full width (12) on mobile/tablet, and settles into the right sidebar (3) on desktop (lg) */}
            <Col xs={12} md={12} lg={3} className="p-4 border-start-lg border-secondary bg-black bg-opacity-20">
              <RestTimer />
            </Col>
          </Row>
        </Container>
      </div>
    </WorkoutProvider>
  );
}

export default App;