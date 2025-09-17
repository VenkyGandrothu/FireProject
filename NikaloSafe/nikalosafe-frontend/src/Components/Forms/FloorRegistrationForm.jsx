import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FloorRegistrationForm = ({ onSubmit }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [floors, setFloors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch buildings for dropdown
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const json = await res.json();
        if (res.ok) {
          setBuildings(json.buildings);
        }
      } catch (err) {
        console.error("Failed to load buildings:", err);
      }
    };
    fetchBuildings();
  }, []);

  // Handle building selection → auto-generate floor rows
  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);
    setSelectedBuilding(building || null);

    if (building && building.num_floors > 0) {
      const generatedFloors = Array.from({ length: building.num_floors }, (_, i) => ({
        floor_number: i + 1,
        description: "",
        num_sensors: 0,
      }));
      setFloors(generatedFloors);
    } else {
      setFloors([]);
    }
  };

  // Handle floor field change
  const handleFloorChange = (index, field, value) => {
    setFloors((prev) =>
      prev.map((floor, i) =>
        i === index ? { ...floor, [field]: value } : floor
      )
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBuilding) {
      toast.error("Please select a building");
      return;
    }

    const cleanedFloors = floors.map((f) => ({
      building_id: selectedBuilding.building_id,
      floor_number: f.floor_number,
      description: f.description.trim(),
      num_sensors: Number(f.num_sensors),
    }));

    setSubmitting(true);
    try {
      await onSubmit(cleanedFloors); // pass array of floors to parent
      toast.success("Floors added successfully");
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
      <h2 className="text-2xl font-bold mb-4 text-center">Floor and sensor info</h2>

      {/* Building Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Building</label>
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

      {/* Dynamic Floors */}
      {floors.length > 0 && (
        <div className="space-y-4">
          {floors.map((floor, index) => (
            <div
              key={floor.floor_number}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold mb-2">
                Floor {floor.floor_number}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
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

                {/* Num Sensors */}
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
