import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';
import EventBus from './common/EventBus';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import LoadingScreen from './forms/Loadingscreen'; 

import UserManagement from './forms/UserManagement';
import UpdateUser from './forms/UpdateUser';
import OperatorManagement from './forms/OperatorManagement';
import UpdateOperator from './forms/UpdateOperator';
import CustomerServiceManagement from './forms/CustomerServiceManagement';
import UpdateCustomer from './forms/UpdateCustomer';
import PortRequestManagement from './forms/PortRequestManagement';
import UpdatePortRequest from './forms/UpdatePortRequest';
import LogManagement from './forms/LogManagement';
import UpdateLog from './forms/UpdateLog';
import TrackStatus from './forms/TrackStatus';
import HelpAndSupport from './forms/HelpAndSupport';
import UserGuide1 from './forms/UserGuide1';
import UserGuide2 from './forms/UserGuide2';
import AirtelVerificationDetailsManagement from './forms/AirtelVerificationDetailsManagement';
import UpdateAirtelDetails from './forms/UpdateAirtelDetails';
import JioVerificationDetailsManagement from './forms/JioVerificationDetailsManagement';
import UpdateJioDetails from './forms/UpdateJioDetails';

const App = () => {
  const [showSystemAdmin, setShowSystemAdmin] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showComplianceOfficer, setShowComplianceOfficer] = useState(false);
  const [showAirtelComplianceOfficer, setShowAirtelComplianceOfficer] = useState(false);
  const [showJioComplianceOfficer, setShowJioComplianceOfficer] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setShowSystemAdmin(user.role.includes('ROLE_SYSTEM_ADMIN'));
      setShowCustomerService(user.role.includes('ROLE_CUSTOMER_SERVICE'));
      setShowComplianceOfficer(user.role.includes('ROLE_COMPLIANCE_OFFICER'));
      setShowAirtelComplianceOfficer(user.role.includes('ROLE_AIRTEL_COMPLIANCE_OFFICER'));
      setShowJioComplianceOfficer(user.role.includes('ROLE_JIO_COMPLIANCE_OFFICER'));
      setShowUsers(user.role.includes('ROLE_USER'));
      setCurrentUser(user);
    }

    const logoutEventHandler = () => {
      logOut();
    };

    EventBus.on('logout', logoutEventHandler);

    return () => {
      EventBus.remove('logout', logoutEventHandler);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowSystemAdmin(false);
    setShowCustomerService(false);
    setShowComplianceOfficer(false);
    setShowAirtelComplianceOfficer(false);
    setShowJioComplianceOfficer(false);
    setShowUsers(false);
    setCurrentUser(undefined);
    navigate('/login');
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <div>
      {loading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <nav className="navbar fixed-top navbar-expand-lg custom-navbar">
            <div className="container-fluid">
              <Link to={'/'} className="navbar-brand">
                PORTAFLEX
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded={!isNavCollapsed ? true : false}
                aria-label="Toggle navigation"
                onClick={handleNavCollapse}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link to={'/home'} className="nav-link" onClick={handleNavCollapse}>
                      Home
                    </Link>
                  </li>
                  {showSystemAdmin && (
                    <>
                      <li className="nav-item">
                        <Link to={'/usermanagement'} className="nav-link" onClick={handleNavCollapse}>
                          User Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={'/operatormanagement'} className="nav-link" onClick={handleNavCollapse}>
                          Operator Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  {showCustomerService && (
                    <>
                      <li className="nav-item">
                        <Link to={'/customermanagement'} className="nav-link" onClick={handleNavCollapse}>
                          Customer Service Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={'/handleportrequest'} className="nav-link" onClick={handleNavCollapse}>
                          Port Request Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  {showComplianceOfficer && (
                    <li className="nav-item">
                      <Link to={'/compliancelogs'} className="nav-link" onClick={handleNavCollapse}>
                        Logs Dashboard
                      </Link>
                    </li>
                  )}
                  {showAirtelComplianceOfficer && (
                    <li className="nav-item">
                      <Link to={'/airteldetails'} className="nav-link" onClick={handleNavCollapse}>
                        Airtel Details Dashboard
                      </Link>
                    </li>
                  )}
                  {showJioComplianceOfficer && (
                    <li className="nav-item">
                      <Link to={'/jiodetails'} className="nav-link" onClick={handleNavCollapse}>
                        Jio Details Dashboard
                      </Link>
                    </li>
                  )}
                  {showUsers && (
                    <li className="nav-item">
                      <Link to={'/trackstatus'} className="nav-link" onClick={handleNavCollapse}>
                        Track Status
                      </Link>
                    </li>
                  )}
                  {currentUser ? (
                    <>
                      <li className="nav-item">
                        <Link to={'/profile'} className="nav-link" onClick={handleNavCollapse}>
                          {currentUser.username}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={'/helpdesk'} className="nav-link" onClick={handleNavCollapse}>
                          Help&Support
                        </Link>
                      </li>
                      <li className="nav-item">
                        <a href="/login" className="nav-link" onClick={() => { logOut(); handleNavCollapse(); }}>
                          Logout
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link to={'/login'} className="nav-link" onClick={handleNavCollapse}>
                          Sign in
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={'/register'} className="nav-link" onClick={handleNavCollapse}>
                          Sign up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/helpdesk" element={<HelpAndSupport />} />
              <Route path="/help&support/userguide1" element={<UserGuide1 />} />
              <Route path="/help&support/userguide2" element={<UserGuide2 />} />
              <Route path="/usermanagement" element={<UserManagement />} />
              <Route path="/operatormanagement" element={<OperatorManagement />} />
              <Route path="/update-userrole/:userId" element={<UpdateUser />} />
              <Route path="/update-operator/:operatorId" element={<UpdateOperator />} />
              <Route path="/customermanagement" element={<CustomerServiceManagement />} />
              <Route path="/handleportrequest" element={<PortRequestManagement />} />
              <Route path="/update-customer/:customerId" element={<UpdateCustomer />} />
              <Route path="/update-portrequest/:requestId" element={<UpdatePortRequest />} />
              <Route path="/trackstatus" element={<TrackStatus />} />
              <Route path="/compliancelogs" element={<LogManagement />} />
              <Route path="/update-log/:logId" element={<UpdateLog />} />
              <Route path="/airteldetails" element={<AirtelVerificationDetailsManagement />} />
              <Route path="/update-airtel-details/:phoneNumber" element={<UpdateAirtelDetails />} />
              <Route path="/jiodetails" element={<JioVerificationDetailsManagement />} />
              <Route path="/update-jio-details/:phoneNumber" element={<UpdateJioDetails />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;