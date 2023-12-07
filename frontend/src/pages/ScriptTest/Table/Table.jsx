import React, { useState, useEffect } from 'react';

const ServiceAvailability = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch service availability data from your API
    fetch('https://sijeanbeautysalon.up.railway.app/services-with-products')
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error('Error fetching service availability:', error));
  }, []);

  return (
    <div>
      <h1>Service Availability</h1>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id_service}>
              <td>{service.name_service}</td>
              <td>{service.availability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceAvailability;