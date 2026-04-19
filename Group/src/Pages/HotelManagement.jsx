import React, { useMemo, useState } from "react";
import hotelsData from "../data/hotels";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/AdminNavbar";
import BranchForm from "../Components/BranchForm";
import { logAuditEvent } from "../services/auditLogger";
import useAdminThemeMode from "../hooks/useAdminThemeMode";
import { useLanguage } from "../Context/LanguageContext";

function HotelManagement() {
  const { darkMode } = useAdminThemeMode();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [branchToView, setBranchToView] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const initialBranches = useMemo(() => {
    const groupedBranches = hotelsData.reduce((acc, room) => {
      if (!acc[room.branch]) {
        acc[room.branch] = {
          id: room.branch,
          name: room.branch,
          hotelName: room.hotelName,
          city: room.city,
          address: room.location,
          status: "Active",
          rating: room.rating,
          image: room.image,
          amenities: [...room.amenities],
          description: `${room.branch} offers ${room.type.toLowerCase()} and premium room options in ${room.city}.`,
          phone: "+20 100 000 0000",
          email: `${room.branch.toLowerCase().replace(/\s+/g, "")}@novanest.com`,
          rooms: [room],
        };
      } else {
        acc[room.branch].rooms.push(room);

        const roomCount = acc[room.branch].rooms.length;
        acc[room.branch].rating = Number(
          (
            (Number(acc[room.branch].rating) * (roomCount - 1) + Number(room.rating)) /
            roomCount
          ).toFixed(1)
        );

        acc[room.branch].amenities = [
          ...new Set([...acc[room.branch].amenities, ...room.amenities]),
        ];
      }

      return acc;
    }, {});

    return Object.values(groupedBranches).map((branch, index) => ({
      ...branch,
      id: index + 1,
      rating: Number(branch.rating),
    }));
  }, []);

  const [branches, setBranches] = useState(initialBranches);

  const cities = ["all", ...new Set(branches.map((branch) => branch.city))];
  const statuses = ["all", ...new Set(branches.map((branch) => branch.status))];

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchesSearch =
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity =
        selectedCity === "all" || branch.city === selectedCity;

      const matchesStatus =
        selectedStatus === "all" || branch.status === selectedStatus;

      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [branches, searchTerm, selectedCity, selectedStatus]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
  };

  const handleConfirmDelete = () => {
    const target = branchToDelete;

    setBranches((prevBranches) =>
      prevBranches.filter((branch) => branch.id !== branchToDelete.id)
    );
    setBranchToDelete(null);

    if (target) {
      logAuditEvent({
        actionType: "hotel.branch.deleted",
        module: "hotel_management",
        entityType: "branch",
        entityId: String(target.id),
        targetLabel: target.name,
        status: "success",
        reason: "Branch removed by admin",
        before: {
          name: target.name,
          city: target.city,
          status: target.status,
        },
      });

      showToast(`Branch "${target.name}" deleted successfully.`);
    }
  };

  const handleCancelDelete = () => {
    setBranchToDelete(null);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleAddBranch = (newBranchData) => {
    const newBranch = {
      ...newBranchData,
      id: branches.length ? Math.max(...branches.map((b) => b.id)) + 1 : 1,
      rating: Number(newBranchData.rating),
      amenities: newBranchData.amenities || [],
      rooms: [],
    };

    setBranches((prevBranches) => [newBranch, ...prevBranches]);
    setShowAddForm(false);

    showToast(`Branch "${newBranch.name}" added successfully.`);
  };

  const handleEditClick = (branch) => {
    setBranchToEdit(branch);
  };

  const handleUpdateBranch = (updatedBranchData) => {
    const editedName = branchToEdit?.name;

    setBranches((prevBranches) =>
      prevBranches.map((branch) =>
        branch.id === branchToEdit.id
          ? {
              ...branch,
              ...updatedBranchData,
              rating: Number(updatedBranchData.rating),
            }
          : branch
      )
    );

    setBranchToEdit(null);

    showToast(
      `Branch "${updatedBranchData.name || editedName}" updated successfully.`
    );
  };

  const handleViewClick = (branch) => {
    setBranchToView(branch);
  };

  const getBranchStatusLabel = (status) => {
    return t(`hotelMgmt.status.${String(status).toLowerCase()}`);
  };

  const getCityLabel = (city) => {
    if (city === "all") return t("hotelMgmt.filter.allCities");
    return city;
  };

  const getStatusFilterLabel = (status) => {
    if (status === "all") return t("hotelMgmt.filter.allStatus");
    return getBranchStatusLabel(status);
  };

  return (
    <div
      className={`admin-theme admin-route-page flex min-h-screen ${
        darkMode
          ? "admin-theme-dark bg-gray-900 text-white"
          : "admin-theme-light bg-[#F8FAFC]"
      }`}
    >
      <AdminSidebar collapsed={collapsed} />

      <div className="flex-1">
        <AdminNavbar onToggleSidebar={handleToggleSidebar} />

        <div className="p-4 sm:p-6">
          {toast.show && (
            <div className="fixed right-6 top-24 z-[60]">
              <div
                className={`rounded-2xl border px-5 py-4 text-sm font-semibold shadow-xl ${
                  toast.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : toast.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {toast.message}
              </div>
            </div>
          )}

          <section className="space-y-6">
            <div className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-sm md:flex-row md:items-center md:justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#C8D9E6]"}`}>
              <div>
                <h1 className={`text-2xl font-bold sm:text-3xl ${darkMode ? "text-white" : "text-[#2F4156]"}`}>
                  {t("hotelMgmt.title")}
                </h1>
                <p className={`mt-2 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>
                  {t("hotelMgmt.subtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center justify-center rounded-2xl bg-[#2F4156] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#567C8D]"
              >
                + Add New Branch
              </button>
            </div>

            <div className={`admin-route-soft-panel grid gap-4 rounded-2xl p-4 shadow-sm md:grid-cols-3 ${darkMode ? "bg-gray-800" : "bg-[#C8D9E6]"}`}>
              <div>
                <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#2F4156]"}`}>
                  {t("hotelMgmt.filter.searchBranch")}
                </label>
                <input
                  type="text"
                  placeholder={t("hotelMgmt.filter.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-2xl border border-transparent px-4 py-3 text-sm outline-none transition ${darkMode ? "bg-gray-700 text-white focus:border-gray-500" : "bg-white text-[#2F4156] focus:border-[#567C8D]"}`}
                />
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#2F4156]"}`}>
                  {t("hotelMgmt.filter.city")}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={`w-full rounded-2xl border border-transparent px-4 py-3 text-sm outline-none transition ${darkMode ? "bg-gray-700 text-white focus:border-gray-500" : "bg-white text-[#2F4156] focus:border-[#567C8D]"}`}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {getCityLabel(city)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#2F4156]"}`}>
                  {t("hotelMgmt.filter.status")}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full rounded-2xl border border-transparent px-4 py-3 text-sm outline-none transition ${darkMode ? "bg-gray-700 text-white focus:border-gray-500" : "bg-white text-[#2F4156] focus:border-[#567C8D]"}`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusFilterLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredBranches.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className={`overflow-hidden rounded-3xl border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#D9E4EC]"}`}
                  >
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="h-52 w-full object-cover"
                    />

                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#2F4156]"}`}>
                            {branch.name}
                          </h2>
                          <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>
                            {branch.city}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            branch.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {getBranchStatusLabel(branch.status)}
                        </span>
                      </div>

                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>{branch.address}</p>

                      <div className={`flex items-center gap-1 text-sm ${darkMode ? "text-gray-200" : "text-[#2F4156]"}`}>
                        <span className="font-semibold">Rating:</span>
                        <span>{branch.rating}</span>
                      </div>

                      <div className={`rounded-2xl p-3 text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-[#F5EFEB] text-[#2F4156]"}`}>
                        <span className="font-semibold">Total Rooms Types:</span>{" "}
                        {branch.rooms.length}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {branch.amenities.slice(0, 6).map((amenity) => (
                          <span
                            key={amenity}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-200" : "bg-[#F5EFEB] text-[#2F4156]"}`}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <p className={`text-sm leading-6 ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>
                        {branch.description}
                      </p>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleViewClick(branch)}
                          className="rounded-2xl bg-[#567C8D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2F4156]"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(branch)}
                          className="rounded-2xl border border-[#567C8D] px-4 py-2 text-sm font-medium text-[#567C8D] transition hover:bg-[#567C8D] hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(branch)}
                          className="rounded-2xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          {t("hotelMgmt.actions.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-3xl border p-10 text-center shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#D9E4EC]"}`}>
                <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-[#2F4156]"}`}>
                  {t("hotelMgmt.empty.title")}
                </h3>
                <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>
                  {t("hotelMgmt.empty.subtitle")}
                </p>
              </div>
            )}

            {showAddForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                <div className={`relative w-full max-w-4xl overflow-hidden rounded-[30px] shadow-2xl ${darkMode ? "bg-gray-900" : "bg-[#F5EFEB]"}`}>
                  <div className="flex items-center justify-between bg-[#2F4156] px-6 py-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Add New Branch
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
                    <BranchForm
                      onSubmit={handleAddBranch}
                      onCancel={() => setShowAddForm(false)}
                      submitButtonText="Save Branch"
                      successMessage="Branch information saved successfully."
                    />
                  </div>
                </div>
              </div>
            )}

            {branchToEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                <div className={`relative w-full max-w-4xl overflow-hidden rounded-[30px] shadow-2xl ${darkMode ? "bg-gray-900" : "bg-[#F5EFEB]"}`}>
                  <div className="flex items-center justify-between bg-[#2F4156] px-6 py-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Edit Branch
                      </h2>
                      <p className="mt-1 text-sm text-[#C8D9E6]">
                        Update the details of {branchToEdit.name}.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBranchToEdit(null)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
                    <BranchForm
                      initialData={branchToEdit}
                      onSubmit={handleUpdateBranch}
                      onCancel={() => setBranchToEdit(null)}
                      submitButtonText="Update Branch"
                      successMessage="Branch information updated successfully."
                    />
                  </div>
                </div>
              </div>
            )}

            {branchToView && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                <div className={`relative w-full max-w-3xl overflow-hidden rounded-[30px] shadow-2xl ${darkMode ? "bg-gray-900" : "bg-[#F5EFEB]"}`}>
                  <div className="flex items-center justify-between bg-[#2F4156] px-6 py-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Branch Details
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBranchToView(null)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
                    <div className={`space-y-6 rounded-[26px] p-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                      <img
                        src={branchToView.image}
                        alt={branchToView.name}
                        className="h-64 w-full rounded-3xl object-cover"
                      />

                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-[#2F4156]">
                            {branchToView.name}
                          </h3>
                          <p className="mt-1 text-[#567C8D]">
                            {branchToView.city}, Egypt
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                            branchToView.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {branchToView.status}
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                          <p className="text-sm font-medium text-[#567C8D]">
                            Address
                          </p>
                          <p className="mt-2 text-[#2F4156]">
                            {branchToView.address}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                          <p className="text-sm font-medium text-[#567C8D]">
                            Rating
                          </p>
                          <p className="mt-2 text-[#2F4156]">
                            {branchToView.rating}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                          <p className="text-sm font-medium text-[#567C8D]">
                            Phone
                          </p>
                          <p className="mt-2 text-[#2F4156]">
                            {branchToView.phone}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                          <p className="text-sm font-medium text-[#567C8D]">
                            Email
                          </p>
                          <p className="mt-2 text-[#2F4156]">
                            {branchToView.email}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                        <p className="text-sm font-medium text-[#567C8D]">
                          Description
                        </p>
                        <p className="mt-2 leading-7 text-[#2F4156]">
                          {branchToView.description}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                        <p className="text-sm font-medium text-[#567C8D]">
                          Amenities
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {branchToView.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-full border border-[#C8D9E6] bg-white px-3 py-1 text-xs font-medium text-[#2F4156]"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4">
                        <p className="text-sm font-medium text-[#567C8D]">
                          Room Types in this Branch
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {branchToView.rooms.map((room) => (
                            <span
                              key={room.id}
                              className="rounded-full border border-[#C8D9E6] bg-white px-3 py-1 text-xs font-medium text-[#2F4156]"
                            >
                              {room.roomName}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBranchToView(null);
                            setBranchToEdit(branchToView);
                          }}
                          className="rounded-2xl border border-[#567C8D] bg-white px-6 py-4 text-base font-semibold text-[#567C8D] transition hover:bg-[#567C8D] hover:text-white"
                        >
                          Edit Branch
                        </button>

                        <button
                          type="button"
                          onClick={() => setBranchToView(null)}
                          className="rounded-2xl bg-[#2F4156] px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#567C8D]"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {branchToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className={`w-full max-w-md rounded-3xl border p-6 shadow-xl ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#D9E4EC]"}`}>
                  <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#2F4156]"}`}>
                    {t("hotelMgmt.delete.title")}
                  </h3>

                  <p className={`mt-3 text-sm leading-6 ${darkMode ? "text-gray-400" : "text-[#567C8D]"}`}>
                    {t("hotelMgmt.delete.promptPrefix")}{" "}
                    <span className="font-semibold text-[#2F4156]">
                      {branchToDelete.name}
                    </span>
                    ?
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      {t("hotelMgmt.delete.confirm")}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      className="rounded-2xl border border-[#567C8D] px-5 py-3 text-sm font-semibold text-[#567C8D] transition hover:bg-[#567C8D] hover:text-white"
                    >
                      {t("hotelMgmt.delete.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default HotelManagement;