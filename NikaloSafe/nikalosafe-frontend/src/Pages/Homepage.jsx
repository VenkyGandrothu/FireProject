// src/Pages/HomePage.jsx

// Import all form components for various registration steps
import CustomerRegistrationForm from "../Components/Forms/CustomerRegistrationForm";
import BuildingRegistrationForm from "../Components/Forms/BuildingRegistrationForm";
import FloorRegistrationForm from "../Components/Forms/FloorRegistrationForm";
import CustomerBuildingForm from "../Components/Forms/CustomerBuildingForm";
import AddSensorForm from "../Components/Forms/PhysicalSensorRegistrationForm";
import VirtualSensorRegistrationForm from "../Components/Forms/VirtualSensorRegistrationForm";
import ExitPathRegistrationForm from "../Components/Forms/ExitPathRegistrationForm"; 
import QRCodeRegistrationForm from "../Components/Forms/QRCodeRegistrationForm";
import LinkQrToPathsForm from "../Components/Forms/LinkQrToPathsForm";

// Import ToastContainer to display notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import API configuration
import { API_ENDPOINTS, apiCall } from "../config/api";

function HomePage() {
  // ----------------------
  // API Submission Functions
  // ----------------------

  // Submit new customer data
  const submitCustomer = async (data) => {
    return await apiCall(API_ENDPOINTS.CUSTOMER_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Submit new building data
  const submitBuilding = async (data) => {
    return await apiCall(API_ENDPOINTS.BUILDING_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Submit new floor data
  const submitFloor = async (data) => {
    return await apiCall(API_ENDPOINTS.FLOOR_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Link customer to a building
  const submitCustomerBuilding = async (data) => {
    return await apiCall(API_ENDPOINTS.CUSTOMER_BUILDING_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Submit a single physical sensor
  const submitSensor = async (payload) => {
    return await apiCall(API_ENDPOINTS.PHYSICAL_SENSOR_REGISTER, {
      method: "POST",
      body: JSON.stringify({
        floor_id: payload.floorId,
        ...payload.sensors[0],
      }),
    });
  };

  // Submit multiple physical sensors in bulk
  const submitSensorsBulk = async (payload) => {
    return await apiCall(API_ENDPOINTS.PHYSICAL_SENSORS_BULK, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  // Submit virtual sensors (single or bulk)
  const submitVirtualSensor = async (data) => {
    const endpoint = Array.isArray(data)
      ? API_ENDPOINTS.VIRTUAL_SENSORS_BULK
      : API_ENDPOINTS.VIRTUAL_SENSOR_REGISTER;

    return await apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Submit exit path data
  const submitExitPath = async (data) => {
    console.log("Sending Exit Path payload to server:", JSON.stringify(data, null, 2));
    const result = await apiCall(API_ENDPOINTS.EXIT_PATH_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("Exit Path saved:", result);
    return result;
  };

  // Submit QR codes (single or multiple)
  const submitQRCode = async (data) => {
    return await apiCall(API_ENDPOINTS.QR_CODE_REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // Link QR code to exit paths
  const submitLinkQrToPaths = async (payload) => {
    return await apiCall(API_ENDPOINTS.LINK_QR_TO_PATHS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  // Smart wrapper to decide between single or bulk physical sensor submission
  const handleSensorSubmit = async (payload) => {
    if (payload.sensors.length === 1) {
      return submitSensor(payload);
    } else {
      return submitSensorsBulk(payload);
    }
  };

  // ----------------------
  // JSX Layout
  // ----------------------
  return (
    <>
      {/* Main container for steps */}
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
        {/* Step 1: Customer registration */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Register Customer</h2>
          <CustomerRegistrationForm onSubmit={submitCustomer} />
        </section>

        {/* Step 2: Building registration */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Register Building</h2>
          <BuildingRegistrationForm onSubmit={submitBuilding} />
        </section>

        {/* Step 3: Link customer to building */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 3: Link Customer to Building</h2>
          <CustomerBuildingForm onSubmit={submitCustomerBuilding} />
        </section>

        {/* Step 4: Floor registration */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 4: Register Floor</h2>
          <FloorRegistrationForm onSubmit={submitFloor} />
        </section>

        {/* Step 5: Sensor registration (physical + virtual) */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 5: Register Sensors</h2>
          <p className="text-sm text-gray-600 mb-2">
            Add physical or virtual sensors for each floor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical sensors */}
            <AddSensorForm onSubmit={handleSensorSubmit} />
            {/* Virtual sensors */}
            <VirtualSensorRegistrationForm onSubmit={submitVirtualSensor} />
          </div>
        </section>

        {/* Step 6: Exit Path registration */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 6: Register Exit Paths</h2>
          <ExitPathRegistrationForm onSubmit={submitExitPath} />
        </section>
      </div>

      {/* Step 7: QR Codes registration */}
      <section className="bg-gray-50 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Step 7: Register QR Codes</h2>
        <QRCodeRegistrationForm onSubmit={submitQRCode} />
      </section>

      {/* Step 8: Link QR Codes to Exit Paths */}
      <section className="bg-gray-50 rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Step 8: Link QR Codes to Exit Paths</h2>
        {/* Form handles its own fetch; the helper is available if needed */}
        <LinkQrToPathsForm onSubmit={submitLinkQrToPaths} />
      </section>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default HomePage;
