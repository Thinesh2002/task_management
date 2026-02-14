import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  PlusSquare,
  Users,
  LayoutDashboard,
  X,
  ChevronRight,
  ListTodo,
  PieChart
} from "lucide-react";
import { getStoredUser } from "../../../config/auth";

export default function Sidebar({ onClose }) {
  const user = getStoredUser();
  const role = user?.role;

  return (
    <aside className="w-72 h-full bg-[#020617] text-white border-r border-[#053527] flex flex-col relative">

      {/* MOBILE CLOSE BUTTON */}
      <div className="lg:hidden flex justify-end p-4 absolute right-0 top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-xl bg-[#053527]/30 text-[#053527] border border-[#053527]/50"
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 sidebar-scroll">

        {(role === "team_lead" || role === "admin") && (
          <Section title="Task Management">
            <Item to="/dashboard" icon={LayoutDashboard} label="Overview" onClick={onClose} />
            <Item to="/tasks/manage" icon={ListTodo} label="All Tasks" onClick={onClose} />
            <Item to="/create-task" icon={PlusSquare} label="Create Task" onClick={onClose} />
          </Section>


        )}

        {(role === "admin" || role === "team_lead") && (
          <Section title="Deparment">
            <Item to="/view-department" icon={Users} label=" ManageDeparment" onClick={onClose} />
            <Item to="/create-department" icon={Users} label=" Create Deparment" onClick={onClose} />

          </Section>
        )}


        {(role === "admin" || role === "team_lead") && (
          <Section title="Employees">
            {(role === "admin") && (
              <Item
                to="/add-emp"
                icon={PlusSquare}
                label="Add Employee"
                onClick={onClose}
              />
            )}

            <Item
              to="/view-emp"
              icon={Users}
              label="View Employees"
              onClick={onClose}
            />
          </Section>
        )}


        {role === "team_member" && (
          <Section title="My Workspace">
            <Item to="/tasks/manage" icon={LayoutDashboard} label="My Dashboard" onClick={onClose} />
            <Item to="/tasks/manage" icon={LayoutDashboard} label="My Task" onClick={onClose} />
          </Section>
        )}

      </div>



    </aside>
  );
}

/* ================= HELPER COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="px-4 text-[11px] text-[#053527] brightness-125 font-bold tracking-[0.2em] uppercase opacity-70">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
        ${isActive
          ? "bg-[#053527]/20 text-white ring-1 ring-[#053527]/50"
          : "text-gray-400 hover:bg-[#053527]/5 hover:text-gray-200"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                size={18}
                className={`${isActive
                    ? "text-[#053527] brightness-150"
                    : "text-gray-500 group-hover:text-[#053527]"
                  } transition-colors`}
              />
            )}
            <span className="truncate">{label}</span>
          </div>

          {isActive && (
            <motion.div layoutId="activeArrow">
              <ChevronRight size={14} className="text-[#053527] brightness-150" />
            </motion.div>
          )}

          {isActive && (
            <div className="absolute inset-0 bg-[#053527]/5 blur-lg -z-10 rounded-xl" />
          )}
        </>
      )}
    </NavLink>
  );
}
