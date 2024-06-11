import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/npp-websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/portRequestStatus", (message) => {
        if (message.body) {
          const newNotification = JSON.parse(message.body);
          setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        }
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {notifications.map((notification, index) => (
        <div key={index} className="alert alert-info">
          {`Porting Request ${notification.id} status updated to ${notification.status}`}
        </div>
      ))}
    </div>
  );
};

export default Notification;
