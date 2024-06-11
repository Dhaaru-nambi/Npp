import CustomerService from '../services/CustomerService';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PortRequestManagement = () => {
  const [newPortRequest, setNewPortRequest] = useState({
    customerId: '',
    requestDate: ''
  });
  const [portRequests, setPortRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setMessage] = useState('');
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
        console.log(response);
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
    setMessage('');

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
      setSelectedPortRequest(portRequest); // Set the selected device
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
    <div className="container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Submit Port Request</h2>
      <div className="card card-container bg-dark text-white p-4 mb-4 rounded">
        <form onSubmit={handleSubmit} ref={form}>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">Customer ID :</label>
            <input type="number" className="form-control" id="customerId" name="customerId" value={newPortRequest.customerId} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="requestDate" className="form-label">Request Date :</label>
            <input type="date" className="form-control" id="requestDate" name="requestDate" value={newPortRequest.requestDate} onChange={handleInputChange} required />
          </div>
          
          <button type="submit" className="btn btn-light btn-block" disabled={loading}>Submit Port Request</button>
        </form>
      </div>

      <table className="table table-dark table-striped mt-4">
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
              <td>{portRequest.complianceChecked}</td>
              <td>{portRequest.completionDate}</td>
              <td>
                <button className="btn btn-light me-2" onClick={() => fetchPortRequest(portRequest.requestId)}>View</button>
                <button className="btn btn-danger me-2" onClick={() => deletePortRequest(portRequest.requestId)}>Delete</button>
                <Link to={`/update-portrequest/${portRequest.requestId}`} className="btn btn-light">Update</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPortRequest && (
        <div className="bg-dark text-white p-4 rounded mt-4">
          <h3>Port Request details :</h3>
          <p>Request ID : {selectedPortRequest.requestId}</p>
          <p>Customer ID : {selectedPortRequest.customer.customerId}</p>
          <p>Approval Status : {selectedPortRequest.approvalStatus}</p>
          <p>Request Date : {selectedPortRequest.requestDate}</p>
          <p>Compliance Checked : {selectedPortRequest.complianceChecked}</p>
          <p>Completion Date : {selectedPortRequest.completionDate}</p>
        </div>
      )}
    </div>
  );
};

export default PortRequestManagement;
