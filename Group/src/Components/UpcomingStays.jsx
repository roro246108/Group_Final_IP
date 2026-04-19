import React, { useState } from 'react';
import { useUser } from '../Context/UserContext';
import { MapPin, Calendar, Users, Bed, XCircle, AlertTriangle, X } from 'lucide-react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function CancelModal({ booking, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="bg-red-50 p-2.5 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg">Cancel Booking?</h3>
            <p className="text-gray-500 text-sm mt-1">
              Are you sure you want to cancel your booking at{' '}
              <span className="font-semibold text-gray-700">{booking.hotel}</span>?
              This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-xl p-3 mt-3 text-sm text-gray-600">
              <p><span className="font-medium">Check-in:</span> {formatDate(booking.checkIn)}</p>
              <p><span className="font-medium">Confirmation:</span> {booking.confirmationCode}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Keep Booking</button>
          <button
            onClick={() => { onConfirm(booking.id); onClose(); }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel }) {
  const [showModal, setShowModal] = useState(false);
  const daysUntil = Math.ceil((new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden flex-shrink-0">
            <img
              src={booking.image}
              alt={booking.hotel}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.style.background = 'linear-gradient(135deg, #1565c0, #00838f)';
              }}
            />
            <div className="absolute top-3 left-3">
              <span className="bg-sky-100 text-sky-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {daysUntil <= 7 ? `${daysUntil}d away` : `${Math.ceil(daysUntil / 7)}w away`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-base leading-tight">{booking.hotel}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {booking.location}
                  </p>
                </div>
                <span className="bg-teal-50 text-teal-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap border border-teal-100">Upcoming</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="bg-blue-50 p-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">Check-in</p>
                    <p className="font-medium text-gray-700 text-xs">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="bg-teal-50 p-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">Check-out</p>
                    <p className="font-medium text-gray-700 text-xs">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="bg-sky-50 p-1.5 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">Guests</p>
                    <p className="font-medium text-gray-700 text-xs">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Bed className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{booking.room} · {booking.nights} nights</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Price</p>
                <p className="font-bold text-slate-800 text-lg">${booking.totalPrice.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{booking.confirmationCode}</span>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-100"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CancelModal
          booking={booking}
          onConfirm={onCancel}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default function UpcomingStays() {
  // 1. We extract 'user' as well as the cancel function
  const { user, cancelBooking } = useUser();
  
  // 2. Safely filter the bookings
  const upcomingBookings = (user?.bookings || []).filter(b => b.status === 'upcoming');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-teal-50 p-2 rounded-xl border border-teal-100">
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Upcoming Stays</h2>
            <p className="text-xs text-gray-500">{upcomingBookings.length} booking{upcomingBookings.length !== 1 ? 's' : ''} scheduled</p>
          </div>
        </div>
      </div>

      {upcomingBookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">No upcoming stays</h3>
          <p className="text-gray-400 text-sm">Book your next adventure and it'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={cancelBooking} />
          ))}
        </div>
      )}
    </div>
  );
}