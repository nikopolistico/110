<template>
  <div>


    <!-- Routes Container -->
    <div class="routes-container">
      <h1>ROUTES FOR Tricycle</h1>
      <div class="routes-grid">
        <div
          v-for="(route, index) in routes"
          :key="index"
          class="route-card group"
        >
          <button @click="goToRouteDetails(route)" class="route-button">
            <div class="route-icon group-hover:bg-black">
              <i class="mdi mdi-jeepney group-hover:text-white"></i>
            </div>
            <span>Route {{ route.id }}</span>
          </button>
        </div>
      </div>
    </div>
     <!-- Set Destination Button -->
    <!-- Map Section -->
    <div v-if="selectedRoute" class="map-container">

      <button v-if="startPoint" @click="setDestination" class="set-destination-button">
        Set Destination
      </button>
      <h2>Route {{ selectedRoute.id }} Barangays</h2>
      <div id="map"></div>

      <!-- Barangay List -->
      <div class="barangay-list">
        <h3>Barangays in Route {{ selectedRoute.id }}:</h3>
        <ul>
          <li v-for="barangay in selectedRoute.barangays" :key="barangay.name">
            {{ barangay.name }}
          </li>
        </ul>
      </div>

      <!-- Estimated Travel Time -->
      <div v-if="estimatedTime">
        <p>Estimated Travel Time: {{ estimatedTime }} minutes</p>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

