import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS, apiCall } from "../../config/api";

const CustomerBuildingForm = ({ onSubmit }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    customer_id: "",
    building_id: "",
    days_of_subscription: "",
    start_date: "",
    end_date: "",
    subscription_status: "",
  });

  // Dropdown data
  const [customers, setCustomers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch customers and buildings from backend on mount
   * - Customers populate customer dropdown
   * - Buildings populate building dropdown
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerData = await apiCall(API_ENDPOINTS.CUSTOMERS);
        setCustomers(customerData.customers || customerData);

        const buildingData = await apiCall(API_ENDPOINTS.BUILDINGS);
        setBuildings(buildingData.buildings || buildingData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load customers or buildings.");
      }
    };
    fetchData();
  }, []);

  /**
   * Handle input change
   * - Updates the corresponding form field
   * - Recalculates `days_of_subscription` when start or end date changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-calculate days when dates change
    if (name === "start_date" || name === "end_date") {
      const start = name === "start_date" ? value : formData.start_date;
      const end = name === "end_date" ? value : formData.end_date;

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!isNaN(startDate) && !isNaN(endDate) && endDate >= startDate) {
          // +1 to include both start and end date
          const diffDays =
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
          setFormData((prev) => ({
            ...prev,
            days_of_subscription: diffDays,
          }));
        } else {
          // Reset days if invalid
          setFormData((prev) => ({ ...prev, days_of_subscription: "" }));
        }
      }
    }
  };

  /**
   * Handle form submission
   * - Validates required fields
   * - Checks if same customer-building relation already exists
   * - Ensures valid days and date range
   * - Sends POST request to backend
   * - Displays success or error toast
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { customer_id, building_id, days_of_subscription, start_date, end_date } = formData;

    // Required field validation
    if (!customer_id || !building_id) {
      toast.error("Please select both customer and building");
      return;
    }

    // 🔍 Duplicate relation check before submit
    try {
      const data = await apiCall(API_ENDPOINTS.CUSTOMER_BUILDINGS);
      const existingData = data.customerBuildings || []; // safe extraction

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

    // Validate days
    const days = Number(days_of_subscription);
    if (isNaN(days) || days <= 0) {
      toast.error("Days of subscription must be a positive number");
      return;
    }

    // Validate dates
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

    // Final submission
    setSubmitting(true);
    try {
      const json = await apiCall(API_ENDPOINTS.CUSTOMER_BUILDING_REGISTER, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Customer linked to building successfully");
      // Reset form after successful save
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

      {/* Days of Subscription (auto-calculated, read-only) */}
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

      {/* Subscription Status toggle buttons */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-2">Subscription Status</label>
        <div className="flex gap-4">
          {/* Active button */}
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
          {/* Inactive button */}
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

      {/* Submit Button */}
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
