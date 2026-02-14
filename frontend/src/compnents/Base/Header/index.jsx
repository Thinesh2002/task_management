import { useState, useRef, useEffect } from "react";
import { Menu, Settings, LogOut, User, ChevronDown, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser, logout } from "../../../config/auth";

export default function Header({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = getStoredUser();

  // Role formatting: team_lead -> Team Lead
  const formatRole = (role) => {
    if (!role) return "Member";
    return role
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative z-50 h-16 bg-[#020617]/95 backdrop-blur-md text-white flex items-center justify-between px-4 sm:px-8 border-b border-[#053527] shadow-lg">
      
      {/* LEFT SECTION: Logo & Mobile Menu */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
        >
          <Menu size={22} />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#053527] border border-emerald-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(5,53,39,0.5)]">
            <CheckSquare size={18} className="text-emerald-400" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent hidden sm:block">
            Task <span className="text-emerald-400">Flow</span>
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: User Profile & Actions */}
      <div className="flex items-center gap-4">

        {/* MOBILE LOGOUT */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="lg:hidden p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={20} />
        </motion.button>

        {/* DESKTOP USER DROPDOWN: Minimalist Design */}
        <div className="relative hidden lg:block" ref={dropdownRef}>
          <motion.button
            whileHover={{ backgroundColor: "" }}
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border transition-all duration-300 ${
              open ? "border-emerald-500/40 bg-[#053527]/20" : "border-white/5 bg-white/5"
            }`}
          >
            {/* Avatar with Status Dot */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#020617] border border-[#053527] flex items-center justify-center text-sm font-bold text-emerald-400 shadow-inner">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-[0_0_8px_#10b981]" />
            </div>

            {/* Minimal Info */}
            <div className="text-left hidden xl:block">
              <p className="text-sm font-bold text-white leading-none">
                {user?.name?.split(" ")[0] || "User"}
              </p>
              <p className="text-[10px] text-emerald-400/60 font-medium tracking-tighter uppercase mt-1">
                {formatRole(user?.role)}
              </p>
            </div>

            <motion.div animate={{ rotate: open ? 180 : 0 }}>
              <ChevronDown size={14} className="text-emerald-400/40" />
            </motion.div>
          </motion.button>

          {/* ANIMATED DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-60 bg-[#020617] border border-[#053527] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
              >
                {/* Dropdown Header */}
                <div className="px-5 py-4 bg-[#053527]/20 border-b border-[#053527]/30">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-emerald-400/70 truncate font-medium mt-0.5">{user?.email}</p>
                </div>

                {/* Dropdown Links */}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
                    <User size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    My Profile
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
                    <Settings size={16} className="text-emerald-500 group-hover:rotate-45 transition-transform" />
                    System Settings
                  </button>

                  <div className="my-1 border-t border-white/5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Logout Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}