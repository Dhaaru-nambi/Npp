import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomerService from '../services/CustomerService';
import 'bootstrap/dist/css/bootstrap.min.css';

const PortRequestManagement = () => {
  const [newPortRequest, setNewPortRequest] = useState({
    customerId: '',
    requestDate: ''
  });
  const [portRequests, setPortRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortRequest, setSelectedPortRequest] = useState(null);

  const form = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortRequests();
  }, []);

  const fetchPortRequests = () => {
    CustomerService.viewPortRequests()
      .then(response => {
        setPortRequests(response);
      })
      .catch(error => {
        console.error('Error fetching PortRequests:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPortRequest({ ...newPortRequest, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    CustomerService.submitPortRequest(newPortRequest)
      .then(() => {
        alert('PortRequest added successfully');
        setNewPortRequest({
          customerId: '',
          requestDate: ''
        });
        fetchPortRequests();
      })
      .catch(error => {
        console.error('Error adding PortRequest:', error);
        alert('An error occurred while adding PortRequest');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchPortRequest = async (requestId) => {
    try {
      const portRequest = await CustomerService.getPortRequest(requestId);
      setSelectedPortRequest(portRequest);
    } catch (error) {
      console.error('Error fetching port request by ID : ', error);
    }
  };

  const deletePortRequest = (requestId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this port request ?');
    if (confirmDelete) {
      CustomerService.deletePortRequest(requestId)
        .then(() => {
          fetchPortRequests();
        })
        .catch(error => {
          console.error('Error deleting port request : ', error);
        });
    }
  };

  return (
    <div className="container text-white">
      <h2>Submit Port Request</h2>
      <div className="card card-container bg-dark">
        <form onSubmit={handleSubmit} ref={form}>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">Customer ID : </label>
            <input type="number" className="form-control" id="customerId" name="customerId" value={newPortRequest.customerId} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="requestDate" className="form-label">Request Date : </label>
            <input type="date" className="form-control" id="requestDate" name="requestDate" value={newPortRequest.requestDate} onChange={handleInputChange} required />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>Submit Port Request</button>
        </form>
      </div>

      <table className="table mt-4 text-dark">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer ID</th>
            <th>Approval Status</th>
            <th>Request Date</th>
            <th>Compliance Check</th>
            <th>Completion Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portRequests.map(portRequest => (
            <tr key={portRequest.requestId}>
              <td>{portRequest.requestId}</td>
              <td>{portRequest.customer.customerId}</td>
              <td>{portRequest.approvalStatus}</td>
              <td>{portRequest.requestDate}</td>
              <td>{portRequest.complianceChecked.toString()}</td>
              <td>{portRequest.completionDate}</td>
              <td>
                <button className="btn btn-primary" onClick={() => fetchPortRequest(portRequest.requestId)}>View</button>
                <button className="btn btn-danger" onClick={() => deletePortRequest(portRequest.requestId)}>Delete</button>
                <Link to={`/update-portrequest/${portRequest.requestId}`} className="btn btn-info">Update</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPortRequest && (
        <div>
          <h3>Port Request details :</h3>
          <p>Request ID : {selectedPortRequest.requestId}</p>
          <p>Customer ID : {selectedPortRequest.customer.customerId}</p>
          <p>Approval Status : {selectedPortRequest.approvalStatus}</p>
          <p>Request Date : {selectedPortRequest.requestDate}</p>
          <p>Compliance Checked : {selectedPortRequest.complianceChecked.toString()}</p>
          <p>Completion Date : {selectedPortRequest.completionDate}</p>
        </div>
      )}
    </div>
  );
};
 
export default PortRequestManagement;
