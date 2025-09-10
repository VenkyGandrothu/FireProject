import { useState } from "react";
import { toast } from "react-toastify";

const BuildingRegistrationForm = ({ onSubmit }) => {
  const initialState = {
    building_name: "",
    num_floors: "",
    building_address: "",
    building_city: "",
    building_state: "",
    building_country: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear only the changed field error

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "num_floors"
          ? value.replace(/\D/g, "") // allow only digits
          : value,
    }));
  };

  const validate = (data) => {
    let newErrors = {};

    if (!data.building_name.trim())
      newErrors.building_name = "Building name is required";

    if (!data.num_floors.trim()) {
      newErrors.num_floors = "Number of floors is required";
    } else if (!/^\d+$/.test(data.num_floors.trim())) {
      newErrors.num_floors = "Number of floors must be a valid integer";
    } else if (Number(data.num_floors) < 0) {
      newErrors.num_floors = "Number of floors cannot be negative";
    }

    if (!data.building_address.trim())
      newErrors.building_address = "Address is required";

    if (!data.building_city.trim())
      newErrors.building_city = "City is required";

    if (!data.building_state.trim())
      newErrors.building_state = "State is required";

    if (!data.building_country.trim())
      newErrors.building_country = "Country is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleaned = {
      building_name: formData.building_name.trim(),
      num_floors: formData.num_floors.trim(), // keep string for validation
      building_address: formData.building_address.trim(),
      building_city: formData.building_city.trim(),
      building_state: formData.building_state.trim(),
      building_country: formData.building_country.trim(),
    };

    const validationErrors = validate(cleaned);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ convert number only after validation passes
    const finalData = {
      ...cleaned,
      num_floors: Number(cleaned.num_floors),
    };

    setSubmitting(true);
    try {
      await onSubmit(finalData); // API call from parent
      toast.success("Building registered successfully");
      setFormData(initialState);
      setErrors({});
    } catch (err) {
      const msg = err?.message || "Failed to register building";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Building Registration
      </h2>

      {[
        { label: "Building Name", name: "building_name", type: "text" },
        { label: "Number of Floors", name: "num_floors", type: "text" },
        { label: "Address", name: "building_address", type: "text" },
        { label: "City", name: "building_city", type: "text" },
        { label: "State", name: "building_state", type: "text" },
        { label: "Country", name: "building_country", type: "text" },
      ].map((field) => (
        <div key={field.name} className="mb-4">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors[field.name] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[field.name] && (
            <p className="text-red-600 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F4003B] hover:bg-[#d10032]"
        } text-white py-2 rounded`}
      >
        {submitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default BuildingRegistrationForm;
