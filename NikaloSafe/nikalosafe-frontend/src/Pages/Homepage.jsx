// src/Pages/HomePage.js

// Import forms for customer and building registration
import CustomerRegistrationForm from "../Components/Forms/CustomerRegistrationForm";
import BuildingRegistrationForm from "../Components/Forms/BuildingRegistrationForm";

// Import Toastify for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  // Function to submit customer data to backend
  const submitCustomer = async (data) => {
    const res = await fetch("http://localhost:5000/api/customers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // Convert form data to JSON
    });
    const json = await res.json();
    if (!res.ok) {
      // Throw error if response is not ok
      throw new Error(json.message || "Failed to save customer");
    }
    return json; // Return backend response
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

  return (
    <>
      {/* Container for both registration forms side by side */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        {/* Customer Registration Form */}
        <div style={{ flex: 1 }}>
          <CustomerRegistrationForm onSubmit={submitCustomer} />
        </div>

        {/* Building Registration Form */}
        <div style={{ flex: 1 }}>
          <BuildingRegistrationForm onSubmit={submitBuilding} />
        </div>
      </div>

      {/* ✅ Toast container at root level for showing notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default HomePage;
