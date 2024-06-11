import React from "react";
import AuthService from "../services/auth-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container mt-5">
      <header className="jumbotron bg-dark text-white p-4 shadow-sm rounded">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.role}
      </ul>
    </div>
  );
};

export default Profile;
