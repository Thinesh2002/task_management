import React, { useState, useEffect } from "react";
import API from "../../../config/api";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  CalendarDays,
  UserCircle,
  CircleDot,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
export default function CreateEmployee() {
  const navigate = useNavigate();

  const [employeeCode, setEmployeeCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("team_member");
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employee");
        // Count handling based on common API responses
        const count = (res.data.data ? res.data.data.length : res.data.length) + 1;
        const code = `TK${String(count).padStart(3, "0")}`;
        setEmployeeCode(code);
      } catch {
        setEmployeeCode("TK001");
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      await API.post("/employee", {
        employee_code: employeeCode,
        name,
        email,
        phone,
        department,
        role,
        join_date: joinDate,
        status
      });

      navigate("/employees");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        
 

        <motion.div>
          {/* HEADER SECTION */}
          <div className="p-8 sm:p-10 border-b border-[#053527]/30 bg-gradient-to-br from-[#053527]/20 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-16 h-16 bg-[#053527] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <UserPlus className="text-emerald-400" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Onboard Employee</h2>
                <p className="text-emerald-500/60 text-sm mt-1 font-medium tracking-wide">
                  Fill in the professional profile details to add a new member to Task Flow.
                </p>
              </div>
            </div>
          </div>

          {/* NOTIFICATION BOX WITH ANIMATION */}
          <AnimatePresence>
            {msg && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mx-8 sm:mx-10 mt-6"
              >
                <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  {msg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* Employee Code */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Identity Code</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40" size={18} />
                  <input
                    type="text"
                    value={employeeCode}
                    readOnly
                    className="w-full bg-[#053527]/10 border border-[#053527]/20 rounded-2xl px-12 py-4 text-emerald-400 font-mono text-sm focus:outline-none cursor-default"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Thineshkaran"
                    required
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Department</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-emerald-400 transition-colors" size={18} />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#020617]">Select Department</option>
                    <option value="Founder" className="bg-[#020617]">Founder</option>
                    <option value="Management" className="bg-[#020617]">Management</option>
                    <option value="Daraz" className="bg-[#020617]">Daraz</option>
                    <option value="Digital Marketing" className="bg-[#020617]">Digital Marketing</option>
                    <option value="Ikman" className="bg-[#020617]">Ikman</option>
                    <option value="Graphic Design" className="bg-[#020617]">Graphic Design</option>
                    <option value="Accounting" className="bg-[#020617]">Accounting</option>
                    <option value="UI/UX" className="bg-[#020617]">UI/UX</option>
                    <option value="Web Development" className="bg-[#020617]">Web Development</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              {/* System Role */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">System Role</label>
                <div className="relative group">
                  <CircleDot className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="team_member" className="bg-[#020617]">Team Member</option>
                    <option value="team_lead" className="bg-[#020617]">Team Lead</option>
                    <option value="admin" className="bg-[#020617]">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Join Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-[#053527] rounded-2xl px-12 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Employee Status</label>
                <div className="flex gap-4">
                  {["Active", "Inactive"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-4 rounded-2xl text-xs font-bold tracking-widest border transition-all ${
                        status === s 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "bg-white/[0.02] border-[#053527] text-gray-500 hover:border-emerald-500/30"
                      }`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="mt-12 flex justify-end pt-8 border-t border-[#053527]/20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-64 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm tracking-[0.15em] flex justify-center items-center gap-3 shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <UserPlus size={18} />
                    CREATE PROFILE
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}