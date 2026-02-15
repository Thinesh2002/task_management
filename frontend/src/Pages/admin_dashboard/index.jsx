import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  LayoutDashboard,
  BarChart3,
  PieChart as PieIcon,
  Filter
} from "lucide-react";
import API from "../../config/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/task/view?role=admin");
      setTasks(res.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const overdue = tasks.filter(t => t.status === "Overdue").length;

  const pieData = [
    ["Status", "Count"],
    ["Completed", completed],
    ["Pending", pending],
    ["In Progress", inProgress],
    ["Overdue", overdue],
  ];

  const barData = [
    ["Status", "Tasks", { role: "style" }],
    ["Completed", completed, "#10b981"],
    ["Pending", pending, "#64748b"],
    ["In Progress", inProgress, "#3b82f6"],
    ["Overdue", overdue, "#ef4444"],
  ];

  const chartOptions = {
    backgroundColor: "transparent",
    colors: ["#10b981", "#64748b", "#3b82f6", "#ef4444"],
    legend: { textStyle: { color: "#9ca3af", fontSize: 12 } },
    pieHole: 0.5,
    chartArea: { width: "90%", height: "80%" },
    animation: { startup: true, duration: 1000, easing: "out" },
    vAxis: { textStyle: { color: "#64748b" }, gridlines: { color: "transparent" } },
    hAxis: { textStyle: { color: "#64748b" } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Clock className="text-emerald-500" size={40} />
        </motion.div>
        <p className="text-gray-500 mt-4 animate-pulse">Analysing task data...</p>
      </div>
    );
  }

  return (
    <div className=" text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-emerald-500/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-emerald-500" />
            Admin <span className="text-emerald-500">Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise task management and team performance.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-[#053527]/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all">
             <Filter size={14} /> Global Filters
           </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card 
          icon={<ClipboardList size={22} />} 
          title="Total Tasks" 
          value={totalTasks} 
          color="blue" 
          delay={0.1}
        />
        <Card 
          icon={<CheckCircle size={22} />} 
          title="Completed" 
          value={completed} 
          color="emerald" 
          delay={0.2}
        />
        <Card 
          icon={<Clock size={22} />} 
          title="In Progress" 
          value={inProgress} 
          color="amber" 
          delay={0.3}
        />
        <Card 
          icon={<AlertTriangle size={22} />} 
          title="Overdue" 
          value={overdue} 
          color="red" 
          delay={0.4}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a]/40 border border-[#053527]/30 p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <PieIcon size={18} className="text-emerald-500" /> Task Distribution
            </h2>
          </div>
          <Chart
            chartType="PieChart"
            width="100%"
            height="320px"
            data={pieData}
            options={chartOptions}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0f172a]/40 border border-[#053527]/30 p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-500" /> Status Overview
            </h2>
          </div>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="320px"
            data={barData}
            options={{ ...chartOptions, legend: { position: "none" } }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function Card({ icon, title, value, color, delay }) {
  const colorStyles = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40",
    red: "text-red-500 bg-red-500/10 border-red-500/20 hover:border-red-500/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[1.5rem] border shadow-xl flex items-center justify-between transition-all group bg-[#0f172a]/20 backdrop-blur-sm ${colorStyles[color]}`}
    >
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-gray-300 transition-colors">
          {title}
        </h3>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${colorStyles[color].split(' ')[0]} bg-white/5`}>
        {icon}
      </div>
    </motion.div>
  );
}