import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerService from '../services/CustomerService';
import 'bootstrap/dist/css/bootstrap.min.css';

function UpdateCustomer() {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentOperatorId: '',
    newOperatorId: ''
  });

  useEffect(() => {
    fetchCustomerDataById(customerId);
  }, [customerId]);

  const fetchCustomerDataById = async (customerId) => {
    try {
       
      const response = await CustomerService.getCustomer(customerId);
      if (response) {
        setCustomerData(response);
      } else {
        console.error('Error: Customer data is undefined.');
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevCustomerData) => ({
      ...prevCustomerData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CustomerService.updateCustomer(customerData);
      navigate("/customermanagement");
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(error.message || 'An error occurred while updating customer.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-white bg-dark p-2 rounded">Update Customer</h2>
      <div className="card card-container bg-dark text-white p-4 mb-4 rounded">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Customer Name :</label>
            <input type="text" className="form-control" id="name" name="name" value={customerData.name || ''} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email :</label>
            <input type="email" className="form-control" id="email" name="email" value={customerData.email || ''} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number :</label>
            <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" value={customerData.phoneNumber || ''} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="currentOperatorId" className="form-label">Current Operator ID :</label>
            <input type="number" className="form-control" id="currentOperatorId" name="currentOperatorId" value={customerData.currentOperatorId || ''} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="newOperatorId" className="form-label">New Operator ID :</label>
            <input type="number" className="form-control" id="newOperatorId" name="newOperatorId" value={customerData.newOperatorId || ''} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn btn-light btn-block">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomer;
