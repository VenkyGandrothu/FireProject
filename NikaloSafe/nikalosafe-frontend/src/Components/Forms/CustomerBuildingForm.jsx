import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CustomerBuildingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    building_id: "",
    days_of_subscription: "",
    start_date: "",
    end_date: "",
    subscription_status: "",
  });

  const [customers, setCustomers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch customers and buildings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await fetch("http://localhost:5000/api/customers");
        const customerData = await customerRes.json();
        setCustomers(customerData.customers || customerData);

        const buildingRes = await fetch("http://localhost:5000/api/buildings");
        const buildingData = await buildingRes.json();
        setBuildings(buildingData.buildings || buildingData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load customers or buildings.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-calculate days_of_subscription
    if (name === "start_date" || name === "end_date") {
      const start = name === "start_date" ? value : formData.start_date;
      const end = name === "end_date" ? value : formData.end_date;

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!isNaN(startDate) && !isNaN(endDate) && endDate >= startDate) {
          const diffDays =
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
          setFormData((prev) => ({
            ...prev,
            days_of_subscription: diffDays,
          }));
        } else {
          setFormData((prev) => ({ ...prev, days_of_subscription: "" }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { customer_id, building_id, days_of_subscription, start_date, end_date } = formData;

    if (!customer_id || !building_id) {
      toast.error("Please select both customer and building");
      return;
    }

    // ✅ Duplicate check before submit
    try {
      const resCheck = await fetch("http://localhost:5000/api/customer-building");
      const data = await resCheck.json();
      const existingData = data.relations || []; // extract array safely

      const alreadyExists = existingData.some(
        (record) =>
          record.customer_id === Number(customer_id) &&
          record.building_id === Number(building_id)
      );

      if (alreadyExists) {
        toast.error("This customer is already linked with this building!");
        return;
      }
    } catch (err) {
      console.error("Validation fetch error:", err);
    }

    const days = Number(days_of_subscription);
    if (isNaN(days) || days <= 0) {
      toast.error("Days of subscription must be a positive number");
      return;
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (!start_date || !end_date || isNaN(startDate) || isNaN(endDate)) {
      toast.error("Please enter valid start and end dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/customer-building/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create relation");

      toast.success("Customer linked to building successfully ✅");
      setFormData({
        customer_id: "",
        building_id: "",
        days_of_subscription: "",
        start_date: "",
        end_date: "",
        subscription_status: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error creating relation: " + err.message);
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
        Link Customer to Building
      </h2>

      {/* Customer Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Customer</label>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
          required
        >
          <option value="">-- Select a customer --</option>
          {customers.map((c) => (
            <option key={c.customer_id} value={c.customer_id}>
              {c.customer_name}
            </option>
          ))}
        </select>
      </div>

      {/* Building Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Building</label>
        <select
          name="building_id"
          value={formData.building_id}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
          required
        >
          <option value="">-- Select a building --</option>
          {buildings.map((b) => (
            <option key={b.building_id} value={b.building_id}>
              {b.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
          required
        />
      </div>

      {/* End Date */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded border-gray-300"
          required
        />
      </div>

      {/* Days of Subscription */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700">Days of Subscription</label>
        <input
          type="number"
          name="days_of_subscription"
          value={formData.days_of_subscription}
          readOnly
          className="w-full mt-1 p-2 border rounded border-gray-300 bg-gray-100"
        />
      </div>

      {/* Subscription Status */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-2">Subscription Status</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, subscription_status: "active" }))
            }
            className={`px-4 py-2 rounded ${
              formData.subscription_status === "active"
                ? "bg-[#F4003B] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, subscription_status: "inactive" }))
            }
            className={`px-4 py-2 rounded ${
              formData.subscription_status === "inactive"
                ? "bg-[#F4003B] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full mt-4 ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F4003B] hover:bg-[#d10032]"
        } text-white py-2 rounded`}
      >
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default CustomerBuildingForm;
