// src/Pages/HomePage.js

// Import forms
import CustomerRegistrationForm from "../Components/Forms/CustomerRegistrationForm";
import BuildingRegistrationForm from "../Components/Forms/BuildingRegistrationForm";
import FloorRegistrationForm from "../Components/Forms/FloorRegistrationForm";
import CustomerBuildingForm from "../Components/Forms/CustomerBuildingForm"; // ✅ new

// Import Toastify for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  // Function to submit customer data to backend
  const submitCustomer = async (data) => {
    const res = await fetch("http://localhost:5000/api/customers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Failed to save customer");
    }
    return json;
  };

  // Function to submit building data to backend
  const submitBuilding = async (data) => {
    const res = await fetch("http://localhost:5000/api/buildings/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to save building");
    return json;
  };

  // Function to submit floor data to backend
  const submitFloor = async (data) => {
    const res = await fetch("http://localhost:5000/api/floors/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to save floor");
    return json;
  };

  // ✅ Function to submit customer-building relation
  const submitCustomerBuilding = async (data) => {
    const res = await fetch("http://localhost:5000/api/customer-building", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to link customer and building");
    return json;
  };

  return (
    <>
      {/* Container for registration forms side by side */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        {/* Customer Registration Form */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <CustomerRegistrationForm onSubmit={submitCustomer} />
        </div>

        {/* Building Registration Form */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <BuildingRegistrationForm onSubmit={submitBuilding} />
        </div>

        {/* Floor Registration Form */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <FloorRegistrationForm onSubmit={submitFloor} />
        </div>

        {/* ✅ Customer-Building Linking Form */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <CustomerBuildingForm onSubmit={submitCustomerBuilding} />
        </div>
      </div>

      {/* ✅ Toast container at root level */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default HomePage;
