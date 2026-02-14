import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import API from "../../../config/api";
import { getStoredUser } from "../../../config/auth";
import { 
  Loader2, Search, CheckCircle2, Clock, 
  AlertTriangle, LayoutGrid, Filter, 
  BarChart3, PieChart as PieIcon, ListChecks
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageTasks() {
  const user = getStoredUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Comprehensive Filter Logic
  useEffect(() => {
    let results = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           task.assigned_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredTasks(results);
  }, [searchTerm, statusFilter, priorityFilter, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/task/view");
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (error) {
      setMsg("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // --- Chart Data Preparation ---
  const getStatusData = () => {
    const counts = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
    return [
      ["Status", "Count"],
      ...Object.entries(counts)
    ];
  };

  const getPriorityData = () => {
    const counts = tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});
    return [
      ["Priority", "Count", { role: "style" }],
      ["High", counts["High"] || 0, "#ef4444"],
      ["Medium", counts["Medium"] || 0, "#f59e0b"],
      ["Low", counts["Low"] || 0, "#10b981"]
    ];
  };

  const chartOptions = {
    backgroundColor: "transparent",
    legend: { textStyle: { color: "#9ca3af", fontSize: 12 } },
    colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#64748b"],
    pieHole: 0.4,
    chartArea: { width: "90%", height: "80%" },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "In Progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Review": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Completed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "On Hold": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="  text-white space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Task <span className="text-emerald-500">Dashboard</span></h2>
          <p className="text-gray-500 text-sm mt-1">Analytical overview of all departmental tasks.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchTasks} className=" text-emerald-500 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                <Clock size={20} />
            </button>
        </div>
      </div>

      {/* 2. Analytics Dashboard (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className=" border border-[#053527]/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={18} className="text-emerald-500" />
            <h4 className="font-bold">Task Status Distribution</h4>
          </div>
          <Chart chartType="PieChart" width="100%" height="250px" data={getStatusData()} options={chartOptions} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#020617] border border-[#053527]/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-emerald-500" />
            <h4 className="font-bold">Priority Breakdown</h4>
          </div>
          <Chart chartType="ColumnChart" width="100%" height="250px" data={getPriorityData()} options={{ ...chartOptions, legend: 'none' }} />
        </motion.div>
      </div>

      {/* 3. Filters & Search */}
      <div className=" border border-[#053527]/20 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <Filter size={18} className="text-emerald-500" />
            <h4 className="font-bold text-sm uppercase tracking-widest">Filter & Search</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search title or member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#053527]/10 border border-[#053527]/30 rounded-xl pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#053527]/10 border border-[#053527]/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
          >
            <option value="All" className="bg-[#020617]">All Statuses</option>
            {["Pending", "In Progress", "Review", "Completed", "On Hold", "Cancelled"].map(s => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#053527]/10 border border-[#053527]/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
          >
            <option value="All" className="bg-[#020617]">All Priorities</option>
            {["High", "Medium", "Low"].map(p => <option key={p} value={p} className="bg-[#020617]">{p}</option>)}
          </select>

          <div className="flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-xs font-bold text-emerald-500">
            {filteredTasks.length} Result(s) Found
          </div>
        </div>
      </div>

      {/* 4. Tasks Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
      ) : (
        <div className=" border border-[#053527]/30 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#053527]/40 text-emerald-500 text-[11px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-5">Task Details</th>
                  <th className="p-5">Assigned To</th>
                  <th className="p-5">Priority</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#053527]/20">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={task.id} 
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="group cursor-pointer hover:bg-[#053527]/10 transition-colors duration-300"
                    >
                      <td className="p-5">
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{task.title}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Code: {task.task_code || "N/A"}</div>
                      </td>
                      <td className="p-5 text-sm text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] border border-emerald-500/20">
                                {task.assigned_name?.charAt(0) || "?"}
                            </div>
                            {task.assigned_name}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase border ${
                            task.priority === "High" ? "text-red-400 border-red-500/20 bg-red-500/5" : 
                            task.priority === "Medium" ? "text-amber-400 border-amber-500/20 bg-amber-500/5" : 
                            "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-5 min-w-[150px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                            />
                          </div>
                          <span className="text-[10px] font-black text-emerald-500">{task.progress}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                    <ListChecks size={40} className="opacity-20" />
                    <p>No tasks found matching your criteria.</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}