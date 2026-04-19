import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import AdminSidebar from "../Components/AdminSidebar";
import StatCard from "../Components/StatCard";
import { bookingsData } from "../data/BookingsData";
import AdminMoves from "../Components/AdminBookingStates";
import useAdminThemeMode from "../hooks/useAdminThemeMode";
import { useAuth } from "../Context/AuthContext";

import {
  CalendarCheck,
  Users,
  BedDouble,
  XCircle,
  Plus,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", bookings: 10, confirmed: 6, cancelled: 2 },
  { month: "Feb", bookings: 20, confirmed: 12, cancelled: 4 },
  { month: "Mar", bookings: 15, confirmed: 9, cancelled: 3 },
  { month: "Apr", bookings: 30, confirmed: 20, cancelled: 5 },
  { month: "May", bookings: 25, confirmed: 18, cancelled: 4 },
  { month: "Jun", bookings: 35, confirmed: 25, cancelled: 6 },
  { month: "Jul", bookings: 40, confirmed: 30, cancelled: 7 },
];

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useAdminThemeMode();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([
    { text: "Respond to new inquiries", done: true },
    { text: "Check room availability", done: true },
    { text: "Follow up on pending bookings", done: false },
  ]);

  const addTask = () => {
    const newTask = prompt("Enter new task:");
    if (!newTask || newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, done: false }]);
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`admin-theme flex h-screen ${darkMode ? "admin-theme-dark bg-gray-900 text-white" : "admin-theme-light bg-[#f5f7fb]"}`}>
      <AdminSidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar
          title="Dashboard"
          onToggleSidebar={() => setCollapsed(!collapsed)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-4 gap-5 mb-6">
            <StatCard icon={<CalendarCheck />} title="Total Bookings" value="124" />
            <StatCard icon={<Users />} title="Users" value="89" />
            <StatCard icon={<BedDouble />} title="Available Rooms" value="20" />
            <StatCard icon={<XCircle />} title="Cancelled" value="6" />
          </div>

          <div className="grid grid-cols-3 gap-5 mb-6">
            <div className="col-span-2 flex flex-col gap-5">

              {/* Chart */}
              <div className={`p-5 rounded-2xl shadow-sm h-64 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-[#2c3a47]"}`}>
                  Booking Overview
                </h3>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <XAxis dataKey="month" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#163f8f"
                        fill="#163f8f33"
                      />
                      <Area
                        type="monotone"
                        dataKey="confirmed"
                        stroke="#7ea0d6"
                        fill="#7ea0d633"
                      />
                      <Area
                        type="monotone"
                        dataKey="cancelled"
                        stroke="#f56565"
                        fill="#f5656533"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className={`p-5 rounded-2xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-[#2c3a47]"}`}>
                  Recent Bookings
                </h3>

                <table className="w-full text-sm">
                  <thead>
                    <tr className={`text-left border-b ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-500"}`}>
                      <th className="py-2">Booking ID</th>
                      <th>Guest Name</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookingsData.map((b, i) => (
                      <tr key={i} className={`border-b transition ${darkMode ? "border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                        <td className="py-3 text-blue-600 font-medium">{b.id}</td>
                        <td>{b.name}</td>
                        <td>{b.date}</td>
                        <td>{b.date}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs text-white
                              ${b.status === "Confirmed" && "bg-green-500"}
                              ${b.status === "Pending" && "bg-yellow-500"}
                              ${b.status === "Cancelled" && "bg-red-500"}
                            `}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AdminMoves />
            </div>

            <div className="flex flex-col gap-4">

              {/* Tasks */}
              <div className={`p-5 rounded-2xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-semibold ${darkMode ? "text-white" : "text-[#2c3a47]"}`}>Tasks</h3>

                  <button
                    onClick={addTask}
                    className="flex items-center gap-1 bg-[#163f8f] text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    <Plus size={14} />
                    Add New
                  </button>
                </div>

                <div className="divide-y">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      onClick={() => toggleTask(index)}
                      className="flex items-center justify-between py-3 cursor-pointer"
                    >
                      <span>{task.text}</span>
                      {task.done ? "✅" : "⏳"}
                    </div>
                  ))}
                </div>
              </div>

             

              {/* Top Customers */}
              <div className={`p-5 rounded-2xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-[#2c3a47]"}`}>
                  Top Customers
                </h3>

                <div className="space-y-4 divide-y">
                  {bookingsData.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://i.pravatar.cc/40?img=${i + 10}`}
                          alt={c.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className={`font-medium ${darkMode ? "text-white" : "text-[#2c3a47]"}`}>{c.name}</p>
                          <p className="text-xs text-gray-400">
                            {c.payment.length} Bookings
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#5b8cff] to-[#3b6edc] text-white px-3 py-1 rounded-lg text-sm">
                        {c.payment.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}