import React, { useState, useMemo } from "react";
import API from "../config/api";
import { storeAuth } from "../config/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Lock, Mail, Loader2 } from "lucide-react";

export default function Login({ onAuth }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isFormValid = useMemo(() => {
    return login.trim() !== "" && password.trim() !== "";
  }, [login, password]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setMsg(null);
    setLoading(true);

    try {
      const res = await API.post("/user/login", { login, password });
      const { token, user } = res.data;

      // store token (remember or session)
      storeAuth(user, token, remember);

      if (onAuth) onAuth(user);

      const roleRoutes = {
        admin: "/admin-dashboard",
        team_lead: "/dashboard",
        team_member: "/member",
      };

      navigate(roleRoutes[user.role] || "/", { replace: true });

    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#053527]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#020617] border border-[#053527]/30 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10"
      >

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-[#053527] to-[#020617] text-white p-12 relative">

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-6 tracking-tight">
              Task <span className="text-emerald-400">Flow</span>
            </h1>

            <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
              Manage your tasks efficiently with our next-gen productivity ecosystem.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-emerald-400/80">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px]">
                  ✓
                </div>
                Cloud-based Task Tracking
              </div>

              <div className="flex items-center gap-3 text-sm text-emerald-400/80">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px]">
                  ✓
                </div>
                Real-time Team Collaboration
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 bg-[#020617] relative">

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              Login Account
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-sm text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {msg}
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Email Address"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3.5 bg-[#053527]/5 border border-[#053527]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#053527]/50 focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-3.5 bg-[#053527]/5 border border-[#053527]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#053527]/50 focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded border-[#053527]/50 bg-transparent accent-emerald-600"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-[#053527] hover:bg-[#053527]/80 text-white py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-[#053527]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={18} />
                  LOG IN
                </>
              )}
            </button>

            {/* Register */}
            <div className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?
              <Link
                to="/register"
                className="text-emerald-500 ml-1.5 font-bold hover:underline"
              >
                Create Account
              </Link>
            </div>

          </form>

        </div>

      </motion.div>
    </div>
  );
}
