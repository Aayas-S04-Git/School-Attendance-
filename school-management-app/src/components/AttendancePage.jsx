import React, { useState, useEffect } from 'react';
import '../styles/AttendancePage.css';

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [dailyAttendanceLog, setDailyAttendanceLog] = useState({});
  const [selectedDateAttendance, setSelectedDateAttendance] = useState(null);
  const [selectedDateSummary, setSelectedDateSummary] = useState(null);
  const [recentlyAddedDate, setRecentlyAddedDate] = useState(null);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const savedDailyAttendanceLog = JSON.parse(localStorage.getItem('dailyAttendanceLog') || '{}');
    
    setStudents(savedStudents);
    setAttendance(savedAttendance);
    setDailyAttendanceLog(savedDailyAttendanceLog);
  }, []);

  const markAttendance = (rollNo, status) => {
    const newAttendance = { 
      ...attendance, 
      [attendanceDate]: {
        ...(attendance[attendanceDate] || {}),
        [rollNo]: status
      }
    };

    setAttendance(newAttendance);
  };

  const submitAttendance = () => {
    const dailyAttendance = attendance[attendanceDate] || {};
    
    // Ensure all students have an attendance status
    const completeAttendance = students.reduce((acc, student) => {
      acc[student.rollNo] = dailyAttendance[student.rollNo] ?? false;
      return acc;
    }, {});

    // Check if any attendance has been marked
    const hasAttendanceMarked = Object.keys(completeAttendance).length > 0;
    
    if (!hasAttendanceMarked) {
      alert('Please mark attendance for at least one student before submitting.');
      return;
    }

    // Update daily attendance log
    const updatedDailyAttendanceLog = {
      ...dailyAttendanceLog,
      [attendanceDate]: completeAttendance
    };

    // Save to localStorage
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('dailyAttendanceLog', JSON.stringify(updatedDailyAttendanceLog));
    
    setDailyAttendanceLog(updatedDailyAttendanceLog);
    
    // Set the recently added date for highlighting
    setRecentlyAddedDate(attendanceDate);
    
    // Reset current day's attendance
    const newAttendance = {...attendance};
    delete newAttendance[attendanceDate];
    setAttendance(newAttendance);

    // Automatically select the newly submitted attendance
    viewDayAttendance(attendanceDate);

    alert(`Attendance for ${formatDate(attendanceDate)} has been submitted and stored.`);
  };

  const calculateAttendanceSummary = (attendanceData) => {
    if (!attendanceData) return { presentCount: 0, absentCount: 0, totalStudents: students.length };
    
    const presentCount = Object.values(attendanceData).filter(status => status === true).length;
    const absentCount = Object.values(attendanceData).filter(status => status === false).length;

    return {
      presentCount,
      absentCount,
      totalStudents: students.length
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const sortedAttendanceDates = Object.keys(dailyAttendanceLog)
    .sort((a, b) => new Date(b) - new Date(a))
    .filter(date => {
      // Ensure the date is valid and not a random string
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && 
             parsedDate.getFullYear() > 2000 && 
             parsedDate.getFullYear() < 2100;
    });

  const viewDayAttendance = (date) => {
    const dayAttendance = dailyAttendanceLog[date];
    const dateSummary = calculateAttendanceSummary(dayAttendance);
    
    setSelectedDateAttendance(dayAttendance);
    setSelectedDateSummary(dateSummary);
    
    // Set the current attendance date to the selected date
    setAttendanceDate(date);
  };

  const { presentCount, absentCount, totalStudents } = calculateAttendanceSummary(
    attendance[attendanceDate]
  );

  return (
    <div className="attendance-page">
      <h2>Attendance Management</h2>
      
      <div className="attendance-controls">
        <div className="date-selection">
          <input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
        
        <div className="attendance-summary">
          <div className="summary-item total">
            <span className="label">Total Students</span>
            <span className="count">{totalStudents}</span>
          </div>
          <div className="summary-item present">
            <span className="label">Present</span>
            <span className="count">{presentCount}</span>
          </div>
          <div className="summary-item absent">
            <span className="label">Absent</span>
            <span className="count">{absentCount}</span>
          </div>
        </div>
      </div>

      <div className="attendance-section">
        <div className="current-attendance">
          <h3>Mark Today's Attendance</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const dailyAttendance = attendance[attendanceDate] || {};
                const isPresent = dailyAttendance[student.rollNo] === true;
                const isAbsent = dailyAttendance[student.rollNo] === false;

                return (
                  <tr key={student.rollNo}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.class}</td>
                    <td>
                      <div className="attendance-buttons">
                        <button 
                          onClick={() => markAttendance(student.rollNo, true)}
                          className={`present-btn ${isPresent ? 'active' : ''}`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => markAttendance(student.rollNo, false)}
                          className={`absent-btn ${isAbsent ? 'active' : ''}`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">
                  <button 
                    className="submit-attendance-btn"
                    onClick={submitAttendance}
                    disabled={Object.keys(attendance[attendanceDate] || {}).length === 0}
                  >
                    Submit Today's Attendance
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="past-attendance">
          <h3>Past Attendance Records</h3>
          <table className="past-attendance-dates">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttendanceDates.map(date => (
                <tr 
                  key={date} 
                  className={date === recentlyAddedDate ? 'recent-attendance' : ''}
                >
                  <td>{formatDate(date)}</td>
                  <td>
                    <button 
                      onClick={() => viewDayAttendance(date)}
                      className="view-attendance-btn"
                    >
                      View Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDateAttendance && (
        <div className="selected-date-attendance">
          <div className="selected-date-header">
            <h3>{formatDate(Object.keys(selectedDateAttendance)[0])}</h3>
            <div className="selected-date-summary">
              <div className="summary-item total">
                <span className="label">Total Students</span>
                <span className="count">{selectedDateSummary.totalStudents}</span>
              </div>
              <div className="summary-item present">
                <span className="label">Present</span>
                <span className="count">{selectedDateSummary.presentCount}</span>
              </div>
              <div className="summary-item absent">
                <span className="label">Absent</span>
                <span className="count">{selectedDateSummary.absentCount}</span>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(student => selectedDateAttendance[student.rollNo] !== undefined)
                .map(student => (
                  <tr key={student.rollNo}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>
                      {selectedDateAttendance[student.rollNo] ? 'Present' : 'Absent'}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;
