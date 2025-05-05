// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [accountType, setAccountType] = useState("customer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedName = localStorage.getItem("register_name");
    const cachedEmail = localStorage.getItem("register_email");
    if (cachedName || cachedEmail) {
      setForm((prev) => ({
        ...prev,
        name: cachedName || "",
        email: cachedEmail || "",
      }));
    }
  }, []);

  useEffect(() => {
    if (user && user.name) {
      const dest = user.venueManager ? "/venue-manager" : "/customer";
      navigate(dest, { replace: true });
      toast.success(`Welcome ${user.name}!`);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = form;

    if (!email.endsWith("@stud.noroff.no")) {
      toast.error("Email must end with @stud.noroff.no");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        venueManager: accountType === "manager",
      });

      localStorage.setItem("register_name", name);
      localStorage.setItem("register_email", email);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.confirmPassword.length >= 8;

  return user && user.name ? (
    <div className="text-center mt-10 font-[Poppins]">Redirecting...</div>
  ) : (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl font-[Poppins]">
      <h2 className="text-4xl font-semibold text-center mb-6">Create account</h2>

      <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          className={`w-1/2 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            accountType === "customer"
              ? "bg-green-200 font-semibold"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setAccountType("customer")}
        >
          Customer
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            accountType === "manager"
              ? "bg-green-200 font-semibold"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setAccountType("manager")}
        >
          Venue Manager
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">
        {accountType === "customer"
          ? "A customer account is used for booking venues."
          : "A venue manager account is used to create and manage your venues."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Your Noroff Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <PasswordInput
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full flex justify-center items-center gap-2 text-white py-2 rounded-xl transition button-color disabled:opacity-60 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
