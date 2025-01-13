import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ setCurrentPage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
         Attendance Books
      </div>
      <nav className="sidebar-nav">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('students')}>Students</button>
        <button onClick={() => setCurrentPage('attendance')}>Attendance</button>
      </nav>
    </div>
  );
}

export default Sidebar;
