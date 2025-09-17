import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function VirtualSensorRegistrationForm({ onSubmit }) {
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [physicalSensors, setPhysicalSensors] = useState([]);
  const [sensorInputs, setSensorInputs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch floors
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/floors");
        const data = await res.json();
        setFloors(data.floors || data);
      } catch (err) {
        toast.error("Failed to load floors");
      }
    };
    fetchFloors();
  }, []);

  // Fetch physical sensors for linking
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sensors");
        const data = await res.json();
        setPhysicalSensors(data || []);
      } catch (err) {
        toast.error("Failed to load physical sensors");
      }
    };
    fetchSensors();
  }, []);

  // Handle adding a new virtual sensor input
  const addSensorInput = () => {
    setSensorInputs([
      ...sensorInputs,
      { sensor_id: "", model_reference: "", animation_status: "Normal" },
    ]);
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    const newInputs = [...sensorInputs];
    newInputs[index][field] = value;
    setSensorInputs(newInputs);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFloor) return toast.error("Select a floor");

    if (sensorInputs.length === 0) return toast.error("Add at least one sensor");

    setSubmitting(true);
    try {
      const payload = {
        floorId: selectedFloor.floor_id,
        sensors: sensorInputs,
      };

      if (onSubmit) await onSubmit(payload);
      else {
        await fetch("http://localhost:5000/api/virtual-sensors/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      toast.success("Virtual sensors registered successfully");
      setSensorInputs([]);
      setSelectedFloor(null);
    } catch (err) {
      toast.error("Failed to register virtual sensors");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Virtual Sensor Registration</h2>

      {/* Floor Selector */}
      <select
        value={selectedFloor?.floor_id || ""}
        onChange={(e) =>
          setSelectedFloor(floors.find((f) => f.floor_id == e.target.value))
        }
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">-- Select Floor --</option>
        {floors.map((f) => (
          <option key={f.floor_id} value={f.floor_id}>
            Floor {f.floor_number}
          </option>
        ))}
      </select>

      {/* Sensor Inputs */}
      {sensorInputs.map((sensor, idx) => (
        <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
          <h4 className="font-medium mb-2">Virtual Sensor {idx + 1}</h4>

          {/* Physical sensor selector */}
          <select
            value={sensor.sensor_id}
            onChange={(e) => handleChange(idx, "sensor_id", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">-- Select Physical Sensor --</option>
            {physicalSensors.map((ps) => (
              <option key={ps.sensor_id} value={ps.sensor_id}>
                {ps.sensor_number} ({ps.type})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Model Reference"
            value={sensor.model_reference}
            onChange={(e) => handleChange(idx, "model_reference", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <select
            value={sensor.animation_status}
            onChange={(e) => handleChange(idx, "animation_status", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Normal">Normal</option>
            <option value="FireDetected">Fire Detected</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      ))}

      <button
        type="button"
        onClick={addSensorInput}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        + Add Virtual Sensor
      </button>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full ${
          submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        } text-white py-2 rounded`}
      >
        {submitting ? "Registering..." : "Register Virtual Sensors"}
      </button>
    </form>
  );
}
