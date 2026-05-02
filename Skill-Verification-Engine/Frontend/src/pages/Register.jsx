import { useState } from "react";
import { registerUser } from "../services/authService";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ added

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerUser({ name, email, password });

      saveAuth(res.data.token, res.data.user); // save to localStorage
      login(res.data.user);                    // ✅ update auth context

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Register
        </button>

        <div className="text-center text-gray-400 my-3">or</div>

        <GoogleButton />
      </form>
    </div>
  );
}
