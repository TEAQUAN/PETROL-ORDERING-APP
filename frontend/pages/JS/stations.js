function initMap() {
    const stationListDiv = document.getElementById('stationList');
    const mapDiv = document.getElementById('map');
    let map;
  
    fetchStations();
  
    async function fetchStations() {
      try {
        const response = await fetch('http://localhost:3000/GetStations/allStations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjM4Y2Q0NzQxNzViOWIzMjJhZWI1YzAiLCJpYXQiOjE3MTUwNzg4NjksImV4cCI6MTcxNTA4MjQ2OX0.4wZD0gYDz1Kfs-eeO6w48A42cfX1RWiURZwDbYhqau4`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        console.log('Fetched stations:', data); // Log the response data
        displayStations(data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    }
  
    function displayStations(stations) {
      // Create a map
      map = new google.maps.Map(mapDiv, {
        center: { lat: 40.712776, lng: -74.005974 }, // Default location (New York)
        zoom: 12, // Zoom level
      });
  
      // Create markers for each petrol station
      stations.forEach(station => {
        const marker = new google.maps.Marker({
          position: { lat: station.latitude, lng: station.longitude },
          map: map,
          title: station.name,
        });
  
        // Add click event listener to the marker
        marker.addListener("click", () => {
          showStreetView(station);
        });
  
        // Display station in the list
        const stationDiv = createStationElement(station);
        stationListDiv.appendChild(stationDiv);
      });
    }
  
    function createStationElement(station) {
      const stationDiv = document.createElement('div');
      stationDiv.classList.add('station');
  
      stationDiv.innerHTML = `
        <h3>${station.name}</h3>
        <p>Address: ${station.address}</p>
        <p>Ratings: ${station.ratings}</p>
      `;
  
      // Add click event listener to stationDiv
      stationDiv.addEventListener('click', () => {
        showStreetView(station);
      });
  
      return stationDiv;
    }
  
    function showStreetView(station) {
      const panorama = new google.maps.StreetViewPanorama(mapDiv, {
        position: { lat: station.latitude, lng: station.longitude },
        pov: {
          heading: 0,
          pitch: 0
        },
        zoom: 1
      });
  
      map.setStreetView(panorama);
    }
  }
  