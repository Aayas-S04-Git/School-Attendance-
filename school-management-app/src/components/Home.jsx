import React from 'react';
import '../styles/Home.css';
import { FaUserGraduate, FaClipboardList, FaChartPie } from 'react-icons/fa';

function Home() {
  const features = [
    {
      icon: <FaUserGraduate />,
      title: 'Student Management',
      description: 'Easily add, update, and track student information.'
    },
    {
      icon: <FaClipboardList />,
      title: 'Daily Attendance',
      description: 'Record and monitor student attendance effortlessly.'
    },
    {
      icon: <FaChartPie />,
      title: 'Comprehensive Reports',
      description: 'Generate detailed attendance insights and analytics.'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Attendance Management System</h1>
          <p>Streamline student tracking and attendance with our intuitive platform</p>
          <div className="hero-cta">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="illustration-bg"></div>
        </div>
      </div>

      <div className="home-features">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
