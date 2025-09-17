import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function PhysicalSensorRegistrationForm({ onSubmit }) {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [sensorInputs, setSensorInputs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const data = await res.json();
        setBuildings(data.buildings || data);
      } catch (err) {
        console.error("Failed to load buildings:", err);
        toast.error("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  // Handle building selection
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);
    setSelectedBuilding(building || null);
    setSelectedFloor(null);
    setSensorInputs([]);
    setFloors([]);

    if (!building) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/floors?buildingId=${building.building_id}`
      );
      const data = await res.json();
      const sortedFloors = (data.floors || data).sort(
        (a, b) => a.floor_number - b.floor_number
      );
      setFloors(sortedFloors);
    } catch (err) {
      console.error("Failed to load floors:", err);
      toast.error("Failed to load floors");
    }
  };

  // Handle floor selection
  const handleFloorChange = (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor);

    if (!floor) {
      setSensorInputs([]);
      return;
    }

    // Generate sensor input fields based on num_sensors
    const inputs = Array.from({ length: floor.num_sensors || 0 }, () => ({
      sensor_number: "",
      location: "",
      type: "Fire",
      sensorStatus: "Active",
    }));
    setSensorInputs(inputs);
  };

  // Handle sensor input changes
  const handleSensorChange = (index, field, value) => {
    const newInputs = [...sensorInputs];
    newInputs[index][field] = value;
    setSensorInputs(newInputs);
  };

  // Submit all sensors
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFloor) {
      return toast.error("Select a floor first");
    }

    if (!sensorInputs || sensorInputs.length === 0) {
      return toast.error("No sensors to register for this floor");
    }

    for (let i = 0; i < sensorInputs.length; i++) {
      if (!sensorInputs[i].sensor_number) {
        return toast.error(`Sensor number for sensor ${i + 1} is required`);
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        floorId: selectedFloor.floor_id,
        sensors: sensorInputs.map((s) => ({
          sensor_number: s.sensor_number,
          location: s.location || null,
          type: s.type,
          sensorStatus: s.sensorStatus,
        })),
      };

      console.log("Submitting payload:", payload);

      // 🔑 Decide: single sensor vs bulk
      if (onSubmit) {
        await onSubmit(payload);
      }

      toast.success("Sensor(s) registered successfully");
      setSensorInputs([]);
      setSelectedFloor(null);
      setSelectedBuilding(null);
      setFloors([]);
    } catch (err) {
      toast.error(err.message || "Failed to register sensor(s)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Physical Sensor Registration
      </h2>

      {/* Building */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Building</label>
        <select
          value={selectedBuilding?.building_id || ""}
          onChange={handleBuildingChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
        >
          <option value="">-- Select a building --</option>
          {buildings.map((b) => (
            <option key={b.building_id} value={b.building_id}>
              {b.building_name} {b.num_floors ? `(${b.num_floors} floors)` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Floor */}
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
                Floor {f.floor_number} (Registered Sensors: {f.num_sensors})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dynamic Sensor Inputs */}
      {sensorInputs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sensors</h3>
          {sensorInputs.map((sensor, index) => (
            <div key={index} className="mb-3 p-3 border rounded bg-gray-50">
              <h4 className="font-medium mb-2">Sensor {index + 1}</h4>

              <input
                type="text"
                placeholder="Sensor Number (e.g. F1-SEN-01)"
                value={sensor.sensor_number}
                onChange={(e) =>
                  handleSensorChange(index, "sensor_number", e.target.value)
                }
                className="w-full p-2 border rounded mb-2"
                required
              />

              <input
                type="text"
                placeholder="Location"
                value={sensor.location}
                onChange={(e) =>
                  handleSensorChange(index, "location", e.target.value)
                }
                className="w-full p-2 border rounded mb-2"
              />

              <select
                value={sensor.type}
                onChange={(e) => handleSensorChange(index, "type", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="Fire">Fire</option>
                <option value="Smoke">Smoke</option>
                <option value="Temperature">Temperature</option>
              </select>

              <select
                value={sensor.sensorStatus}
                onChange={(e) =>
                  handleSensorChange(index, "sensorStatus", e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedFloor || sensorInputs.length === 0}
        className={`w-full ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#F4003B] hover:bg-[#d10032]"
        } text-white py-2 rounded`}
      >
        {submitting ? "Registering..." : "Register Sensor(s)"}
      </button>
    </form>
  );
}
