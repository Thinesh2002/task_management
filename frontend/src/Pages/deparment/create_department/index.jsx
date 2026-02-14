import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ArrowLeft, Loader2, Building2, Hash } from "lucide-react";
import API from "../../../config/api";

export default function CreateDepartment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department_name: "",
    department_code: "TK"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // Handle Input Change
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department_code") {
      let formatted = value.toUpperCase();

      // Always enforce TK prefix
      if (!formatted.startsWith("TK")) {
        formatted = "TK" + formatted.replace(/^TK/, "");
      }

      setFormData({
        ...formData,
        department_code: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // ================================
  // Handle Submit
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.department_name.trim()) {
      return setError("Department name is required");
    }

    if (!formData.department_code.trim()) {
      return setError("Department code is required");
    }

    if (!formData.department_code.startsWith("TK")) {
      return setError("Department code must start with TK");
    }

    try {
      setLoading(true);

      await API.post("/department/create", formData);

      navigate("/view-department");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while creating department"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-8 text-sm font-medium"
      >
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
          <ArrowLeft size={16} />
        </div>
        Back to Organization
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#020617] border border-[#053527] rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-8 sm:p-10 border-b border-[#053527]/30 bg-gradient-to-br from-[#053527]/20 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 bg-[#053527] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Building2 className="text-emerald-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Add Department
              </h2>
              <p className="text-emerald-500/60 text-sm mt-1 font-medium tracking-wide">
                Define a new organizational unit within Task Flow.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-8 sm:mx-10 mt-6"
            >
              <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8">

            {/* Department Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">
                Department Name
              </label>
              <div className="relative group">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleChange}
                  placeholder="e.g. Digital Marketing"
                  className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Department Code */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">
                Department Code
              </label>
              <div className="relative group">
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleChange}
                  placeholder="e.g. TK01"
                  className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                Department code must start with TK
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-4 flex justify-end pt-8 border-t border-[#053527]/20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full sm:w-64 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm tracking-[0.15em] flex justify-center items-center gap-3 shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} />
                  CREATE DEPARTMENT
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
