import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Grid,
  List,
  ListItem,
  Divider,
} from '@mui/material';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5555/bookingConfirmation/allbooking');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <Grid container spacing={3}>
      {bookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking._id}>
          <Card>
            <CardActionArea>
              {booking.attraction?.photos?.[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={booking.attraction.photos[0]}
                  alt={booking.attraction.name}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="div">
                  Booking for {booking.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Starting Location: {booking.startingLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attraction: {booking.attraction?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hotel: {booking.hotel?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-In Date:{' '}
                  {booking.checkInDate
                    ? new Date(booking.checkInDate).toLocaleDateString()
                    : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-Out Date:{' '}
                  {booking.checkOutDate
                    ? new Date(booking.checkOutDate).toLocaleDateString()
                    : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Price: {booking.totalPrice ? `$${booking.totalPrice}` : 'N/A'}
                </Typography>
                {booking.sites && booking.sites.length > 0 && (
                  <>
                    <Divider sx={{ marginY: 1 }} />
                    <Typography variant="h6" component="div">
                      Sites:
                    </Typography>
                    <List>
                      {booking.sites.map((site) => (
                        <ListItem key={site._id}>
                          {site.name} - {site.address}
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookingList;
