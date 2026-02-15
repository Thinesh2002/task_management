import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import API from "../../config/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/task/view?role=admin");
      setTasks(res.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
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
    ["Status", "Tasks"],
    ["Completed", completed],
    ["Pending", pending],
    ["In Progress", inProgress],
    ["Overdue", overdue],
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Task Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card icon={<ClipboardList />} title="Total Tasks" value={totalTasks} />
        <Card icon={<CheckCircle />} title="Completed" value={completed} />
        <Card icon={<Clock />} title="In Progress" value={inProgress} />
        <Card icon={<AlertTriangle />} title="Overdue" value={overdue} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Task Distribution
          </h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="300px"
            data={pieData}
            options={{
              backgroundColor: "transparent",
              legendTextStyle: { color: "#888" },
              pieHole: 0.4,
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Task Status Overview
          </h2>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="300px"
            data={barData}
            options={{
              backgroundColor: "transparent",
              legend: { position: "none" },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
      <div className="text-gray-600 dark:text-gray-300">
        {icon}
      </div>
    </div>
  );
}
