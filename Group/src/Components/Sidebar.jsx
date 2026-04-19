import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col bg-[#2F4156] px-5 py-6 text-white md:flex">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide">NovaNest</h1>
        <p className="mt-1 text-sm text-[#C8D9E6]">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-3">
        <div className="rounded-xl px-4 py-3 text-sm font-medium text-[#F5EFEB] opacity-70">
          Dashboard
        </div>

        <NavLink
          to="/admin/hotels"
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#567C8D] text-white shadow-md"
                : "text-[#F5EFEB] hover:bg-[#567C8D]/40"
            }`
          }
        >
          Hotel Management
        </NavLink>

        <div className="rounded-xl px-4 py-3 text-sm font-medium text-[#F5EFEB] opacity-70">
          Room Management
        </div>

        <div className="rounded-xl px-4 py-3 text-sm font-medium text-[#F5EFEB] opacity-70">
          Booking Management
        </div>

        <div className="rounded-xl px-4 py-3 text-sm font-medium text-[#F5EFEB] opacity-70">
          Settings
        </div>

        <div className="rounded-xl px-4 py-3 text-sm font-medium text-[#F5EFEB] opacity-70">
          Admin Profile
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;