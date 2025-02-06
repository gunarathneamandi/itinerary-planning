import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SitesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Fetching all routes from the backend
        const routeResponse = await axios.get('http://localhost:5555/routes');
        const routeData = routeResponse.data;

        // Now, fetch site details for each route
        const routeWithSiteDetails = await Promise.all(
          routeData.map(async (route) => {
            // Fetch site details based on siteIds in each route
            const siteDetails = await Promise.all(
              route.sites.map(async (siteId) => {
                const siteResponse = await axios.get(`http://localhost:5555/sites/${siteId}`);
                return siteResponse.data;
              })
            );
            return { ...route, siteDetails };
          })
        );

        setRoutes(routeWithSiteDetails);
        setLoading(false);
      } catch (err) {
        setError('Error fetching routes');
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return <div>Loading routes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Available Routes</h1>
      <ul>
        {routes.map((route) => (
          <li key={route._id}>
            <h2>
              {route.startLocation} to {route.finalDestination}
            </h2>
            <h3>Sites:</h3>
            <ul>
              {route.siteDetails.map((site) => (
                <li key={site._id}>
                  <strong>{site.name}</strong>
                  <p>{site.description}</p>
                  <p>{site.address}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SitesPage;
