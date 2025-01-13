import React, { useState } from 'react'
import './App.css'

// Components
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import StudentPage from './components/StudentPage'
import AttendancePage from './components/AttendancePage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home />
      case 'students':
        return <StudentPage />
      case 'attendance':
        return <AttendancePage />
      default:
        return <Home />
    }
  }

  return (
    <div className="app-container">
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
