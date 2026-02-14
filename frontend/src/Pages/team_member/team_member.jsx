import React from "react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      
      <h1 className="text-3xl font-bold mb-6 text-emerald-400">
        Team Member Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">My Tasks</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Pending Tasks</h2>
          <p className="text-3xl font-bold">--</p>
        </div>

      </div>

      <div className="mt-10 bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3 text-gray-300">
          <li>• Task A assigned</li>
          <li>• Task B completed</li>
          <li>• Task C pending review</li>
        </ul>
      </div>

    </div>
  );
}
