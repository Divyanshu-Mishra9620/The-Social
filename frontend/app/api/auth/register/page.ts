"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URI}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/api/auth/signin");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google Sign-In error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-6">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-400 text-center bg-red-900/20 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all"
        >
          <FcGoogle className="text-xl" /> Sign up with Google
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-700" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Gmail
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Register As
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <div
            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
            onClick={() => router.push("/api/auth/signin")}
          >
            Login here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
