import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS, apiCall } from "../../config/api";

// QRCodeRegistrationForm Component
export default function QRCodeRegistrationForm({ onSubmit }) {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [qrCodes, setQrCodes] = useState([{ qr_code_number: "", installed_location: "" }]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.BUILDINGS);
        setBuildings(data.buildings || []); // set buildings state
      } catch (err) {
        console.error(err);
        toast.error("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  // Handle when user selects a building
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);

    setSelectedBuilding(building || null);
    setSelectedFloor(null); // reset floor selection
    setFloors([]); // reset floors list

    if (!building) return; // if no valid building, stop

    try {
      // Fetch floors for the selected building
        const data = await apiCall(API_ENDPOINTS.FLOORS_BY_BUILDING(building.building_id));
      setFloors(data.floors || []); // update floors list
    } catch (err) {
      console.error(err);
      toast.error("Failed to load floors");
    }
  };

  // Handle floor selection
  const handleFloorChange = (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor || null);
  };

  // Handle input changes for QR code fields
  const handleQrChange = (index, e) => {
    const { name, value } = e.target;
    setQrCodes((prev) =>
      prev.map((qr, i) => (i === index ? { ...qr, [name]: value } : qr))
    );
  };

  // Add new QR code input row
  const addQrCode = () => setQrCodes((prev) => [...prev, { qr_code_number: "", installed_location: "" }]);

  // Remove a specific QR code row
  const removeQrCode = (index) => setQrCodes((prev) => prev.filter((_, i) => i !== index));

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!selectedBuilding) return toast.error("Select a building first");
    if (!selectedFloor) return toast.error("Select a floor first");
    if (!qrCodes.length) return toast.error("Add at least one QR code");

    // Ensure all QR codes have numbers
    for (const qr of qrCodes) {
      if (!qr.qr_code_number.trim()) {
        return toast.error("All QR codes must have a number");
      }
    }

    // Prepare payload for API
    const payload = qrCodes.map((qr) => ({
      floor_id: selectedFloor.floor_id,
      qr_code_number: qr.qr_code_number.trim(),
      installed_location: qr.installed_location.trim() || null,
    }));

    setSubmitting(true);
    try {
      console.log("Sending QR Codes:", payload);
      await onSubmit(payload); // submit via parent callback
      toast.success("QR Codes registered successfully!");

      // Reset form after success
      setQrCodes([{ qr_code_number: "", installed_location: "" }]);
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setFloors([]);
    } catch (err) {
      toast.error(err.message || "Failed to register QR codes");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">QR Code Registration</h2>

      {/* Building dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Building</label>
        <select
          value={selectedBuilding?.building_id || ""}
          onChange={handleBuildingChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
        >
          <option value="">-- Select Building --</option>
          {buildings.map((b) => (
            <option key={b.building_id} value={b.building_id}>
              {b.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Floor dropdown */}
      {selectedBuilding && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Floor</label>
          <select
            value={selectedFloor?.floor_id || ""}
            onChange={handleFloorChange}
            className="w-full mt-1 p-2 border rounded border-gray-300"
          >
            <option value="">-- Select Floor --</option>
            {floors.map((f) => (
              <option key={f.floor_id} value={f.floor_id}>
                Floor {f.floor_number}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dynamic QR Code fields */}
      {qrCodes.map((qr, index) => (
        <div key={index} className="mb-4 p-4 border rounded relative">
          {qrCodes.length > 1 && (
            <button
              type="button"
              onClick={() => removeQrCode(index)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
          )}

          <input
            type="text"
            name="qr_code_number"
            value={qr.qr_code_number}
            onChange={(e) => handleQrChange(index, e)}
            placeholder="QR Code Number"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="installed_location"
            value={qr.installed_location}
            onChange={(e) => handleQrChange(index, e)}
            placeholder="Installed Location (optional)"
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addQrCode}
        className="w-full mb-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        + Add Another QR Code
      </button>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-2 text-white rounded ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#F4003B] hover:bg-[#d10032]"
        }`}
      >
        {submitting ? "Registering..." : "Register QR Codes"}
      </button>
    </form>
  );
}
