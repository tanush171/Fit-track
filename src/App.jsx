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
      {/* 1. Added 'w-100' and custom color styling to ensure the entire window is dark */}
      <div className="bg-dark text-white min-vh-100 w-100" style={{ backgroundColor: '#121212' }}>
        {/* 2. CRITICAL: Enforce 'fluid' and clear 'p-0' padding/margins */}
        <Container fluid className="p-0 m-0 w-100" style={{ overflowX: 'hidden' }}>
          <Row className="g-0 min-vh-100">
            {/* Sidebar Column */}
            <Col xs={12} md={3} lg={2} className="h-100">
              <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
            </Col>
            
            {/* Main Content Workspace Column */}
            <Col xs={12} md={12} lg={7} className="p-4" style={{ background: '#181818', minHeight: '100vh' }}>
              {renderPage()}
            </Col>
            
            {/* Rest Timer Column */}
            <Col xs={12} md={12} lg={3} className="p-4 bg-black bg-opacity-20" style={{ minHeight: '100vh' }}>
              <RestTimer />
            </Col>
          </Row>
        </Container>
      </div>
    </WorkoutProvider>
  );
}

export default App;