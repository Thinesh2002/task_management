import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-400">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Team Leads</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Team Members</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

      </div>
    </div>
  );
}
