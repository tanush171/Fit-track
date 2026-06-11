import React from 'react';
import { Nav, Navbar, Offcanvas, Container } from 'react-bootstrap';
import { LayoutDashboard, Dumbbell, History, Menu } from 'lucide-react';

const Sidebar = ({ currentTab, setCurrentTab }) => {
  const links = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'logger', name: 'Log Workout', icon: <Dumbbell size={18} /> },
    { id: 'history', name: 'History', icon: <History size={18} /> },
  ];

  return (
    <>
      {/* 1. MOBILE NAVBAR: Only shows up on small screens (expand="md" hides it on desktop) */}
      <Navbar bg="black" variant="dark" expand="md" className="border-bottom border-secondary d-md-none p-3">
        <Container fluid className="p-0">
          <Navbar.Brand className="text-info fw-bold m-0">FitTrack</Navbar.Brand>
          
          {/* The Custom Three-Line Hamburger Button */}
          <Navbar.Toggle aria-controls="mobile-sidebar-nav" className="border-secondary text-info p-1">
            <Menu size={24} />
          </Navbar.Toggle>
          
          {/* Slide-out Menu Drawer for Mobile */}
          <Navbar.Offcanvas
            id="mobile-sidebar-nav"
            aria-labelledby="mobile-sidebar-label"
            placement="start"
            className="bg-black text-white"
            style={{ width: '280px' }}
          >
            <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary">
              <Offcanvas.Title id="mobile-sidebar-label" className="text-info fw-bold">
                FitTrack Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-3">
              <Nav variant="pills" className="flex-column gap-2">
                {links.map((link) => (
                  <Nav.Item key={link.id}>
                    {/* Navbar.Toggle wraps the link so the menu closes automatically when tapped */}
                    <Navbar.Toggle className="w-100 p-0 border-0 text-start bg-transparent" onClick={() => setCurrentTab(link.id)}>
                      <span className={`d-flex align-items-center gap-3 px-3 py-3 rounded text-white w-100 ${
                        currentTab === link.id ? 'bg-info text-dark fw-bold' : 'bg-transparent'
                      }`}>
                        {link.icon}
                        {link.name}
                      </span>
                    </Navbar.Toggle>
                  </Nav.Item>
                ))}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* 2. DESKTOP SIDEBAR: Hidden on mobile screens (d-none d-md-block) */}
      <div className="d-none d-md-flex flex-column bg-black text-white p-3 h-100 border-end border-secondary" style={{ minHeight: '100vh' }}>
        <h3 className="text-info fw-bold mb-4 px-2">FitTrack</h3>
        <hr className="bg-secondary" />
        
        <Nav variant="pills" className="flex-column gap-1">
          {links.map((link) => (
            <Nav.Item key={link.id}>
              <Nav.Link
                active={currentTab === link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`d-flex align-items-center gap-3 px-3 py-2 rounded text-white ${
                  currentTab === link.id ? 'bg-info text-dark fw-bold' : 'bg-transparent'
                }`}
                style={{ cursor: 'pointer' }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;