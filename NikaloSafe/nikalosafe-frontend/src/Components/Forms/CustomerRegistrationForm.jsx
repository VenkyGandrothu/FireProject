import { useState } from "react";
import { toast } from "react-toastify";

const CustomerRegistrationForm = ({ onSubmit }) => {
  // Initial state structure for form fields
  const initialState = {
    name: "",
    email: "",
    phonenumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
  };

  // State to store form values
  const [formData, setFormData] = useState(initialState);
  // State to store validation errors
  const [errors, setErrors] = useState({});
  // State to handle submission status (loading)
  const [submitting, setSubmitting] = useState(false);

  /**
   * Handles input change for all fields
   * - Updates formData state
   * - Clears error for the field being typed
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear only that field's error
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validates the form data
   * - Ensures required fields are filled
   * - Validates email format
   * - Checks phone number length
   * Returns an object of errors
   */
  const validate = (data) => {
    let newErrors = {};

    if (!data.name.trim()) newErrors.name = "Name is required";

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(data.email.trim())) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (!data.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (data.phonenumber.trim().length < 6) {
      newErrors.phonenumber = "Enter a valid phone number";
    }

    if (!data.address.trim()) newErrors.address = "Address is required";
    if (!data.city.trim()) newErrors.city = "City is required";
    if (!data.state.trim()) newErrors.state = "State is required";
    if (!data.country.trim()) newErrors.country = "Country is required";

    return newErrors;
  };

  /**
   * Handles form submission
   * - Prevents default form refresh
   * - Cleans and validates data
   * - If valid, calls parent onSubmit function (API call)
   * - Displays success or error messages using toast
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean/trim inputs
    const cleaned = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phonenumber: formData.phonenumber.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
    };

    // Validate inputs
    const validationErrors = validate(cleaned);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // show errors if any
      return;
    }

    // Start submission (loading state)
    setSubmitting(true);
    try {
      await onSubmit(cleaned); // parent function (e.g., API request)
      toast.success("Customer registered successfully ");
      setFormData(initialState); // reset form
      setErrors({});
    } catch (err) {
      // Show error toast if submission fails
      const msg = err?.message || "Failed to register customer";
      toast.error(msg);
    } finally {
      setSubmitting(false); // stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Customer Registration
      </h2>

      {/* Loop through each form field dynamically */}
      {[
        { label: "Name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Phone Number", name: "phonenumber", type: "text" },
        { label: "Address", name: "address", type: "text" },
        { label: "City", name: "city", type: "text" },
        { label: "State", name: "state", type: "text" },
        { label: "Country", name: "country", type: "text" },
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
          {/* Show validation error below input */}
          {errors[field.name] && (
            <p className="text-red-600 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {/* Submit button with loading state */}
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

export default CustomerRegistrationForm;
