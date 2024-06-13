import React from "react";
import AuthService from "../services/auth-service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container mt-5 navbar-spacer">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow card-custom">
            <div className="card-body card-body-custom">
              <h3 className="card-title mb-4 text-center" style={{ padding: '15px', borderRadius: '10px', height: '60px', fontFamily: 'initial' }}>USER PROFILE</h3>
              <div className="mb-3">
                <strong>Username:</strong> {currentUser.username}
              </div>
              <div className="mb-3">
                <strong>ID:</strong> {currentUser.id}
              </div>
              <div className="mb-3">
                <strong>Authorities:</strong> {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
