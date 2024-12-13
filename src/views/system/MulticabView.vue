<template>
  <div>


    <!-- Routes Container -->
    <div class="routes-container">
      <h1>ROUTES FOR MULTICAB</h1>
      <div class="routes-grids">
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

    <!-- Map Section -->
    <div v-if="selectedRoute" class="map-container">
       <!-- Set Destination Button -->
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

export default {
  data() {
    return {
      routes: [
      {
      id: "1",
      barangays: [
      { name: "Bangcasi - Dumalagan Crossing", lat: 8.9501, lng: 125.5302 },
      { name: "J.C Aquino Avenue", lat: 8.9603, lng: 125.5404 },
      { name: "A.D. Curato St. (BCES)", lat: 8.9705, lng: 125.5506 },
      { name: "Durano St.", lat: 8.9807, lng: 125.5608 },
      { name: "Balik J.C Aquino Ave. (Jollibee Centro)", lat: 8.9909, lng: 125.5700 },
      { name: "Balik Bancasi-Dumalagan Crossing", lat: 9.0001, lng: 125.5802 }
      ]
      },
      {
      id: "2",
      barangays: [
        { name: "Bangcasi - Dumalagan Crossing", lat: 8.9501, lng: 125.5302 },
        { name: "J.C Aquino Avenue", lat: 8.9603, lng: 125.5404 },
        { name: "North Montilla Blvd", lat: 8.9705, lng: 125.5506 },
        { name: "T. Calo St.", lat: 8.9807, lng: 125.5608 },
        { name: "Balik J.C Aquino Ave", lat: 9.0001, lng: 125.5802 },
        { name: "Balik Bancasi-Dumalagan Crossing", lat: 9.0001, lng: 125.5802 }
      ]
      },
      {
      id: "4",
      barangays: [
      { name: "Bangcasi - Dumalagan Crossing", lat: 8.9501, lng: 125.5302 },
      { name: "J.C Aquino Avenue", lat: 8.9603, lng: 125.5404 },
      { name: "A. D. Curato St. (BCPO)", lat: 8.9705, lng: 125.5506 },
      { name: "T. Sanchez St. (SSS)", lat: 8.9807, lng: 125.5608 },
      { name: "M. Calo St.", lat: 9.0001, lng: 125.5802 },
      { name: "G. Flores St.", lat: 9.0001, lng: 125.5802 },
      { name: "Rosales St. (SJIT)", lat: 9.0001, lng: 125.5802 },
      { name: "North Montilla Blvd. (Obrero Elem. School)", lat: 9.0001, lng: 125.5802 },
      { name: "Taboan", lat: 9.0001, lng: 125.5802 },
      { name: "Holy Redeemer", lat: 9.0001, lng: 125.5802 },
      { name: "City Hall", lat: 9.0001, lng: 125.5802 },
      { name: "Gaisano", lat: 9.0001, lng: 125.5802 },
      { name: "balik J. C. Aquino (DBP)", lat: 9.0001, lng: 125.5802 },
      { name: "balik Bancasi-Dumalagan Crossing", lat: 9.0001, lng: 125.5802 },
      ]
      },
      {
      id: "8",
      barangays: [
        { name: "Sto. Niño Brgy. Hall", lat: 8.95, lng: 125.53 }, 
        { name: "Los Angeles", lat: 8.96, lng: 125.54 }, 
        { name: "Sumilihon", lat: 8.97, lng: 125.55 }, 
        { name: "Taguibo", lat: 8.98, lng: 125.56 },
        { name: "Ampayon Rotonda", lat: 8.99, lng: 125.57 },
        { name: "Philippine Science High School", lat: 9.00, lng: 125.58 },
        { name: "Tiniwisan Crossing", lat: 9.01, lng: 125.59 },
        { name: "Baan Viaduct", lat: 9.02, lng: 125.60 },
        { name: "J.C. Aquino Ave.", lat: 9.03, lng: 125.61 },
        { name: "J. Rosales St. (DBP)", lat: 9.04, lng: 125.62 },
        { name: "City Hall", lat: 9.05, lng: 125.63 },
        { name: "J. Satorre St.", lat: 9.06, lng: 125.64 },
        { name: "Ochoa St. (Masagana)", lat: 9.07, lng: 125.65 },
        { name: "Salvador Calo St.", lat: 9.08, lng: 125.66 },
        { name: "Langihan Public Market", lat: 9.09, lng: 125.67 },
        { name: "Magsaysay St. (Puregold Langihan)", lat: 9.10, lng: 125.68 },
        { name: "Andaya St.", lat: 9.11, lng: 125.69 },
        { name: "North Montilla Blvd.", lat: 9.12, lng: 125.70 },
        { name: "J.C. Aquino Ave. (Mcdo Downtown)", lat: 9.13, lng: 125.71 },
        { name: "R. Calo St. (Dunkin Donut)", lat: 9.14, lng: 125.72 },
        { name: "T. Sanchez St. (ANHS)", lat: 9.15, lng: 125.73 },
        { name: "M. Calo St.", lat: 9.16, lng: 125.74 },
        { name: "Foot of Bridge", lat: 9.17, lng: 125.75 },
        { name: "Balik Baan Viaduct", lat: 9.18, lng: 125.76 },
        { name: "Baan Km. 3", lat: 9.19, lng: 125.77 },
        { name: "Tiniwisan Crossing", lat: 9.20, lng: 125.78 },
        { name: "Philippine Science High School", lat: 9.21, lng: 125.79 },
        { name: "Ampayon", lat: 9.22, lng: 125.80 },
        { name: "Taguibo", lat: 9.23, lng: 125.81 },
        { name: "Sumilihon", lat: 9.24, lng: 125.82 },
        { name: "Los Angeles", lat: 9.25, lng: 125.83 },
        { name: "Sto. Niño Brgy. Hall", lat: 9.26, lng: 125.84 }
]    },
{
      id: "12",
          barangays: [
      { name: "Amparo", lat: 9.27, lng: 125.85 },
      { name: "Bit-os", lat: 9.28, lng: 125.86 },
      { name: "Mandacpan Elem. School", lat: 9.29, lng: 125.87 },
      { name: "San Vicente", lat: 9.30, lng: 125.88 },
      { name: "Montilla Blvd.", lat: 9.31, lng: 125.89 },
      { name: "Holy Redeemer", lat: 9.32, lng: 125.90 },
      { name: "City Hall", lat: 9.33, lng: 125.91 },
      { name: "BCSAT", lat: 9.34, lng: 125.92 },
      { name: "Gaisano", lat: 9.35, lng: 125.93 },
      { name: "Montilla Blvd.", lat: 9.36, lng: 125.94 },
      { name: "San Vicente", lat: 9.37, lng: 125.95 },
      { name: "Mandacpan Elem. School", lat: 9.38, lng: 125.96 },
      { name: "Bit-os", lat: 9.39, lng: 125.97 },
      { name: "Amparo", lat: 9.40, lng: 125.98 }
    ]
      },

      {
      id: "13",
      barangays: [
        { name: "Banza National High School", lat: 8.95, lng: 125.53 },
        { name: "Brgy. Maug", lat: 8.96, lng: 125.54 },
        { name: "Brgy. Mahogany", lat: 8.97, lng: 125.55 },
        { name: "Baan Viaduct", lat: 8.98, lng: 125.56 },
        { name: "M. Calo St.", lat: 8.99, lng: 125.57 },
        { name: "G. Flores St.", lat: 9.00, lng: 125.58 },
        { name: "Rosales St. (SJIT)", lat: 9.01, lng: 125.59 },
        { name: "North Montilla Blvd.", lat: 9.02, lng: 125.60 },
        { name: "Obrero Elem. School", lat: 9.03, lng: 125.61 },
        { name: "Langihan Public Market", lat: 9.04, lng: 125.62 },
        { name: "City Hall", lat: 9.05, lng: 125.63 },
        { name: "J. Rosales St.", lat: 9.06, lng: 125.64 },
        { name: "J. C. Aquino Ave. (DBP)", lat: 9.07, lng: 125.65 },
        { name: "Baan Viaduct", lat: 9.08, lng: 125.66 },
        { name: "Brgy. Mahogany", lat: 9.09, lng: 125.67 },
        { name: "Brgy. Maug", lat: 9.10, lng: 125.68 },
        { name: "Brgy. Banza", lat: 9.11, lng: 125.69 }
      ]
      },

      {
      id: "10",
      barangays: [
      { name: "Bancasi-Dumalagan Crossing", lat: 8.95, lng: 125.53 },
      { name: "J.C. Aquino Ave.", lat: 8.96, lng: 125.54 },
      { name: "Baan Viaduct", lat: 8.97, lng: 125.55 },
      { name: "Baan Km. 3", lat: 8.98, lng: 125.56 },
      { name: "Tiniwisan Crossing", lat: 8.99, lng: 125.57 },
      { name: "Philippine Science High School", lat: 9.00, lng: 125.58 },
      { name: "Ampayon", lat: 9.01, lng: 125.59 },
      { name: "Vice Versa", lat: 9.02, lng: 125.60 }
    ]

      },

      {
      id: "7",
      barangays: [
        { name: "De Oro Brgy. Hall", lat: 8.95, lng: 125.53 },
        { name: "Taligaman Brgy. Hall", lat: 8.96, lng: 125.54 },
        { name: "Antongalon Elem. School", lat: 8.97, lng: 125.55 },
        { name: "LTFRB", lat: 8.98, lng: 125.56 },
        { name: "Ampayon Rotonda", lat: 8.99, lng: 125.57 },
        { name: "Caraga State University", lat: 9.00, lng: 125.58 },
        { name: "Philippine Science High School", lat: 9.01, lng: 125.59 },
        { name: "Tiniwisan Crossing", lat: 9.02, lng: 125.60 },
        { name: "Butuan Medical Center", lat: 9.03, lng: 125.61 },
        { name: "Filinvest (Hi-way)", lat: 9.04, lng: 125.62 },
        { name: "Baan Viaduct", lat: 9.05, lng: 125.63 },
        
        // Column 2
        { name: "M. Calo St.", lat: 9.06, lng: 125.64 },
        { name: "G. Flores St.", lat: 9.07, lng: 125.65 },
        { name: "North Montilla Blvd.", lat: 9.08, lng: 125.66 },
        { name: "Andaya St.", lat: 9.09, lng: 125.67 },
        { name: "Langihan Public Market", lat: 9.10, lng: 125.68 },
        { name: "City Hall", lat: 9.11, lng: 125.69 },
        { name: "J. C. Aquino Ave. (DBP)", lat: 9.12, lng: 125.70 },
        { name: "SM", lat: 9.13, lng: 125.71 },
        { name: "R. Calo St. (Dunkin)", lat: 9.14, lng: 125.72 },
        { name: "T. Sanchez St. (ANHS)", lat: 9.15, lng: 125.73 },
        { name: "M. Calo St.", lat: 9.16, lng: 125.74 },

        // Column 3
        { name: "Foot of Bridge", lat: 9.17, lng: 125.75 },
        { name: "Balik Baan Viaduct", lat: 9.18, lng: 125.76 },
        { name: "Baan Km. 3", lat: 9.19, lng: 125.77 },
        { name: "Philippine Science High School", lat: 9.20, lng: 125.78 },
        { name: "Tiniwisan Crossing", lat: 9.21, lng: 125.79 },
        { name: "Ampayon", lat: 9.22, lng: 125.80 },
        { name: "Antongalon", lat: 9.23, lng: 125.81 },
        { name: "Taligaman", lat: 9.24, lng: 125.82 },
        { name: "De Oro Brgy. Hall", lat: 9.25, lng: 125.83 }
      ]
      },

      {
      id: "14",
      barangays: [
        { name: "Ampayon", lat: 9.27, lng: 125.85 },
        { name: "Tiniwisan", lat: 9.28, lng: 125.86 },
        { name: "Alviola", lat: 9.29, lng: 125.87 },
        { name: "Era (Crossing)", lat: 9.30, lng: 125.88 },
        { name: "Lemon (Crossing)", lat: 9.31, lng: 125.89 },
        { name: "Pigdaulan (Crossing)", lat: 9.32, lng: 125.90 },
        { name: "Mahay (Crossing)", lat: 9.33, lng: 125.91 },
        { name: "San Vicente (Crossing)", lat: 9.34, lng: 125.92 },
        { name: "Montilla Boulevard", lat: 9.35, lng: 125.93 },
        { name: "SM", lat: 9.36, lng: 125.94 },
        { name: "Gaisano", lat: 9.37, lng: 125.95 },
        { name: "Robinsons", lat: 9.38, lng: 125.96 }
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
        this.calculateTravelTime();
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
  }
};
</script>

<style>

.routes-container {
  text-align: center;
  background-color: #000;
  color: #fff;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}

.routes-grids {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Force 3 columns */
  gap: 20px;
}

.route-card {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.route-card:hover {
  transform: scale(1.05);
  background-color: #00bfff;
  color: #000;
}

.route-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s;
}

.route-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00bfff;
  border-radius: 8px;
  margin-bottom: 10px;
  color: #000;
  font-size: 24px;
  transition: background-color 0.3s, color 0.3s;
}

.route-icon i {
  font-size: 24px;
}

.route-card:hover .route-icon {
  background-color: #000;
  color: #fff;
}

.route-card span {
  font-size: 18px;
}

/* Map Section */
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

#map {
  height: 60vh;
  width: 80%;   /* Adjust width to fit the screen */
  margin-bottom: 20px; /* Space between map and barangay list */
}

/* Barangay List */
.barangay-list {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  color: #fff;
  width: 80%; /* Match width of the map */
}

.barangay-list h3 {
  font-size: 18px;
  font-weight: bold;
}

.barangay-list ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns per row */
  gap: 10px;
}

.barangay-list li {
  font-size: 16px;
  background-color: #888787;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fffcfc;
}

.barangay-list li::before {
  content: "| "; /* Adds the pipe separator before each barangay name */
  margin-right: 10px;
  color: green; /* Change the color of the separator to green */
}

</style>