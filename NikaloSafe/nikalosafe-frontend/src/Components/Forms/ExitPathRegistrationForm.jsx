// src/Components/Forms/ExitPathRegistrationForm.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ExitPathRegistrationForm({ onSubmit }) {
  const createEmptyPath = () => ({ start_point: "", end_point: "", path_status: "", path_length: "" });

  const [exitPaths, setExitPaths] = useState([createEmptyPath()]);
  const [submitting, setSubmitting] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const data = await res.json();
        setBuildings(data.buildings || data || []);
      } catch (err) {
        console.error("Failed to load buildings:", err);
        toast.error("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    const building = buildings.find((b) => b.building_id == buildingId);

    setSelectedBuilding(building || null);
    setSelectedFloor(null);
    setFloors([]);

    if (!building) return;

    try {
      const res = await fetch(`http://localhost:5000/api/floors/building/${building.building_id}`);
      const data = await res.json();
      const sortedFloors = (data.floors || data || []).sort((a, b) => a.floor_number - b.floor_number);
      setFloors(sortedFloors);
    } catch (err) {
      console.error("Failed to load floors:", err);
      toast.error("Failed to load floors");
    }
  };

  const handleFloorChange = (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor || null);
  };

  const handleExitPathChange = (index, e) => {
    const { name, value } = e.target;
    setExitPaths((prev) =>
      prev.map((path, i) => (i === index ? { ...path, [name]: value } : path))
    );
  };

  const addExitPath = () => setExitPaths((prev) => [...prev, createEmptyPath()]);
  const removeExitPath = (index) => setExitPaths((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBuilding) return toast.error("Select a building first");
    if (!selectedFloor) return toast.error("Select a floor first");

    // Validate each exit path
    for (let i = 0; i < exitPaths.length; i++) {
      const path = exitPaths[i];
      if (!path.start_point.trim()) return toast.error(`Start point required for path ${i + 1}`);
      if (!path.end_point.trim()) return toast.error(`End point required for path ${i + 1}`);
      if (!path.path_status) return toast.error(`Path status required for path ${i + 1}`);
      const length = parseFloat(path.path_length);
      if (isNaN(length) || length <= 0)
        return toast.error(`Path length must be a valid positive number for path ${i + 1}`);
    }

    const payload = exitPaths.map((path) => ({
      floor_id: selectedFloor.floor_id,
      start_point: path.start_point.trim(),
      end_point: path.end_point.trim(),
      path_status: path.path_status,
      path_length: parseFloat(path.path_length),
    }));

    setSubmitting(true);
    try {
      // Send payload to backend and await response
      const savedData = await onSubmit(payload);

      // Log the saved data
      console.log("Saved exit paths:", savedData);

      toast.success("Exit paths registered successfully!");
      setExitPaths([createEmptyPath()]);
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setFloors([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to register exit paths");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Exit Path Registration</h2>

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
              {b.building_name} {b.num_floors ? `(${b.num_floors} floors)` : ""}
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

      {/* Dynamic Exit Path fields */}
      {exitPaths.map((path, index) => (
        <div key={index} className="mb-4 p-4 border rounded relative">
          {exitPaths.length > 1 && (
            <button
              type="button"
              onClick={() => removeExitPath(index)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
          )}

          <input
            type="text"
            name="start_point"
            value={path.start_point}
            onChange={(e) => handleExitPathChange(index, e)}
            placeholder="Start Point"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="end_point"
            value={path.end_point}
            onChange={(e) => handleExitPathChange(index, e)}
            placeholder="End Point"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <select
            name="path_status"
            value={path.path_status}
            onChange={(e) => handleExitPathChange(index, e)}
            className="w-full mb-2 p-2 border rounded"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <input
            type="number"
            step="0.01"
            name="path_length"
            value={path.path_length}
            onChange={(e) => handleExitPathChange(index, e)}
            placeholder="Path Length (meters)"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addExitPath}
        className="w-full mb-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        + Add Another Exit Path
      </button>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-2 text-white rounded ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#F4003B] hover:bg-[#d10032]"
        }`}
      >
        {submitting ? "Registering..." : "Register Exit Paths"}
      </button>
    </form>
  );
}