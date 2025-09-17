import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function VirtualSensorRegistrationForm({ onSubmit }) {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [physicalSensors, setPhysicalSensors] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Manage a list of virtual sensors per physical sensor
  const [virtualSensors, setVirtualSensors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const data = await res.json();
        setBuildings(Array.isArray(data) ? data : data.buildings || []);
      } catch (err) {
        console.error("Failed to load buildings:", err);
        toast.error("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  // Fetch floors on building change
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);
    setSelectedBuilding(building || null);
    setSelectedFloor(null);
    setFloors([]);
    setPhysicalSensors([]);
    setVirtualSensors([]);

    if (!building) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/floors/building/${building.building_id}`
      );
      const data = await res.json();
      const sortedFloors = (Array.isArray(data) ? data : data.floors || []).sort(
        (a, b) => a.floor_number - b.floor_number
      );
      setFloors(sortedFloors);
    } catch (err) {
      console.error("Failed to load floors:", err);
      toast.error("Failed to load floors");
    }
  };

  // Fetch physical sensors when floor changes
  const handleFloorChange = async (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor);
    setPhysicalSensors([]);
    setVirtualSensors([]);

    if (!floor) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/sensors/floor/${floor.floor_id}`
      );
      const data = await res.json();
      const sensors = Array.isArray(data) ? data : data.sensors || [];
      setPhysicalSensors(sensors);

      // prepare virtual sensor objects for each physical sensor
      setVirtualSensors(
        sensors.map((s) => ({
          sensor_id: s.sensor_id,
          floor_id: floor.floor_id,
          virtual_sensor_number: "",
          animation_status: "Normal", // always default
        }))
      );
    } catch (err) {
      console.error("Failed to load sensors:", err);
      toast.error("Failed to load sensors");
    }
  };

  // Handle change for a single virtual sensor number
  const handleVirtualSensorChange = (index, value) => {
    setVirtualSensors((prev) =>
      prev.map((vs, i) =>
        i === index ? { ...vs, virtual_sensor_number: value } : vs
      )
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (virtualSensors.some((vs) => !vs.virtual_sensor_number)) {
      return toast.error("Please enter Virtual Sensor Number for all sensors");
    }

    setSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(virtualSensors); // send all virtual sensors at once
      }
      toast.success("Virtual Sensors registered successfully!");

      // Reset form
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setFloors([]);
      setPhysicalSensors([]);
      setVirtualSensors([]);
    } catch (err) {
      toast.error(err.message || "Failed to register virtual sensors");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Virtual Sensor Registration
      </h2>

      {/* Building */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Building
        </label>
        <select
          value={selectedBuilding?.building_id || ""}
          onChange={handleBuildingChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
        >
          <option value="">-- Select a building --</option>
          {buildings.map((b) => (
            <option key={b.building_id} value={b.building_id}>
              {b.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Floor */}
      {selectedBuilding && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Floor
          </label>
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

      {/* Virtual Sensors List */}
      {selectedFloor && physicalSensors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Virtual Sensors</h3>
          <div className="space-y-4">
            {physicalSensors.map((sensor, index) => (
              <div
                key={sensor.sensor_id}
                className="p-4 border rounded bg-gray-50 flex flex-col gap-2"
              >
                <p className="text-sm text-gray-600">
                  Physical Sensor:{" "}
                  <span className="font-medium">
                    {sensor.sensor_number} ({sensor.type})
                  </span>
                </p>
                <input
                  type="text"
                  placeholder="Enter Virtual Sensor Number"
                  value={virtualSensors[index]?.virtual_sensor_number || ""}
                  onChange={(e) =>
                    handleVirtualSensorChange(index, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || virtualSensors.length === 0}
        className={`w-full ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F4003B] hover:bg-[#d10032]"
        } text-white py-2 rounded`}
      >
        {submitting ? "Registering..." : "Register Virtual Sensors"}
      </button>
    </form>
  );
}
