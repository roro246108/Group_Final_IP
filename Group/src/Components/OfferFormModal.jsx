import { useState } from "react";
import hotels from "../data/hotels";

function OfferFormModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "Bundle",
    badge: "Most Popular",
    discount: "",
    originalPrice: "",
    expiryDate: "",
    hotelId: "",
    description: "",
  });

  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if all fields are filled
  const isFormValid =
    formData.title.trim() !== "" &&
    formData.discount !== "" &&
    Number(formData.discount) >= 1 &&
    Number(formData.discount) <= 99 &&
    formData.originalPrice !== "" &&
    Number(formData.originalPrice) >= 1 &&
    formData.expiryDate !== "" &&
    isActive;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Offer title is required";
    if (!formData.discount) newErrors.discount = "Discount is required";
    else if (Number(formData.discount) < 1 || Number(formData.discount) > 99)
      newErrors.discount = "Discount must be between 1% and 99%";
    if (!formData.originalPrice) newErrors.originalPrice = "Original price is required";
    else if (Number(formData.originalPrice) < 1)
      newErrors.originalPrice = "Price must be greater than 0";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (new Date(formData.expiryDate) <= new Date())
      newErrors.expiryDate = "Expiry date must be in the future";
    if (!isActive) newErrors.active = "Please confirm by ticking the checkbox";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...formData,
      id: Date.now(),
      active: true,
      pricePerNight: Math.round(formData.originalPrice * (1 - formData.discount / 100)),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#b8d2e7]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-[#1565a8] text-2xl font-bold">+</div>
          <h2 className="text-[#1565a8] text-xl font-bold">Add New Offer</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-[#1565a8] text-sm font-semibold mb-2">Offer Title</label>
            <input
              className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565a8]/20 placeholder:text-slate-300"
              placeholder="e.g. Royal Suite Escape"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#1565a8] text-sm font-semibold mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="e.g. Book 2 nights and enjoy a complimentary breakfast with sea view..."
              value={formData.description}
              className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565a8]/20 placeholder:text-slate-300 resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Type + Badge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1565a8] text-sm font-semibold mb-2">Offer Type</label>
              <select
                className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Bundle</option>
                <option>Discount</option>
                <option>Package</option>
                <option>Seasonal</option>
              </select>
            </div>
            <div>
              <label className="block text-[#1565a8] text-sm font-semibold mb-2">Badge</label>
              <select
                className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              >
                <option>Most Popular</option>
                <option>Limited Rooms</option>
                <option>Romantic</option>
                <option>Weekday Deal</option>
                <option>Summer Special</option>
                <option>Family</option>
              </select>
            </div>
          </div>

          {/* Hotel Room Selector */}
          <div>
            <label className="block text-[#1565a8] text-sm font-semibold mb-2">Hotel Room</label>
            <select
              className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none"
              value={formData.hotelId}
              onChange={(e) => {
                const selectedRoom = hotels.find((h) => h.id === Number(e.target.value));
                setFormData({
                  ...formData,
                  hotelId: Number(e.target.value),
                  // Auto-fill title and price from hotel room
                  title: selectedRoom ? selectedRoom.roomName : formData.title,
                  originalPrice: selectedRoom ? selectedRoom.price : formData.originalPrice,
                });
              }}
            >
              <option value="">— Select a room —</option>
              {hotels.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.branch} · {room.roomName} (${room.price}/night)
                </option>
              ))}
            </select>
          </div>

          {/* Discount + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1565a8] text-sm font-semibold mb-2">Discount (%)</label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={formData.discount}
                className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-slate-300"
                onChange={(e) => {
                  setFormData({ ...formData, discount: e.target.value });
                  setErrors({ ...errors, discount: "" });
                }}
              />
              {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
            </div>
            <div>
              <label className="block text-[#1565a8] text-sm font-semibold mb-2">Original Price ($)</label>
              <input
                type="number"
                placeholder="e.g. 799"
                value={formData.originalPrice}
                className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-slate-300"
                onChange={(e) => {
                  setFormData({ ...formData, originalPrice: e.target.value });
                  setErrors({ ...errors, originalPrice: "" });
                }}
              />
              {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-[#1565a8] text-sm font-semibold mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              className="w-full bg-[#f5f9fc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none"
              onChange={(e) => {
                setFormData({ ...formData, expiryDate: e.target.value });
                setErrors({ ...errors, expiryDate: "" });
              }}
            />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>

          {/* Animated Checkbox */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="activeCheckbox"
              className="relative h-[3em] w-[3em] rounded-[1.2em] bg-[#b3fffa] shadow-[inset_-1px_1px_4px_0px_#f0fffe,inset_1px_-1px_4px_0px_#00bdb0,-1px_2px_4px_0px_#00bdb0] cursor-pointer flex-shrink-0"
            >
              <input
                type="checkbox"
                id="activeCheckbox"
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                  setErrors({ ...errors, active: "" });
                }}
                className="peer appearance-none"
              />
              <span className="absolute left-1/2 top-1/2 h-[2em] w-[2em] -translate-x-1/2 -translate-y-1/2 rounded-[0.8em] bg-[#ccfffc] shadow-[inset_-1px_1px_4px_0px_#f0fffe,inset_1px_-1px_4px_0px_#00bdb0,-1px_1px_2px_0px_#00bdb0] duration-[200ms] peer-checked:shadow-[inset_1px_-1px_4px_0px_#f0fffe,inset_-1px_1px_4px_0px_#00bdb0]" />
              <svg fill="#00756d" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                className="absolute left-1/2 top-1/2 h-[2em] w-[2em] -translate-x-1/2 -translate-y-1/2 peer-checked:opacity-0 transition-opacity">
                <path d="M697.4 759.2l61.8-61.8L573.8 512l185.4-185.4-61.8-61.8L512 450.2 326.6 264.8l-61.8 61.8L450.2 512 264.8 697.4l61.8 61.8L512 573.8z" />
              </svg>
              <svg fill="#00756d" viewBox="-3.2 -3.2 38.40 38.40" xmlns="http://www.w3.org/2000/svg"
                className="absolute left-1/2 top-1/2 h-[2em] w-[2em] -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity">
                <path d="M5 16.577l2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z" />
              </svg>
            </label>

            <div>
              <p className="text-[#1565a8] text-sm font-semibold">Confirm & Set as Active</p>
              <p className="text-[#5b9bd5] text-xs mt-0.5">
                {isActive
                  ? "✅ Ready to submit — offer will be visible to users"
                  : "❌ Tick to confirm and enable the Add Offer button"}
              </p>
              {errors.active && <p className="text-red-500 text-xs mt-1">{errors.active}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-red-400 rounded-md group"
            >
              <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-500 rounded group-hover:-mr-4 group-hover:-mt-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-500 rounded group-hover:-ml-4 group-hover:-mb-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-red-300 rounded-md group-hover:translate-x-0" />
              <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">Cancel</span>
            </button>

            {/* Add Offer — disabled until all fields filled AND checkbox ticked */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-8 py-2.5 bg-[#1565a8] text-white rounded-lg text-sm font-bold hover:bg-[#1e40af] transition-colors shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add Offer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default OfferFormModal;
