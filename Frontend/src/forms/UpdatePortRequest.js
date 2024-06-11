import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerService from '../services/CustomerService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function UpdatePortRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [portRequestData, setPortRequestData] = useState({
    requestId: '',
    customerId: '',
    requestDate: ''
  });

  useEffect(() => {
    fetchPortRequestDataById(requestId);
  }, [requestId]);

  const fetchPortRequestDataById = async (requestId) => {
    try {
      const response = await CustomerService.getPortRequest(requestId);
      if (response) {
        setPortRequestData(response);
      } else {
        console.error('Error: Port request data is undefined.');
      }
    } catch (error) {
      console.error('Error fetching port request data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortRequestData((prevPortRequestData) => ({
      ...prevPortRequestData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CustomerService.updatePortRequest(portRequestData);
      navigate("/handleportrequest");
    } catch (error) {
      console.error('Error updating port request : ', error);
      alert(error.message || 'An error occurred while updating port request.');
    }
  };

  return (
    <div className="auth-container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Update Port Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Request ID :</label>
          <input type="number" name="requestId" className="form-control" value={portRequestData.requestId || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Customer ID :</label>
          <input type="number" name="customerId" className="form-control" value={portRequestData.customerId || ''} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Request Date :</label>
          <input type="date" name="requestDate" className="form-control" value={portRequestData.requestDate || ''} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="btn btn-light btn-block btn-light-custom mt-3">Update Port Request</button>
      </form>
    </div>
  );
}

export default UpdatePortRequest;