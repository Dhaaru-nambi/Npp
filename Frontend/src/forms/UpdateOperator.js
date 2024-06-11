import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SystemAdminService from '../services/SystemAdminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function UpdateOperator() {
  const navigate = useNavigate();
  const { operatorId } = useParams();

  const [operatorData, setOperatorData] = useState({
    operatorName: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchOperatorDataById(operatorId);
  }, [operatorId]);

  const fetchOperatorDataById = async (operatorId) => {
    try {
      const response = await SystemAdminService.getOperator(operatorId);
      if (response) {
        setOperatorData(response);
      } else {
        console.error('Error: Operator data is undefined.');
      }
    } catch (error) {
      console.error('Error fetching operator data : ', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOperatorData((prevOperatorData) => ({
      ...prevOperatorData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await SystemAdminService.updateOperator(operatorData);
      navigate("/operatormanagement");
    } catch (error) {
      console.error('Error updating operator : ', error);
      alert(error.message || 'An error occurred while updating operator.');
    }
  };

  return (
    <div className="auth-container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Update Operator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Operator Name :</label>
          <input type="text" name="operatorName" className="form-control" value={operatorData.operatorName || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Contact Info :</label>
          <input type="email" name="contactInfo" className="form-control" value={operatorData.contactInfo || ''} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="btn btn-light btn-block btn-light-custom mt-3">Update Operator</button>
      </form>
    </div>
  );
}

export default UpdateOperator;
