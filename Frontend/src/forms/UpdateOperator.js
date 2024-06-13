import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SystemAdminService from '../services/SystemAdminService';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      console.error('Error fetching operator data:', error);
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
      console.error('Error updating operator:', error);
      alert(error.message || 'An error occurred while updating operator.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-white">Update Operator</h2>
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        <div className="mb-3">
          <label htmlFor="operatorName" className="form-label text-white">Operator Name :</label>
          <input type="text" className="form-control" id="operatorName" name="operatorName" value={operatorData.operatorName || ''} onChange={handleInputChange} style={{ backgroundColor: 'white', color: 'black' }} />
        </div>
        <div className="mb-3">
          <label htmlFor="contactInfo" className="form-label text-white">Contact Info :</label>
          <input type="email" className="form-control" id="contactInfo" name="contactInfo" value={operatorData.contactInfo || ''} onChange={handleInputChange} style={{ backgroundColor: 'white', color: 'black' }} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default UpdateOperator;
