import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LinkQrToPathsForm() {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [exitPaths, setExitPaths] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedQrCodeId, setSelectedQrCodeId] = useState("");
  const [selectedPathIds, setSelectedPathIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const bRes = await fetch("http://localhost:5000/api/buildings");
        const bData = await bRes.json();
        setBuildings(bData.buildings || bData || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load buildings");
      }
    };
    loadInitial();
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
      setFloors(data.floors || data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load floors");
    }
  };

  const handleFloorChange = async (e) => {
    const floorId = e.target.value;
    const floor = floors.find((f) => f.floor_id == floorId);
    setSelectedFloor(floor || null);

    setSelectedPathIds([]);

    if (!floor) {
      setExitPaths([]);
      setQrCodes([]);
      return;
    }
    try {
      const [qrRes, epRes] = await Promise.all([
        fetch(`http://localhost:5000/api/qr-codes/floor/${floor.floor_id}`),
        fetch(`http://localhost:5000/api/exit-paths/floor/${floor.floor_id}`),
      ]);
      const [qrData, epData] = await Promise.all([qrRes.json(), epRes.json()]);
      setQrCodes(qrData.qrCodes || qrData || []);
      setExitPaths((epData.exitPaths || epData || []).map((p) => ({ ...p })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load floor data");
    }
  };

  const handleTogglePath = (pathId) => {
    setSelectedPathIds((prev) =>
      prev.includes(pathId) ? prev.filter((id) => id !== pathId) : [...prev, pathId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQrCodeId) return toast.error("Select a QR code");
    if (selectedPathIds.length === 0) return toast.error("Select at least one exit path");

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/linked-qr-path/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code_id: Number(selectedQrCodeId), path_ids: selectedPathIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to link");
      toast.success("Linked successfully");

      // Reset path selection but keep QR selection in case user wants to link more
      setSelectedPathIds([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to link");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleExitPaths = exitPaths;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Link QR Code to Exit Paths</h2>
      {/* Select Building and Floor first */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Building (optional filter)</label>
          <select
            value={selectedBuilding?.building_id || ""}
            onChange={handleBuildingChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- All Buildings --</option>
            {buildings.map((b) => (
              <option key={b.building_id} value={b.building_id}>
                {b.building_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor (optional filter)</label>
          <select
            value={selectedFloor?.floor_id || ""}
            onChange={handleFloorChange}
            className="w-full p-2 border rounded"
            disabled={!selectedBuilding}
          >
            <option value="">-- All Floors --</option>
            {floors.map((f) => (
              <option key={f.floor_id} value={f.floor_id}>
                Floor {f.floor_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QR code selector (enabled after floor selection) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">QR Code</label>
        <select
          value={selectedQrCodeId}
          onChange={(e) => setSelectedQrCodeId(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!selectedFloor}
        >
          <option value="">{selectedFloor ? "-- Select QR Code --" : "Select building and floor first"}</option>
          {qrCodes.map((qr) => (
            <option key={qr.qr_code_id} value={qr.qr_code_id}>
              #{qr.qr_code_id} • {qr.qr_code_number}
            </option>
          ))}
        </select>
      </div>

      {/* Paths checklist */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Exit Paths</label>
        <div className="max-h-56 overflow-auto border rounded p-2 space-y-2">
          {visibleExitPaths.length === 0 ? (
            <p className="text-sm text-gray-500">No exit paths found</p>
          ) : (
            visibleExitPaths.map((p) => (
              <label key={p.path_id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedPathIds.includes(p.path_id)}
                  onChange={() => handleTogglePath(p.path_id)}
                />
                <span>
                  #{p.path_id} • {p.start_point} → {p.end_point} ({p.path_status}) • {p.path_length}m
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-2 text-white rounded ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#F4003B] hover:bg-[#d10032]"
        }`}
      >
        {submitting ? "Linking..." : "Link Selected Paths"}
      </button>
    </form>
  );
}


