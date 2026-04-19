import React from 'react';
import { useUser } from '../Context/UserContext';
import { MapPin, Calendar, Users, Bed, Star, CheckCircle, XCircle, History } from 'lucide-react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

function HistoryCard({ booking }) {
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-card transition-all duration-300 overflow-hidden ${isCancelled ? 'border-red-100' : 'border-gray-100'}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-36 h-32 sm:h-auto relative overflow-hidden flex-shrink-0">
          <img
            src={booking.image}
            alt={booking.hotel}
            className={`w-full h-full object-cover ${isCancelled ? 'grayscale opacity-60' : ''}`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = isCancelled ? '#f3f4f6' : 'linear-gradient(135deg, #1565c0, #00838f)';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-bold text-sm leading-tight ${isCancelled ? 'text-gray-500' : 'text-brand-navy'}`}>
                {booking.hotel}
              </h3>
              <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {booking.location}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Bed className="w-3 h-3" /> {booking.room}
              </p>
            </div>
            <span className={isCancelled ? 'badge-cancelled' : 'badge-completed'}>
              {isCancelled ? 'Cancelled' : 'Completed'}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Users className="w-3 h-3" />
                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-right">
              {booking.rating && !isCancelled ? (
                <StarRating rating={booking.rating} />
              ) : null}
              <p className={`font-bold text-sm mt-0.5 ${isCancelled ? 'text-gray-400 line-through' : 'text-brand-navy'}`}>
                ${booking.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingHistory() {
 const { user } = useUser();
const bookings = user?.bookings || [];
  const pastBookings = (bookings || []).filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const completed = pastBookings.filter((b) => b.status === 'completed');
  const cancelled = pastBookings.filter((b) => b.status === 'cancelled');

  const totalSpent = completed.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-brand-navy/8 p-2 rounded-xl">
          <History className="w-4 h-4 text-brand-navy" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Booking History</h2>
          <p className="text-xs text-gray-500">{pastBookings.length} past booking{pastBookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Stats */}
      {pastBookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-brand-blue">{completed.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Completed</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-red-400">{cancelled.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Cancelled</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-brand-teal">${totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Spent</p>
          </div>
        </div>
      )}

      {/* List */}
      {pastBookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">No booking history</h3>
          <p className="text-gray-400 text-sm">Your completed trips will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pastBookings.map((booking) => (
            <HistoryCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
