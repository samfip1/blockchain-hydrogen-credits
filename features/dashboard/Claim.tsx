import React, { useState } from "react";
import axios from "axios";

interface ClaimProps {
  onClaimSubmitted?: () => void;
}

const Claim: React.FC<ClaimProps> = ({ onClaimSubmitted }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/Signin/apply/claim", {
        email,
        password,
      });

      if (res.status === 200) {
        setMessage("✅ Claim submitted successfully!");
        onClaimSubmitted?.();
      } else {
        setMessage("⚠️ Something went wrong. Try again.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Submit Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default Claim;
