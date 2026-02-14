import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import API from "../../../config/api";
import { getStoredUser } from "../../../config/auth";
import {
  Loader2, Play, AlertCircle, X, ChevronRight,
  Calendar, CheckCircle2, Link2, LayoutDashboard,
  Filter, CheckSquare, Clock, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamMemberTasks() {
  const user = getStoredUser();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskLink, setTaskLink] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (user) fetchTasks();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => t.status === activeFilter));
    }
  }, [activeFilter, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/task/view", {
        params: { role: user.role, employee_code: user.employee_code }
      });
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id) => {
    try {
      setProcessingId(id);
      await API.put(`/task/${id}/start`);
      fetchTasks();
    } catch (err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  const handleComplete = async (task) => {
    if (!taskLink) { setError("Task link is required."); return; }
    try {
      setProcessingId(task.id);
      setError("");
      await API.put(`/task/${task.id}`, { ...task, task_link: taskLink });
      await API.put(`/task/${task.id}/review`);
      await API.put(`/task/${task.id}/complete`);
      setSelectedTask(null);
      setTaskLink("");
      fetchTasks();
    } catch (err) {
      setError("Submission failed.");
      console.error(err);
    } finally { setProcessingId(null); }
  };

  const formatValue = (key, value) => {
    if (!value) return "-";
    if (["created_at", "updated_at", "start_date", "due_date"].includes(key)) {
      return new Date(value).toLocaleDateString('en-GB');
    }
    return value.toString();
  };

  // Chart Data Preparation
  const statusCounts = tasks.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    ["Status", "Count"],
    ["Pending", statusCounts["Pending"] || 0],
    ["In Progress", statusCounts["In Progress"] || 0],
    ["Completed", statusCounts["Completed"] || 0],
  ];

  const chartOptions = {
    backgroundColor: "transparent",
    colors: ["#f59e0b", "#3b82f6", "#10b981"],
    legend: { textStyle: { color: "#9ca3af", fontSize: 12 } },
    pieHole: 0.4,
    chartArea: { width: "100%", height: "80%" },
  };

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-emerald-500" />
            Task <span className="text-emerald-500">Dashboard</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Monitor your productivity and task analytics.</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Tasks" count={tasks.length} icon={<BarChart3 />} color="emerald" />
          <StatCard title="Pending" count={statusCounts["Pending"] || 0} icon={<Clock />} color="amber" />
          <StatCard title="Completed" count={statusCounts["Completed"] || 0} icon={<CheckSquare />} color="blue" />
          
          <div className="col-span-full bg-[#020617] border border-[#053527]/30 rounded-3xl p-6 shadow-xl">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">Performance Analytics</h4>
            <div className="h-[200px] w-full">
              <Chart chartType="BarChart" width="100%" height="100%" data={chartData} options={{ ...chartOptions, legend: 'none' }} />
            </div>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-[#020617] border border-[#053527]/30 rounded-3xl p-6 shadow-xl flex flex-col items-center">
          <h4 className="text-white font-bold mb-2 self-start">Task Distribution</h4>
          <Chart chartType="PieChart" width="100%" height="250px" data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-[#020617]/50 p-2 rounded-2xl border border-white/5 w-fit">
        {["All", "Pending", "In Progress", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeFilter === f ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              onClick={() => { setSelectedTask(task); setTaskLink(task.task_link || ""); }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#020617] border border-[#053527]/30 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-md border border-white/5 uppercase">{task.priority}</span>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-emerald-400">{task.title}</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-end gap-1"><Calendar size={12} /> Due</p>
                  <p className="text-sm text-gray-300 font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : "N/A"}</p>
                </div>
                {task.status === "Pending" ? (
                  <button onClick={(e) => { e.stopPropagation(); handleStart(task.id); }} className="p-2.5 bg-emerald-500 text-black rounded-xl shadow-lg active:scale-90 transition-transform">
                    {processingId === task.id ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                  </button>
                ) : <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-500"><ChevronRight size={20} /></div>}
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 text-gray-500 border-2 border-dashed border-[#053527]/20 rounded-3xl">No tasks found in this category.</div>
          )}
        </div>
      )}

      {/* Modern Modal (Same logic preserved) */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#020617] border border-[#053527] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-[#053527]/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle2 className="text-emerald-500" /> Details</h3>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400"><X size={20} /></button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedTask).map(([key, value]) => {
                  if (["id", "assigned_name", "actual_hours", "task_link", "created_at", "updated_at"].includes(key)) return null;
                  return (
                    <div key={key}>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{key.replace("_", " ")}</p>
                      <p className="text-white text-sm font-medium">{key === "assigned_to" ? selectedTask.assigned_name : formatValue(key, value)}</p>
                    </div>
                  );
                })}
                {selectedTask.status === "In Progress" && (
                  <div className="col-span-full pt-6 border-t border-emerald-500/20 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase"><Link2 size={16} /> Submit Task Link</div>
                    <input type="text" value={taskLink} onChange={(e) => setTaskLink(e.target.value)} placeholder="Paste link..." className="w-full bg-black/40 border border-[#053527]/50 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50" />
                    <button disabled={processingId === selectedTask.id} onClick={() => handleComplete(selectedTask)} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black shadow-lg">
                      {processingId === selectedTask.id ? <Loader2 className="animate-spin" size={20} /> : "SUBMIT COMPLETION"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function StatCard({ title, count, icon, color }) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  };
  return (
    <div className={`p-6 rounded-3xl border shadow-lg ${colors[color]}`}>
      <div className="flex justify-between items-start">
        <div className="p-2 bg-black/20 rounded-lg">{icon}</div>
        <span className="text-2xl font-black">{count}</span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Pending") return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  if (status === "In Progress") return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
}