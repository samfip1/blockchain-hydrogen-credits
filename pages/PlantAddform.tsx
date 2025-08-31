import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

interface PlantAddFormProps {
  onPlantAdded: () => void;
}

const PlantAddForm: React.FC<PlantAddFormProps> = ({onPlantAdded}) => {
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Signin/add_plants`,
        { name, stateName, city },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ pass auth token
          },
        }
      );
      if(response.status !== 201){
        console.log("Something went wrong on adding plant.");
        return;
      }
      console.log("✅ Plant added successfully:", response.data);
      onPlantAdded();

      // Reset form after success
      setName("");
      setStateName("");
      setCity("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to add plant");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Plant</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Plant Name" value={name} onChange={setName} />
        <InputField label="State" value={stateName} onChange={setStateName} />
        <InputField label="City" value={city} onChange={setCity} />

        <button
          type="submit"
          disabled={isAdding}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${
            isAdding
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600"
          } transition-colors`}
        >
          {isAdding ? "Adding..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
};

// Small reusable input component
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      required
    />
  </div>
);

export default PlantAddForm;
