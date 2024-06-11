import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SystemAdminService from '../services/SystemAdminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function UpdateUser() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userId: '',
    role: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await SystemAdminService.updateUserRole(userData);
      navigate("/usermanagement");
    } catch (error) {
      console.error('Error updating user : ', error);
      alert(error.message || 'An error occurred while updating user.');
    }
  };

  return (
    <div className="auth-container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Update Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID :</label>
          <input type="number" name="userId" className="form-control" value={userData.userId || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Role :</label>
          <select className="form-select" id="role" name="role" value={userData.role} onChange={handleInputChange} required>
            <option value="">Select Role</option>
            <option value="ROLE_SYSTEM_ADMIN">ROLE_SYSTEM_ADMIN</option>
            <option value="ROLE_COMPLIANCE_OFFICER">ROLE_COMPLIANCE_OFFICER</option>
            <option value="ROLE_CUSTOMER_SERVICE">ROLE_CUSTOMER_SERVICE</option>
            <option value="ROLE_USER">ROLE_USER</option>
          </select>
        </div>
        <button type="submit" className="btn btn-light btn-block btn-light-custom mt-3">Update Role</button>
      </form>
      <div className="text-center mt-3">
        <button className="btn btn-default btn-sm" onClick={() => navigate("/usermanagement")}>Back to User Management</button>
      </div>
    </div>
  );
}

export default UpdateUser;
