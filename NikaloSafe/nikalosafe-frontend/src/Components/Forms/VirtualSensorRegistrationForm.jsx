import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS, apiCall } from "../../config/api";

export default function VirtualSensorRegistrationForm({ onSubmit }) {
  // State to store list of buildings, floors, physical sensors, and virtual sensors
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [physicalSensors, setPhysicalSensors] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  // List of virtual sensors (one per physical sensor)
  const [virtualSensors, setVirtualSensors] = useState([]);
  // Flag to disable button while submitting
  const [submitting, setSubmitting] = useState(false);

  // Fetch buildings when the component mounts
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.BUILDINGS);
        // Ensure response is an array
        setBuildings(Array.isArray(data) ? data : data.buildings || []);
      } catch (err) {
        console.error("Failed to load buildings:", err);
        toast.error("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  // Handle when a building is selected
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    // Find the selected building from the list
    const building = buildings.find((b) => b.building_id == buildingId);
    setSelectedBuilding(building || null);
    setSelectedFloor(null); // Reset floor
    setFloors([]); // Clear floors
    setPhysicalSensors([]); // Clear sensors
    setVirtualSensors([]); // Clear virtual sensors

    if (!building) return; // If no building is selected, stop here

    try {
      // Fetch floors for the selected building
        const data = await apiCall(API_ENDPOINTS.FLOORS_BY_BUILDING(building.building_id));
      // Sort floors by floor number
      const sortedFloors = (Array.isArray(data) ? data : data.floors || []).sort(
        (a, b) => a.floor_number - b.floor_number
      );
      setFloors(sortedFloors);
    } catch (err) {
      console.error("Failed to load floors:", err);
      toast.error("Failed to load floors");
    }
  };

  // Handle when a floor is selected
  const handleFloorChange = async (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor);
    setPhysicalSensors([]); // Reset sensors
    setVirtualSensors([]); // Reset virtual sensors

    if (!floor) return; // If no floor is selected, stop

    try {
      // Fetch physical sensors for this floor
        const data = await apiCall(API_ENDPOINTS.PHYSICAL_SENSORS_BY_FLOOR(floor.floor_id));
      const sensors = Array.isArray(data) ? data : data.sensors || [];
      setPhysicalSensors(sensors);

      // Initialize virtual sensor objects for each physical sensor
      setVirtualSensors(
        sensors.map((s) => ({
          sensor_id: s.sensor_id,
          floor_id: floor.floor_id,
          virtual_sensor_number: "", // user will fill this
          animation_status: "Normal", // default value
        }))
      );
    } catch (err) {
      console.error("Failed to load sensors:", err);
      toast.error("Failed to load sensors");
    }
  };

  // Update virtual sensor number for a given index
  const handleVirtualSensorChange = (index, value) => {
    setVirtualSensors((prev) =>
      prev.map((vs, i) =>
        i === index ? { ...vs, virtual_sensor_number: value } : vs
      )
    );
  };

  // Submit all virtual sensors
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all virtual sensors have a number
    if (virtualSensors.some((vs) => !vs.virtual_sensor_number)) {
      return toast.error("Please enter Virtual Sensor Number for all sensors");
    }

    setSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(virtualSensors); // Send all virtual sensors at once to parent/handler
      }
      toast.success("Virtual Sensors registered successfully!");

      // Reset form after success
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
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Virtual Sensor Registration
      </h2>

      {/* Building dropdown */}
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

      {/* Floor dropdown (visible only after selecting building) */}
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

      {/* Virtual Sensors list (shown only if floor and sensors exist) */}
      {selectedFloor && physicalSensors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Virtual Sensors</h3>
          <div className="space-y-4">
            {physicalSensors.map((sensor, index) => (
              <div
                key={sensor.sensor_id}
                className="p-4 border rounded bg-gray-50 flex flex-col gap-2"
              >
                {/* Show physical sensor info */}
                <p className="text-sm text-gray-600">
                  Physical Sensor:{" "}
                  <span className="font-medium">
                    {sensor.sensor_number} ({sensor.type})
                  </span>
                </p>

                {/* Input for virtual sensor number */}
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

      {/* Submit button */}
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
