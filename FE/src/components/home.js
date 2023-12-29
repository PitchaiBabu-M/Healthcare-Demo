import React from "react";
import { Link } from "react-router-dom";
import ChatApp from "../chatbotAction/chatApp";
import bimagic from '../logo/DA.jpg';

const HomePage = () => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: `url(${bimagic})`,
        backgroundSize: "100% 100%",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        position: "relative"
      }}
    >
      <div className="row">
      <div className="d-flex justify-content-end mt-4 me-4">
  <Link to="/login" className="btn btn-info">
    Login
  </Link>
</div>
      </div>

      <div className=""> {/* Hide on mobile and small tablets */}
  <div className="position-absolute bottom-0 end-0 mb-4 me-4">
    <ChatApp />
  </div>
</div>

     
    </div>
  );
};

export default HomePage;
