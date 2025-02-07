import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5555/bookingConfirmation/allbooking');
        setBookings(response.data);
      } catch (error) {
        setError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <div className="booking-card" key={booking._id}>
          {booking.attraction?.photos?.[0] && (
            <img
              className="booking-image"
              src={booking.attraction.photos[0]}
              alt={booking.attraction.name}
            />
          )}
          <div className="booking-content">
            <h5>Booking for {booking.name}</h5>
            <p>Starting Location: {booking.startingLocation}</p>
            <p>Attraction: {booking.attraction?.name || 'N/A'}</p>
            <p>Hotel: {booking.hotel?.name || 'N/A'}</p>
            <p>
              Check-In Date:{' '}
              {booking.checkInDate
                ? new Date(booking.checkInDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              Check-Out Date:{' '}
              {booking.checkOutDate
                ? new Date(booking.checkOutDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              Total Price: {booking.totalPrice ? `$${booking.totalPrice}` : 'N/A'}
            </p>
            {booking.sites && booking.sites.length > 0 && (
              <div className="booking-sites">
                <h6>Sites:</h6>
                <ul>
                  {booking.sites.map((site) => (
                    <li key={site._id}>
                      {site.name} - {site.address}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
