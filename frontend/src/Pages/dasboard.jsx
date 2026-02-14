import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, BarChart3, ArrowUpRight } from "lucide-react";
import { getStoredUser } from "../config/auth";

const Dashboard = () => {
  const user = getStoredUser();

  // Mock data for the stats
  const stats = [
    { label: "Total Tasks", value: "24", icon: BarChart3, color: "text-blue-400" },
    { label: "In Progress", value: "07", icon: Clock, color: "text-emerald-400" },
    { label: "Completed", value: "12", icon: CheckCircle2, color: "text-[#053527] brightness-150" },
  ];

  return (
    <div className="space-y-8">
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-[#053527] brightness-150">{user?.name}!</span>
          </h1>
          <p className="text-gray-400 mt-1"></p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#053527] hover:bg-[#053527]/80 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-[#053527]/20">
          + New Task
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#020617] border border-[#053527]/30 p-6 rounded-2xl relative overflow-hidden group hover:border-[#053527] transition-colors"
          >
            {/* Subtle Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#053527]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-[#053527]/20 ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <ArrowUpRight size={18} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm font-medium">{item.label}</p>
              <h3 className="text-white text-3xl font-bold mt-1">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECENT ACTIVITY / TASKS PLACEHOLDER */}
      <div className="bg-[#020617] border border-[#053527]/20 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-4">Recent Tasks</h2>
        <div className="text-gray-500 text-center py-10 border-2 border-dashed border-[#053527]/10 rounded-xl">
       No Recent tasks
        </div>
      </div>
    </div>
  );
};

export default Dashboard;