import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  LayoutDashboard,
  PieChart as PieIcon,
  BarChart3
} from "lucide-react";
import API from "../../config/api";
import { getStoredUser } from "../../config/auth";
import { motion } from "framer-motion";

export default function TeamLeadDashboard() {
  const [tasks, setTasks] = useState([]);
  const user = getStoredUser();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get(
        `/task/view?role=team_lead&employee_code=${user.employee_code}`
      );
      setTasks(res.data);
    } catch (error) {
      console.error("TeamLead Dashboard Error:", error);
    }
  };

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const pending = tasks.filter(t => t.status === "Pending").length;

  const employeeMap = {};
  tasks.forEach(task => {
    if (!employeeMap[task.assigned_name]) {
      employeeMap[task.assigned_name] = 0;
    }
    employeeMap[task.assigned_name]++;
  });

  const employeeChartData = [
    ["Employee", "Tasks", { role: "style" }],
    ...Object.entries(employeeMap).map(([name, count]) => [name, count, "#10b981"])
  ];

  const statusChartData = [
    ["Status", "Count"],
    ["Completed", completed],
    ["In Progress", inProgress],
    ["Pending", pending]
  ];

  const chartOptions = {
    backgroundColor: "transparent",
    colors: ["#10b981", "#3b82f6", "#f59e0b"],
    legend: { textStyle: { color: "#9ca3af", fontSize: 12 } },
    pieHole: 0.5,
    chartArea: { width: "90%", height: "80%" },
  };

  return (
    <div className=" text-white">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#053527]/30 pb-6">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <LayoutDashboard className="text-emerald-500" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Team Lead <span className="text-emerald-500">Analytics</span>
          </h1>
          <p className="text-gray-500 text-sm">Monitoring team productivity and task flow.</p>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card 
          icon={<ClipboardList size={22}/>} 
          title="Total Assigned" 
          value={totalTasks} 
          color="blue"
        />
        <Card 
          icon={<CheckCircle size={22}/>} 
          title="Completed" 
          value={completed} 
          color="emerald"
        />
        <Card 
          icon={<Clock size={22}/>} 
          title="Active Now" 
          value={inProgress} 
          color="amber"
        />
        <Card 
          icon={<Users size={22}/>} 
          title="Team Size" 
          value={Object.keys(employeeMap).length} 
          color="purple"
        />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className=" border border-[#053527]/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="text-emerald-500" size={18} />
            <h2 className="text-lg font-bold tracking-tight">Task Status Distribution</h2>
          </div>
          <Chart
            chartType="PieChart"
            width="100%"
            height="320px"
            data={statusChartData}
            options={chartOptions}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#020617] border border-[#053527]/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-emerald-500" size={18} />
            <h2 className="text-lg font-bold tracking-tight">Performance by Member</h2>
          </div>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="320px"
            data={employeeChartData}
            options={{
              ...chartOptions,
              legend: { position: "none" },
              vAxis: { textStyle: { color: "#6b7280" }, gridlines: { color: "#ffffff10" } },
              hAxis: { textStyle: { color: "#6b7280" } }
            }}
          />
        </motion.div>

      </div>
    </div>
  );
}

function Card({ icon, title, value, color }) {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#020617] border border-[#053527]/30 p-6 rounded-[1.5rem] shadow-xl flex items-center justify-between group transition-all hover:border-emerald-500/40"
    >
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-black text-white group-hover:text-emerald-500 transition-colors">
          {value}
        </p>
      </div>
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorMap[color]}`}>
        {icon}
      </div>
    </motion.div>
  );
}