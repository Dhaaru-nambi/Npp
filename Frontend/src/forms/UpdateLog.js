import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComplianceOfficerService from '../services/ComplianceOfficer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function UpdateLog() {
  const navigate = useNavigate();
  const { logId } = useParams();

  const [logData, setLogData] = useState({
    portRequestId: '',
    checkPassed: '',
    notes: '',
    checkDate: ''
  });

  useEffect(() => {
    fetchLogDataById(logId);
  }, [logId]);

  const fetchLogDataById = async (logId) => {
    try {
      const response = await ComplianceOfficerService.getLog(logId);
      if (response) {
        setLogData(response);
      } else {
        console.error('Error: Log data is undefined.');
      }
    } catch (error) {
      console.error('Error fetching log data : ', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogData((prevLogData) => ({
      ...prevLogData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ComplianceOfficerService.updateLog(logData);
      navigate("/compliancelogs");
    } catch (error) {
      console.error('Error updating log : ', error);
      alert(error.message || 'An error occurred while updating log.');
    }
  };

  return (
    <div className="auth-container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Update Log</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Log ID :</label>
          <input type="number" name="logId" className="form-control" value={logData.logId || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Port Request ID :</label>
          <input type="number" name="portRequestId" className="form-control" value={logData.portRequestId || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Check Passed :</label>
          <input type="text" name="checkPassed" className="form-control" value={logData.checkPassed || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Notes :</label>
          <input type="text" name="notes" className="form-control" value={logData.notes || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Check Date :</label>
          <input type="date" name="checkDate" className="form-control" value={logData.checkDate || ''} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="btn btn-light btn-block btn-light-custom mt-3">Update Log</button>
      </form>
    </div>
  );
}

export default UpdateLog;