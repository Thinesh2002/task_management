import React, { useEffect, useState } from "react";
import API from "../../../config/api";
import { useNavigate } from "react-router-dom";
import { Loader2, ClipboardPlus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getStoredUser } from "../../../config/auth";

export default function CreateTask() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [taskCode, setTaskCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");

  const [account, setAccount] = useState("");
  const [taskType, setTaskType] = useState("");
  const [remarks, setRemarks] = useState("");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await API.get("/task/view");
        const taskData = Array.isArray(taskRes.data)
          ? taskRes.data
          : taskRes.data.data || [];

        const tkvNumbers = taskData
          .filter(t => t.task_code?.startsWith("TKV"))
          .map(t => parseInt(t.task_code.replace("TKV", "")))
          .filter(num => !isNaN(num));

        const nextNumber = tkvNumbers.length
          ? Math.max(...tkvNumbers) + 1
          : 1;

        const formattedCode = `TKV${String(nextNumber).padStart(3, "0")}`;
        setTaskCode(formattedCode);

        const empRes = await API.get("/employee");
        const empData = Array.isArray(empRes.data)
          ? empRes.data
          : empRes.data.data || [];

        const filteredEmployees = empData.filter(
          (emp) => emp.role !== "admin"
        );

        setEmployees(filteredEmployees);

        const deptRes = await API.get("/department/view");
        const deptData = Array.isArray(deptRes.data)
          ? deptRes.data
          : deptRes.data.data || [];

        setDepartments(deptData);

      } catch {
        setMsg("Failed to load data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!title.trim()) return setMsg("Task title is required.");
    if (!departmentCode) return setMsg("Please select department.");
    if (!assignedTo) return setMsg("Please select a staff member.");
    if (!dueDate) return setMsg("Due date is required.");
    if (!user?.id) return setMsg("Invalid login session.");

    setLoading(true);

    try {
      await API.post("/task/create", {
        task_code: taskCode,
        title: title.trim(),
        description: description.trim(),
        department_code: departmentCode,
        assigned_to: assignedTo,
        priority,
        due_date: dueDate,
        estimated_hours: Number(estimatedHours) || 0,
        account: account.trim(),
        task_type: taskType.trim(),
        remarks: remarks.trim(),
        created_by: Number(user.id)
      });

      navigate("/dashboard");

    } catch (err) {
      setMsg(err?.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#020617] border border-[#053527]/30 rounded-3xl shadow-2xl overflow-hidden"
        >

          <div className="p-8 border-b border-[#053527]/20">
            <div className="flex items-center gap-3">
              <ClipboardPlus className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold text-white">
                Create Task
              </h2>
            </div>
          </div>

          {msg && (
            <div className="m-6 text-sm text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-xl">
              {msg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <Input label="Task ID" value={taskCode} readOnly />
            <Input label="Task Title" value={title} onChange={setTitle} required />
            <Textarea label="Description" value={description} onChange={setDescription} full />

            <Select
              label="Department"
              value={departmentCode}
              onChange={setDepartmentCode}
              options={departments.map(d => ({
                value: d.department_code,
                label: d.department_name
              }))}
            />

            <Select
              label="Assign To"
              value={assignedTo}
              onChange={setAssignedTo}
              options={employees.map(e => ({
                value: e.employee_code,
                label: `${e.name} (${e.employee_code})`
              }))}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={["Low","Medium","High","Urgent"].map(p => ({
                value: p,
                label: p
              }))}
            />

            <Input label="Account" value={account} onChange={setAccount} />
            <Input label="Task Type" value={taskType} onChange={setTaskType} />
            <Input label="Due Date" type="date" value={dueDate} onChange={setDueDate} required />
            <Input label="Estimated Hours" type="number" value={estimatedHours} onChange={setEstimatedHours} />
            <Textarea label="Remarks" value={remarks} onChange={setRemarks} full />

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "CREATE TASK"}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", required, readOnly }) {
  return (
    <div>
      <label className="text-xs text-emerald-500/60 uppercase">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        required={required}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full mt-2 bg-[#053527]/5 border border-[#053527]/20 rounded-xl px-4 py-3 text-white"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs text-emerald-500/60 uppercase">{label}</label>
      <textarea
        rows="4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 bg-[#053527]/5 border border-[#053527]/20 rounded-xl px-4 py-3 text-white"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-emerald-500/60 uppercase">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 bg-[#053527]/5 border border-[#053527]/20 rounded-xl px-4 py-3 text-white"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
