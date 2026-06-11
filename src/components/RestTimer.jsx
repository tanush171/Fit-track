import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const RestTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(60); // 60 seconds default
  const [isActive, setIsActive] = useState(false);
  const [initialPreset, setInitialPreset] = useState(60);

  // --- INTERVIEW GOLDMINE: ASYNCHRONOUS ENGINE & CLEANUP ---
  useEffect(() => {
    let intervalToken = null;

    if (isActive && secondsLeft > 0) {
      // Establish a browser background thread that decrements state every 1 second
      intervalToken = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      // Optional: You could trigger an HTML5 Audio sound effect here!
      alert("⏱️ Rest period complete! Get back to your set!");
      setSecondsLeft(initialPreset); // Reset back to default
    }

    // CRITICAL: Return a garbage disposal cleanup function to kill memory leaks
    return () => {
      if (intervalToken) clearInterval(intervalToken);
    };
  }, [isActive, secondsLeft, initialPreset]);

  // Handle manual fast-forward preset adjustment taps
  const handlePresetTap = (seconds) => {
    setIsActive(false);
    setInitialPreset(seconds);
    setSecondsLeft(seconds);
  };

  // Format integer seconds into standard readable MM:SS layout
  const formatTimeDisplay = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // SVG parameters to dynamically update a circular progress outline ring
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / initialPreset) * circumference;

  return (
    <Card className="bg-black text-white border-secondary p-3 mt-4">
      <Card.Body className="text-center">
        <Card.Title className="text-info fw-semibold mb-4 d-flex align-items-center justify-content-center gap-2">
          <Timer size={18} /> Integrated Rest Recovery Timer
        </Card.Title>

        {/* Dynamic Animated SVG Progress Circle Display */}
        <div className="position-relative d-inline-flex justify-content-center align-items-center mb-4">
          <svg width="140" height="140" className="rotate-svg">
            <circle cx="70" cy="70" r={radius} stroke="#222" strokeWidth="8" fill="transparent" />
            <circle 
              cx="70" cy="70" r={radius} stroke="#0dcaf0" strokeWidth="8" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="position-absolute fs-2 fw-bold tracking-wider">
            {formatTimeDisplay(secondsLeft)}
          </div>
        </div>

        {/* Timer Core Interactive State Controls Layout */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          <Button variant={isActive ? "warning" : "info"} size="sm" className="d-flex align-items-center gap-2 px-3 py-2 text-dark fw-bold" onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause size={16} /> : <Play size={16} />} {isActive ? "Pause" : "Start"}
          </Button>
          <Button variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2 px-3 py-2 text-white" onClick={() => { setIsActive(false); setSecondsLeft(initialPreset); }}>
            <RotateCcw size={16} /> Reset
          </Button>
        </div>

        {/* Quick Tap Presets Grid */}
        <Row className="g-2">
          {[[30, "30s"], [60, "1 Min"], [90, "1.5 Min"], [120, "2 Min"]].map(([time, label]) => (
            <Col xs={6} key={time}>
              <Button 
                variant={initialPreset === time ? "info" : "outline-dark"} 
                size="sm" className={`w-100 py-2 border-secondary ${initialPreset === time ? 'text-dark fw-bold' : 'text-muted'}`}
                onClick={() => handlePresetTap(time)}
              >
                {label}
              </Button>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RestTimer;