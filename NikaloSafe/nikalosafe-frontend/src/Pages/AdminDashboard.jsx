// src/Pages/AdminDashboard.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch buildings from backend
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buildings");
        const json = await res.json();
        if (json.success) {
          setBuildings(json.buildings || []);
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error("Error fetching buildings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🏢 Nikalo Safe Admin Dashboard
        </h1>
        {buildings.length > 0 && (
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Add Building
          </button>
        )}
      </div>

      {/* Building List */}
      {loading ? (
        <p className="text-gray-600">Loading buildings...</p>
      ) : buildings.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🏗️</span>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Buildings Registered Yet
          </h2>
          <p className="text-gray-500 mb-6">
            It looks like you haven't added any buildings yet. Click the button below to get started!
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
             Add Your First Building
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((b) => (
            <div
              key={b.building_id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {b.building_name}
              </h2>
              <p className="text-gray-600">
                📍 {b.building_city}, {b.building_country}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                {/* Edit & Delete buttons appear only when buildings exist */}
                <button
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                  onClick={() => navigate(`/edit-building/${b.building_id}`)}
                >
                  Edit
                </button>
                <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
