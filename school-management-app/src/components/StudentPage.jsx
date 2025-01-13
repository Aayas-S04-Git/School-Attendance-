import React, { useState, useEffect } from 'react';
import '../styles/StudentPage.css';

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    division: '',
    rollNo: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(savedStudents);
    setFilteredStudents(savedStudents);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!newStudent.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (newStudent.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Class validation
    if (!newStudent.class.trim()) {
      newErrors.class = 'Class is required';
    }

    // Division validation
    if (!newStudent.division.trim()) {
      newErrors.division = 'Division is required';
    }

    // Roll No validation
    if (!newStudent.rollNo.trim()) {
      newErrors.rollNo = 'Roll Number is required';
    } else if (!/^\d+$/.test(newStudent.rollNo)) {
      newErrors.rollNo = 'Roll Number must be numeric';
    }

    // Contact validation
    if (newStudent.contact.trim() && !/^\d{10}$/.test(newStudent.contact)) {
      newErrors.contact = 'Contact must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.class || !newStudent.rollNo) {
      alert('Please fill all required fields');
      return;
    }

    const updatedStudents = editingStudent 
      ? students.map(student => 
          student.rollNo === editingStudent.rollNo ? newStudent : student
        )
      : [...students, { ...newStudent, id: Date.now() }];

    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    // Reset form
    setNewStudent({ name: '', class: '', rollNo: '', contact: '' });
    setEditingStudent(null);
    setSearchTerm(''); // Clear search when adding/editing
  };

  const editStudent = (student) => {
    setNewStudent(student);
    setEditingStudent(student);
  };

  const deleteStudent = (rollNoToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete the student record for Roll No: ${rollNoToDelete}?

This will remove:
- Student Information
- All Attendance Records
- Any Associated Data

This action CANNOT be undone.`);
    
    if (confirmDelete) {
      try {
        // Remove student from students list
        const updatedStudents = students.filter(student => student.rollNo !== rollNoToDelete);
        setStudents(updatedStudents);
        
        // Update filtered students, maintaining search context
        const updatedFilteredStudents = filteredStudents.filter(student => student.rollNo !== rollNoToDelete);
        setFilteredStudents(updatedFilteredStudents);
        
        localStorage.setItem('students', JSON.stringify(updatedStudents));

        // Remove all attendance records for this student
        const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '{}');
        const updatedAttendance = Object.keys(savedAttendance).reduce((acc, date) => {
          acc[date] = { ...savedAttendance[date] };
          delete acc[date][rollNoToDelete];
          return acc;
        }, {});
        localStorage.setItem('attendance', JSON.stringify(updatedAttendance));

        // Optional: Add logging or notification
        console.log(`Student with Roll No ${rollNoToDelete} has been completely removed.`);
        alert(`Student record for Roll No ${rollNoToDelete} has been deleted.`);
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(term) ||
      student.rollNo.toLowerCase().includes(term) ||
      student.class.toLowerCase().includes(term) ||
      (student.contact && student.contact.toLowerCase().includes(term)) ||
      student.division.toLowerCase().includes(term)
    );

    setFilteredStudents(filtered);
  };

  return (
    <div className="student-page">
      <h2>Student Management</h2>
      <div className="student-form">
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={newStudent.class}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={newStudent.rollNo}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={newStudent.contact}
            onChange={handleInputChange}
          />
        </div>
        <button 
          onClick={addStudent}
          className="submit-btn"
        >
          {editingStudent ? 'Update Student' : 'Add Student'}
        </button>
      </div>

      <div className="student-list">
        <div className="search-container">
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search students" 
              value={searchTerm} 
              onChange={handleSearch}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn" 
                onClick={() => {
                  setSearchTerm('');
                  setFilteredStudents(students);
                }}
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && filteredStudents.length === 0 && (
            <div className="no-results">
              No students found matching "{searchTerm}"
            </div>
          )}
          <div className="search-stats">
            {searchTerm 
              ? `${filteredStudents.length} of ${students.length} students found`
              : `Total Students: ${students.length}`
            }
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Roll No</th>
              <th>Contact</th>
              <th>Update Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.rollNo}>
                <td data-label="Name">{student.name}</td>
                <td data-label="Class">{student.class}</td>
                <td data-label="Roll No">{student.rollNo}</td>
                <td data-label="Contact">{student.contact}</td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button 
                      onClick={() => editStudent(student)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteStudent(student.rollNo)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPage;
