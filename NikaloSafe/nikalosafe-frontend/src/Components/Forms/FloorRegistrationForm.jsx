import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FloorRegistrationForm = ({ onSubmit }) => {
  // State for buildings list fetched from API
  const [buildings, setBuildings] = useState([]);
  // State for selected building
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  // State for floors that will be generated dynamically based on building selection
  const [floors, setFloors] = useState([]);
  // State to track form submission status
  const [submitting, setSubmitting] = useState(false);

  // Fetch buildings from backend API when the component mounts
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const json = await res.json();
        if (res.ok) {
          setBuildings(json.buildings); // Store building data in state
        }
      } catch (err) {
        console.error("Failed to load buildings:", err);
      }
    };
    fetchBuildings();
  }, []);

  // When user selects a building → auto-generate floor objects
  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);
    setSelectedBuilding(building || null);

    // Generate floors if building has num_floors > 0
    if (building && building.num_floors > 0) {
      const generatedFloors = Array.from({ length: building.num_floors }, (_, i) => ({
        floor_number: i + 1, // Floors start from 1
        description: "",
        num_sensors: 0,
      }));
      setFloors(generatedFloors);
    } else {
      setFloors([]); // Reset floors if no building selected
    }
  };

  // Update specific floor field (description or num_sensors)
  const handleFloorChange = (index, field, value) => {
    setFloors((prev) =>
      prev.map((floor, i) =>
        i === index ? { ...floor, [field]: value } : floor
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate building selection
    if (!selectedBuilding) {
      toast.error("Please select a building");
      return;
    }

    // Prepare cleaned floors payload
    const cleanedFloors = floors.map((f) => ({
      building_id: selectedBuilding.building_id, // Attach building id
      floor_number: f.floor_number,
      description: f.description.trim(),
      num_sensors: Number(f.num_sensors),
    }));

    setSubmitting(true);
    try {
      // Pass floors array to parent component via onSubmit
      await onSubmit(cleanedFloors);
      toast.success("Floors added successfully");

      // Reset form state
      setSelectedBuilding(null);
      setFloors([]);
    } catch (err) {
      const msg = err?.message || "Failed to add floors";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Floor and sensor info
      </h2>

      {/* Building Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Building
        </label>
        <select
          onChange={handleBuildingChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
          value={selectedBuilding?.building_id || ""}
        >
          <option value="">-- Select a building --</option>
          {buildings.map((b) => (
            <option key={b.building_id} value={b.building_id}>
              {b.building_name} ({b.num_floors} floors)
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Floors Section (only visible if building is selected) */}
      {floors.length > 0 && (
        <div className="space-y-4">
          {floors.map((floor, index) => (
            <div
              key={floor.floor_number}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              {/* Floor title */}
              <h3 className="font-semibold mb-2">
                Floor {floor.floor_number}
              </h3>

              {/* Grid for Description and Sensors input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Floor Description */}
                <div>
                  <label className="block text-sm text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={floor.description}
                    onChange={(e) =>
                      handleFloorChange(index, "description", e.target.value)
                    }
                    className="w-full mt-1 p-2 border rounded border-gray-300"
                  />
                </div>

                {/* Number of Sensors */}
                <div>
                  <label className="block text-sm text-gray-700">
                    Number of Sensors
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={floor.num_sensors}
                    onChange={(e) =>
                      handleFloorChange(index, "num_sensors", e.target.value)
                    }
                    className="w-full mt-1 p-2 border rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !selectedBuilding}
        className={`w-full mt-6 ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F4003B] hover:bg-[#d10032]"
        } text-white py-2 rounded`}
      >
        {submitting ? "Adding..." : "Add Floors"}
      </button>
    </form>
  );
};

export default FloorRegistrationForm;
