document.addEventListener("DOMContentLoaded", () => {
  const fetchStationsButton = document.getElementById('fetchStationsButton');
  const notification = document.getElementById('notification');

  fetchStationsButton.addEventListener('click', async () => {
    try {
      const { coords } = await getCurrentPosition(); // Get user's current position

      const latitude = coords.latitude;
      const longitude = coords.longitude;
      console.log(latitude, longitude);
      const radius = 40000; // Default radius (in meters)

      // Show notification
      notification.textContent = 'Fetching petrol stations...';
      notification.classList.add('show');

      // Send request to backend API to populate the database
      const apiUrl = `http://localhost:3000/GetStations/fetch?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Error fetching stations from API');
      }

      // Display Image of Location
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=400x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=AIzaSyBB5PKwLpSTwkzJhxwdxfv885mAQ3BZYfI`;
      console.log('Stations fetched and database updated');
      console.log('Map Image URL:', mapUrl);

      // After successful fetch, hide notification
      notification.textContent = 'Petrol stations fetched successfully.';
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);

    } catch (error) {
      console.error('Error:', error.message);
      notification.textContent = 'Error fetching petrol stations.';
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  });

  // Function to get user's current position
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
});
