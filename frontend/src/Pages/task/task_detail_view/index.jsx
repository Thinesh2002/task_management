import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../config/api";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Hash,
  Activity,
  CalendarDays,
  Timer
} from "lucide-react";
import { getStoredUser } from "../../../config/auth";
import { motion } from "framer-motion";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [task, setTask] = useState(null);
  const [employeeName, setEmployeeName] = useState("-");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/task/${id}`);
      const taskData = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!taskData) {
        setTask(null);
        return;
      }

      setTask(taskData);

      if (taskData.assigned_to) {
        fetchAssignedName(taskData.assigned_to);
      }

    } catch {
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedName = async (employeeCode) => {
    try {
      const res = await API.get(`/employee`);
      const employees = res.data?.data || [];

      const assigned = employees.find(
        (emp) => emp.employee_code === employeeCode
      );

      setEmployeeName(assigned ? assigned.name : "—");
    } catch {
      setEmployeeName("—");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);

      await API.put(`/task/${id}/status`, {
        status: newStatus,
        role: user?.role
      });

      fetchTask();
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Task not found
      </div>
    );
  }

  const statuses = [
    "Pending",
    "In Progress",
    "Review",
    "On Hold",
    "Completed",
    "Cancelled",
    "Overdue"
  ];

  return (
    <div className="text-white min-h-screen p-6">

      <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className="text-2xl font-black tracking-tight">
          TASK <span className="text-emerald-500 italic">DETAILS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f172a]/40 border border-white/10 rounded-3xl p-8 shadow-xl"
          >

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {task.priority}
              </span>
              <span className="text-gray-500 text-xs font-mono">
                ID: #{task.task_code}
              </span>
            </div>

            <h3 className="text-3xl font-black mb-8">
              {task.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

              <Detail label="Task Code" value={task.task_code} icon={<Hash size={14}/>}/>
              <Detail label="Department Code" value={task.department_code} icon={<Tag size={14}/>}/>
              <Detail label="Assigned To" value={employeeName} icon={<User size={14}/>}/>
              <Detail label="Account" value={task.account} />
              <Detail label="Task Type" value={task.task_type} />
              <Detail label="Task Link" value={task.task_link} />
              <Detail label="Description" value={task.description} />
              <Detail label="Priority" value={task.priority} />
              <Detail label="Status" value={task.status} />
              <Detail label="Progress" value={`${task.progress || 0}%`} />
              <Detail label="Estimated Hours" value={`${task.estimated_hours || 0} hrs`} />
              <Detail label="Actual Hours" value={`${task.actual_hours || 0} hrs`} />
              <Detail label="Remarks" value={task.remarks} />
              <Detail label="Created At" value={formatDate(task.created_at)} />
              <Detail label="Updated At" value={formatDate(task.updated_at)} />

              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                  Change Status
                </p>

                {user?.role === "admin" ? (
                  <select
                    value={task.status}
                    disabled={updating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-[#020617] border border-emerald-500/30 text-emerald-500 text-xs font-bold px-4 py-2 rounded-xl w-full"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl font-bold text-sm">
                    {task.status}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0f172a]/40 border border-white/10 rounded-3xl p-8 shadow-xl space-y-6"
          >
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Timer size={16} className="text-emerald-500"/> Timeline
            </h4>

            <Detail label="Due Date" value={formatDate(task.due_date)} icon={<CalendarDays size={14}/>}/>
            <Detail label="Start Date" value={formatDate(task.start_date)} icon={<Calendar size={14}/>}/>

            <div className="grid grid-cols-2 gap-4">
              <Detail label="Start Time" value={task.start_time} icon={<Clock size={14}/>}/>
              <Detail label="End Time" value={task.end_time} icon={<Clock size={14}/>}/>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}

function Detail({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
        {label}
      </p>
      <div className="flex items-start gap-2 text-white font-semibold text-sm break-all">
        {icon && <span className="text-emerald-500/80">{icon}</span>}
        {value || "—"}
      </div>
    </div>
  );
}
