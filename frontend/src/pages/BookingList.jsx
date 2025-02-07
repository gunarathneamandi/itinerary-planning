import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5555/bookingConfirmation');
        setBookings(response.data);
      } catch (error) {
        setError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking List</h2>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attraction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sites</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  {booking.attraction?.photos?.[0] ? (
                    <img
                      className="w-16 h-16 object-cover rounded-lg"
                      src={booking.attraction.photos[0]}
                      alt={booking.attraction.name}
                    />
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.startingLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.attraction?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.hotel?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {booking.sites?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {booking.sites.map((site) => (
                        <li key={site._id} className="text-xs">
                          {site.name} - {site.address}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && !error && (
        <div className="mt-6 text-center text-gray-500">
          No bookings found
        </div>
      )}
    </div>
  );
};

export default BookingList;