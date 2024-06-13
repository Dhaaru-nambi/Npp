import React, { useState, useEffect } from "react";
import UserService from "../services/User-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, []);

  return (
      <div className="container mt-5 navbar-spacer">
      <header className="jumbotron bg-dark text-white p-4 shadow-sm rounded">
        <h3 className="text-center">{content}</h3>
      </header>
    </div>
  );
};

export default Home;
