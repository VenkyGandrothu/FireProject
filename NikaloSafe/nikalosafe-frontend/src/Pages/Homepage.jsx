// src/Pages/HomePage.jsx
import CustomerRegistrationForm from "../Components/Forms/CustomerRegistrationForm";
import BuildingRegistrationForm from "../Components/Forms/BuildingRegistrationForm";
import FloorRegistrationForm from "../Components/Forms/FloorRegistrationForm";
import CustomerBuildingForm from "../Components/Forms/CustomerBuildingForm";
import AddSensorForm from "../Components/Forms/PhysicalSensorRegistrationForm";
import VirtualSensorRegistrationForm from "../Components/Forms/VirtualSensorRegistrationForm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const submitCustomer = async (data) => {
    const res = await fetch("http://localhost:5000/api/customers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to save customer");
    return json;
  };

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

  const submitCustomerBuilding = async (data) => {
    const res = await fetch("http://localhost:5000/api/customer-building", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(json.message || "Failed to link customer and building");
    return json;
  };

  // Single sensor
  const submitSensor = async (payload) => {
    const res = await fetch("http://localhost:5000/api/sensors/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        floorId: payload.floorId,
        ...payload.sensors[0], // take the first one
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to save sensor");
    return json;
  };

  // Multiple sensors
  const submitSensorsBulk = async (payload) => {
    const res = await fetch("http://localhost:5000/api/sensors/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to save sensors");
    return json;
  };

  //  Virtual Sensors (handles single + bulk)
  const submitVirtualSensor = async (data) => {
    const endpoint = Array.isArray(data)
      ? "http://localhost:5000/api/virtual-sensors/bulk"
      : "http://localhost:5000/api/virtual-sensors/register";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(json.message || "Failed to save virtual sensor(s)");
    return json;
  };

  //  Smart wrapper: decide single vs bulk
  const handleSensorSubmit = async (payload) => {
    if (payload.sensors.length === 1) {
      return submitSensor(payload);
    } else {
      return submitSensorsBulk(payload);
    }
  };

  return (
    <>
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
        <div style={{ flex: 1, minWidth: "300px" }}>
          <CustomerRegistrationForm onSubmit={submitCustomer} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <BuildingRegistrationForm onSubmit={submitBuilding} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <CustomerBuildingForm onSubmit={submitCustomerBuilding} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <FloorRegistrationForm onSubmit={submitFloor} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {/* Smart handler passed */}
          <AddSensorForm onSubmit={handleSensorSubmit} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {/* Virtual Sensors mounted here */}
          <VirtualSensorRegistrationForm onSubmit={submitVirtualSensor} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default HomePage;
