import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-3xl font-bold mb-8 text-emerald-400">
        Team Lead Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <Card title="Total Tasks" value="128" />
        <Card title="Completed Tasks" value="96" />
        <Card title="Pending Tasks" value="24" />
        <Card title="Team Members" value="8" />

      </div>

      {/* TASK SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>

          <ul className="space-y-3 text-gray-300">
            <li>• Website redesign assigned</li>
            <li>• API integration completed</li>
            <li>• Database optimization in progress</li>
            <li>• UI improvements pending review</li>
          </ul>
        </div>

        <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>

          <div className="space-y-4">
            <ProgressBar name="John" progress={80} />
            <ProgressBar name="Sara" progress={65} />
            <ProgressBar name="David" progress={90} />
            <ProgressBar name="Maya" progress={70} />
          </div>
        </div>

      </div>

    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function Card({ title, value }) {
  return (
    <div className="bg-[#053527]/10 border border-[#053527]/30 p-6 rounded-2xl shadow-md">
      <h2 className="text-sm text-gray-400 mb-2">{title}</h2>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ProgressBar({ name, progress }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-[#053527]/20 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
