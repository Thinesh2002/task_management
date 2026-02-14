import React, { useEffect, useState } from "react";
import API from "../../config/api";
import { Trash2, Pencil, Search, Mail, Phone, Briefcase, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmployeeView() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employee");
      setEmployees(res.data.data || []);
    } catch (err) {
      setMsg("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employee/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch {
      setMsg("Delete failed");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* SEARCH SECTION - Minimalist */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Employee <span className="text-emerald-500">Directory</span>
        </h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#053527]/10 border border-[#053527]/30 text-white text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 w-full md:w-72 transition-all"
          />
        </div>
      </div>

      {msg && (
        <div className="mb-4 text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-4 py-2 rounded-lg">
          {msg}
        </div>
      )}

      {/* TABLE SECTION - Transparent & Modern */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm animate-pulse">Updating records...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#053527]/30">
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Member</th>
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Office</th>
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 py-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#053527]/10">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-[#053527]/5 transition-colors">
                  {/* Member Info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#053527]/20 border border-[#053527]/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white leading-none mb-1">{emp.name}</div>
                        <div className="text-[10px] font-mono text-emerald-500/60 uppercase">{emp.employee_code}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Mail size={12} className="text-emerald-500/30" />
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Phone size={12} className="text-emerald-500/30" />
                        {emp.phone}
                      </div>
                    </div>
                  </td>

                  {/* Office Details */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={12} className="text-emerald-500/30" />
                      <span className="text-xs text-gray-300">{emp.department}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 ml-5 capitalize">{emp.role?.replace('_', ' ')}</div>
                  </td>

                  {/* Join Date */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} className="text-emerald-500/30" />
                      {emp.join_date ? new Date(emp.join_date).toLocaleDateString('en-CA') : '-'}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                      emp.status === 'Active' 
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/5 text-red-400 border-red-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${emp.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      {emp.status}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/edit-emp/${emp.id}`)}
                        className="p-1.5 rounded-md bg-white/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-1.5 rounded-md bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}