import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Building2,
  Search
} from "lucide-react";
import API from "../../config/api";

export default function ViewDepartments() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ===============================
  // Fetch Departments
  // ===============================
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/department/view");
      const data = res.data.data ? res.data.data : res.data;
      setDepartments(data);
    } catch (err) {
      setError("Failed to fetch departments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ===============================
  // Delete Department
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await API.delete(`/department/delete/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(
        "Delete failed. This department might be linked to existing employees."
      );
    }
  };

  // ===============================
  // Search Filter (Name + Code)
  // ===============================
  const filteredDepts = departments.filter(
    (dept) =>
      dept.department_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dept.department_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Organizational{" "}
            <span className="text-emerald-400">Departments</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all business units and departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#020617] border border-[#053527] text-white text-sm pl-10 pr-4 py-2 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none w-64 transition-all"
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => navigate("/create-department")}
            className="flex items-center gap-2 bg-[#053527] hover:bg-[#053527]/80 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-[#053527]/20"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE */}
      <div className="bg-[#020617] border border-[#053527]/30 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-gray-500 text-sm animate-pulse font-medium">
              Loading departments...
            </p>
          </div>
        ) : filteredDepts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-[#053527]/10 rounded-full text-[#053527] mb-4">
              <Building2 size={40} />
            </div>
            <p className="text-gray-400 font-medium">
              No departments found.
            </p>
            <button
              onClick={() => navigate("/create-department")}
              className="text-emerald-400 text-sm mt-2 hover:underline"
            >
              Create your first department
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-[10px] uppercase bg-[#053527]/20 text-emerald-400/70 font-black tracking-[0.15em]">
                <tr>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Department Code</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#053527]/10">
                {filteredDepts.map((dept) => (
                  <tr
                    key={dept.id}
                    className="group hover:bg-[#053527]/5 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#053527]/20 flex items-center justify-center text-emerald-400">
                          <Building2 size={16} />
                        </div>
                        <span className="text-white font-semibold tracking-wide">
                          {dept.department_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-emerald-400 font-mono tracking-wider">
                      {dept.department_code}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/edit-department/${dept.id}`)
                          }
                          className="p-2 rounded-lg bg-white/5 text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Edit Department"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-2 rounded-lg bg-white/5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete Department"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
