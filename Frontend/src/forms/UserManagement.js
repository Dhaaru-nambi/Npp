import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SystemAdminService from '../services/SystemAdminService';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const form = useRef();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    SystemAdminService.viewUsers()
      .then(response => {
        setUsers(response);
        console.log(response);
      })
      .catch(error => {
        console.error('Error fetching users : ', error);
      });
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="mb-5 text-white">USER MANAGEMENT</h2>
      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Password Hash</th>
            <th>Operator ID</th>
            <th>Role ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className="text-white">{user.userId}</td>
              <td className="text-white">{user.username}</td>
              <td className="text-white">{user.passwordHash}</td>
              <td className="text-white">{user.operator.operatorId}</td>
              <td className="text-white">{user.role.id}</td>
              <td>
                <Link to={`/update-userrole/${user.userId}`} className="btn btn-primary btn-sm">
                  Update
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
