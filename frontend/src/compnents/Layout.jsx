import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Base/Header/index";
import Sidebar from "./Base/Sidebar/index";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Body scroll prevent panna
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    // Main Background using #020617
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden font-sans">
      
      {/* HEADER - Fixed at top */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* MOBILE OVERLAY WITH ANIMATION */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* SIDEBAR - Responsive with modern transition */}
        <aside
          className={`
            fixed lg:static z-40 h-full w-72
            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            ${sidebarOpen ? "translate-x-0 shadow-[20px_0_50px_rgba(5,53,39,0.3)]" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          
          {/* Subtle Background Glow using #053527 for Task Theme */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#053527]/20 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:py-8 sidebar-scroll relative z-10">
            {/* Page Wrapper for consistent spacing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </div>
        </main>

      </div>
    </div>
  );
}