export default {
  data() {
    return {
      routes: [
      {
        id: "Green",
        barangays: [
        { name: "Holy Redeemer (Langihan)", lat: 8.9501, lng: 125.5302 },
        { name: "Obrero (Slaughterhouse)", lat: 8.9603, lng: 125.5404 },
        { name: "Doongan", lat: 8.9705, lng: 125.5506 },
        { name: "Ambago", lat: 8.9807, lng: 125.5608 },
        { name: "Babag", lat: 9.0001, lng: 125.5802 },
        { name: "Bading", lat: 9.0101, lng: 125.5902 },
        { name: "Agusan Pequeño", lat: 9.0201, lng: 125.6002 },
        { name: "Pagatpatan", lat: 9.0301, lng: 125.6102 },
        { name: "P. Rizal (St. Joseph Subd., Guingona Subd., and Sintos Subd.)", lat: 9.0401, lng: 125.6202 },
        { name: "Villa Kananga", lat: 9.0501, lng: 125.6302 },
        { name: "Imadejas", lat: 9.0601, lng: 125.6402 },
        { name: "Bayanihan (Luz Village, Pareja and DAR Subd.)", lat: 9.0701, lng: 125.6502 },
        { name: "Golden Ribbon", lat: 9.0801, lng: 125.6602 },
        { name: "Maon", lat: 9.0901, lng: 125.6702 },
        { name: "Pangabuggan", lat: 9.1001, lng: 125.6802 },
        { name: "San Vicente (Mandacpan)", lat: 9.1101, lng: 125.6902 },
        { name: "Bit-os", lat: 9.1201, lng: 125.7002 },
        { name: "Baan Riverside", lat: 9.1301, lng: 125.7102 },
        { name: "Mahogany", lat: 9.1401, lng: 125.7202 },
        { name: "Buhangin", lat: 9.1501, lng: 125.7302 },
        { name: "Baan Km.3 Proper", lat: 9.1601, lng: 125.7402 },
        { name: "IRA Homes", lat: 9.1701, lng: 125.7502 },
        { name: "Barangay Lemon Proper", lat: 9.1801, lng: 125.7602 },
        { name: "Barangay Tiniwisan", lat: 9.1901, lng: 125.7702 },
        { name: "Cabcabon", lat: 9.2001, lng: 125.7802 },
        { name: "Bobon", lat: 9.2101, lng: 125.7902 },
        { name: "Barangay Taligaman Proper", lat: 9.2201, lng: 125.8002 },
        { name: "Taligaman High School", lat: 9.2301, lng: 125.8102 },
        { name: "Barangay Basag", lat: 9.2401, lng: 125.8202 },
        { name: "Purok 5 Basag (Katangkonggan)", lat: 9.2501, lng: 125.8302 },
        { name: "Ampayon Public Market", lat: 9.2601, lng: 125.8402 },
        { name: "Ampayon Proper", lat: 9.2701, lng: 125.8502 },
        { name: "Liboon Subdivision", lat: 9.2801, lng: 125.8602 },
        { name: "Caraga State University", lat: 9.2901, lng: 125.8702 },
        { name: "Barangay Camayah", lat: 9.3001, lng: 125.8802 }
      ]
      },
      {
        id: "Red",
        barangays: [
        { name: "Holy Redeemer (Langihan)", lat: 8.9501, lng: 125.5302 },
        { name: "Obrero (Slaughterhouse)", lat: 8.9603, lng: 125.5404 },
        { name: "Doongan", lat: 8.9705, lng: 125.5506 },
        { name: "Ambago", lat: 8.9807, lng: 125.5608 },
        { name: "Babag", lat: 9.0001, lng: 125.5802 },
        { name: "Bading", lat: 9.0101, lng: 125.5902 },
        { name: "Agusan Pequeño", lat: 9.0201, lng: 125.6002 },
        { name: "Pagatpatan", lat: 9.0301, lng: 125.6102 }
      ]
        },
        {
        id: "yellow",
        barangays: [
        { name: "Holy Redeemer (Langihan)", lat: 8.9501, lng: 125.5302 },
        { name: "Obrero (Slaughterhouse)", lat: 8.9603, lng: 125.5404 },
        { name: "Doongan", lat: 8.9705, lng: 125.5506 },
        { name: "Ambago", lat: 8.9807, lng: 125.5608 },
        { name: "Babag", lat: 9.0001, lng: 125.5802 },
        { name: "Bading", lat: 9.0101, lng: 125.5902 },
        { name: "Agusan Pequeño", lat: 9.0201, lng: 125.6002 },
        { name: "Pagatpatan", lat: 9.0301, lng: 125.6102 },
        { name: "P. Rizal (St. Joseph Subd., Guingona Subd., and Sintos Subd.)", lat: 9.0401, lng: 125.6202 },
        { name: "Villa Kananga", lat: 9.0501, lng: 125.6302 },
        { name: "Imadejas", lat: 9.0601, lng: 125.6402 },
        { name: "Bayanihan (Luz Village, Pareja and DAR Subd.)", lat: 9.0701, lng: 125.6502 },
        { name: "Golden Ribbon", lat: 9.0801, lng: 125.6602 },
        { name: "Maon", lat: 9.0901, lng: 125.6702 },
        { name: "Pangabuggan", lat: 9.1001, lng: 125.6802 },
        { name: "San Vicente (Mandacpan)", lat: 9.1101, lng: 125.6902 },
        { name: "Bit-os", lat: 9.1201, lng: 125.7002 }
      ]
        },
        {
        id: "white",
        barangays: [
        { name: "Junction Highway to Paradise Village, Balanghai Shrine and Bliss", lat: 8.9501, lng: 125.5302 },
        { name: "Junction Highway (Km.6) to Malalag", lat: 8.9603, lng: 125.5404 },
        { name: "Junction Highway (Bancasi) to Pinamanculan and NIA", lat: 8.9705, lng: 125.5506 },
        { name: "Junction Highway to Chinese Cemetery and City Cemetery", lat: 8.9807, lng: 125.5608 },
        { name: "Junction Highway to Barangay Dumalagan Proper", lat: 9.0001, lng: 125.5802 }
      ]
        },
      ],
      selectedRoute: null,
      map: null,
      startPoint: null,
      endPoint: null,
      estimatedTime: null
    };
  },
  methods: {
  goToRouteDetails(route) {
    this.selectedRoute = route;
    this.$nextTick(() => {
      this.loadMap();
    });
  },
  loadMap() {
    if (!this.map) {
      this.map = L.map("map").setView(
        [this.selectedRoute.barangays[0].lat, this.selectedRoute.barangays[0].lng],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);
    } else {
      this.map.setView(
        [this.selectedRoute.barangays[0].lat, this.selectedRoute.barangays[0].lng],
        13
      );
    }

    // Clear any existing markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Add markers for each barangay in the selected route
    this.selectedRoute.barangays.forEach((barangay) => {
      L.marker([barangay.lat, barangay.lng])
        .addTo(this.map)
        .bindPopup(`${barangay.name}`)
        .on("click", () => this.setStartPoint(barangay));
    });
  },
  setStartPoint(barangay) {
    if (!this.startPoint) {
      // Set the start point if it hasn't been set
      this.startPoint = barangay;
      alert(`Start Point Set: ${barangay.name}`);
    }
  },
  calculateTravelTime() {
    if (this.startPoint && this.endPoint) {
      // Calculate the distance between start and end points in meters
      const startLatLng = L.latLng(this.startPoint.lat, this.startPoint.lng);
      const endLatLng = L.latLng(this.endPoint.lat, this.endPoint.lng);
      const distance = startLatLng.distanceTo(endLatLng); // Distance in meters

      // Define the average speed (e.g., 20 km/h)
      const averageSpeed = 20; // km/h
      const distanceInKm = distance / 1000; // Convert meters to kilometers
      const timeInHours = distanceInKm / averageSpeed; // Time in hours
      const timeInMinutes = timeInHours * 60; // Convert time to minutes

      // Update the estimated time
      this.estimatedTime = Math.round(timeInMinutes);
    }
  },
  setDestination() {
    // Allow the user to click a barangay to set as the destination
    this.map.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const destination = { lat, lng };

      // Set the destination and update the map
      this.endPoint = destination;
      this.displayRoute();
      this.calculateTravelTime();  // Automatically calculate the travel time when destination is set
    });
  },
  displayRoute() {
    if (this.startPoint && this.endPoint) {
      // Use Leaflet Routing Machine to draw the route
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(this.startPoint.lat, this.startPoint.lng),
          L.latLng(this.endPoint.lat, this.endPoint.lng),
        ],
      }).addTo(this.map);
    }
  }
},
};
</script>

<style>
@import "leaflet-routing-machine/dist/leaflet-routing-machine.css";



.routes-container {
  text-align: center;
  padding: 20px;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 1 row, 2 columns */
  gap: 20px;
}

.route-card {
  background-color: rgba(26, 26, 26, 0.7);
  padding: 20px;
  border-radius: 10px;
}

.route-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 1.2rem;
}

.route-icon {
  margin-right: 8px;
}

.group:hover .route-icon {
  background-color: black;
  color: white;
}

.set-destination-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.set-destination-button:hover {
  background-color: #45a049;
}

#map {
  height: 60vh;
  width: 80%;
  margin: 20px auto;
}

.barangay-list {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 10px;
}

.barangay-list h3 {
  margin-bottom: 10px;
}

.barangay-list ul {
  list-style-type: none;
  padding: 0;
}

.barangay-list li {
  margin-bottom: 5px;
}
</style>
