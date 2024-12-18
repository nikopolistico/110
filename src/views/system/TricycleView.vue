<template>
  <!-- Routes Container -->
  <div class="video-container">
    <video autoplay muted loop class="background-video">
      <source src="/public/images/background.mp4" type="video/mp4" />
    </video>
  </div>

  <div class="routes-container">
    <h1>ROUTES FOR Tricycle</h1>
    <div class="routes-grid">
      <div v-for="(route, index) in routes" :key="index" class="route-card group">
        <button @click="openRouteModal(route)" class="route-button">
          <div class="route-icon group-hover:bg-black">
            <i class="mdi mdi-jeepney group-hover:text-white"></i>
          </div>
          <span>Route {{ route.id }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal for Route Details -->
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>{{ selectedRoute.id }} Route Details</h2>
      <button class="close-btn" @click="closeModal">Close</button>

      <!-- Starting and Destination Barangays -->
      <div class="barangay-selection">
        <label for="start">Starting Barangay:</label>
        <select v-model="startPoint" @change="updateRoute">
          <option disabled value="">Select starting barangay</option>
          <option v-for="barangay in selectedRoute.barangays" :key="barangay.name" :value="barangay.name">
            {{ barangay.name }}
          </option>
        </select>

        <label for="destination">Destination Barangay:</label>
        <select v-model="endPoint" @change="updateRoute">
          <option disabled value="">Select destination barangay</option>
          <option v-for="barangay in filteredBarangays" :key="barangay.name" :value="barangay.name">
            {{ barangay.name }}
          </option>
        </select>
      </div>

      <!-- Estimated Travel Time -->
      <div v-if="estimatedTime">
        <p>Estimated Travel Time: {{ estimatedTime }} minutes</p>
      </div>

      <!-- Movement Icon -->
      <div v-if="startPoint && endPoint" class="movement-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        <span>{{ startPoint }} → {{ endPoint }}</span>
      </div>

      <!-- Leaflet Map -->
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import axios from 'axios'; // Import Axios

import { supabase } from '../../supabaseClient'

export default {
  data() {
    return {
      routes: [
        {
          id: "Red",
          barangays: [
            { name: "Holy Redeemer" },
            { name: "Obrero" },
            { name: "Doongan" },
            { name: "Ambago" },
            { name: "Babag" },
            { name: "Bading" },
            { name: "Agusan Pequeño" },
            { name: "Pagatpatan" },
          ],
          city: "Butuan City",  // Add the city
        },
        {
          id: "White",
          barangays: [
            { name: "Paradise Libertad" },
            { name: "Paradise Village" },
            { name: "Balangay Shrine" },
            { name: "Bliss" },
            { name: "Libertad" },
            { name: "Bancasi" },
            { name: "Pinamanculan" },
            { name: "NIA" },
            { name: "Chinese Cemetery" },
            { name: "Dumalagan" },
          ],
          city: "Butuan City",
        },
        {
          id: "yellow",
          barangays: [
            { name: "Holy Redeemer" },
            { name: "Obrero" },
            { name: "Doongan" },
            { name: "Ambago" },
            { name: "Babag" },
            { name: "Bading" },
            { name: "Agusan Pequeño" },
            { name: "Pagatpatan" },
            { name: "P. Rizal" },
            { name: "Villa Kananga" },
            { name: "Imadejas" },
            { name: "Bayanihan" },
            { name: "Golden Ribbon" },
            { name: "Maon" },
            { name: "Pangabuggan" },
            { name: "San Vicente" },
            { name: "Bit-os" }
          ],
          city: "Butuan City",
        },
        {
          id: "Green",
          barangays: [
            { name: "Holy Redeemer (Langihan)" },
            { name: "Obrero (Slaughterhouse)" },
            { name: "Doongan" },
            { name: "Ambago" },
            { name: "Babag" },
            { name: "Bading" },
            { name: "Agusan Pequeño" },
            { name: "Pagatpatan" },
            { name: "P. Rizal (St. Joseph Subd., Guingona Subd., and Sintos Subd.)" },
            { name: "Villa Kananga" },
            { name: "Imadejas" },
            { name: "Bayanihan (Luz Village, Pareja and DAR Subd.)" },
            { name: "Golden Ribbon" },
            { name: "Maon" },
            { name: "Pangabuggan" },
            { name: "San Vicente (Mandacpan)" },
            { name: "Bit-os" },
            { name: "Baan Riverside" },
            { name: "Mahogany" },
            { name: "Buhangin" },
            { name: "Baan Km.3 Proper" },
            { name: "IRA Homes" },
            { name: "Barangay Lemon Proper" },
            { name: "Barangay Tiniwisan" },
            { name: "Cabcabon" },
            { name: "Bobon" },
            { name: "Barangay Taligaman Proper" },
            { name: "Taligaman High School" },
            { name: "Barangay Basag" },
            { name: "Purok 5 Basag (Katangkonggan)" },
            { name: "Ampayon Public Market" },
            { name: "Ampayon Proper" },
            { name: "Liboon Subdivision" },
            { name: "Caraga State University" },
            { name: "Barangay Camayah" }
          ],
          city: "Butuan City",
        }
      ],
      selectedRoute: null,
      isModalOpen: false,
      startPoint: null,
      endPoint: null,
      estimatedTime: null,
      map: null,
      movingIcon: null,
      polyline: null,
      markers: [],  // St
    };
  },
  computed: {
    filteredBarangays() {
      if (!this.startPoint) {
        return this.selectedRoute?.barangays || [];
      }
      return this.selectedRoute.barangays.filter(
        (barangay) => barangay.name !== this.startPoint
      );
    },
    estimatedTravelTime() {
      return this.startPoint && this.endPoint ? 15 : 0; // Mock estimated time in minutes
    },
  },
  methods: {
    openRouteModal(route) {
      this.selectedRoute = route;
      this.isModalOpen = true;
      this.startPoint = null;
      this.endPoint = null;
      this.estimatedTime = null;


      this.clearRoute();


      this.$nextTick(() => {
        this.initMap();
      });
    },
    closeModal() {
      this.isModalOpen = false;
      this.clearRoute(); // Clear route on modal close

      if (this.map) {
        this.map.off();
        this.map.remove();
        this.map = null;
      }
    },
    initMap() {
      let lat = 8.9501; // Default coordinates
      let lng = 125.5302;

      this.map = L.map("map").setView([lat, lng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      if (this.startPoint && this.endPoint) {
        this.updateRoute();
      }
    },
    async updateRoute() {
      if (this.startPoint && this.endPoint && this.startPoint === this.endPoint) {
        alert("Start point and End point cannot be the same!");
        this.endPoint = null;
        return;
      }

      this.clearRoute(); // Clear any previous route
      this.estimatedTime = this.estimatedTravelTime; // Mock estimated time
      this.routeDisplay(); // Display new route
    },

    async routeDisplay() {
      if (this.startPoint && this.endPoint) {
        const startCoords = await this.getCoordinates(this.startPoint);
        const endCoords = await this.getCoordinates(this.endPoint);

        this.clearRoute(); // Ensure previous markers and polyline are cleared

        this.map.setView([startCoords.lat, startCoords.lng], 12);

        this.addMarkers(startCoords, endCoords);
        this.saveRouteData();
      }
    },

    async getCoordinates(location) {
      try {
        const address = `${location} ${this.selectedRoute.city}, Philippines`;

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: address,
            format: 'json',
            addressdetails: 1,
            countrycode: 'PH',
          },
        });

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { lat: parseFloat(lat), lng: parseFloat(lon) };
        } else {
          console.error("Location not found: " + address);
          return { lat: 8.9501, lng: 125.5302 }; // Default to center of Butuan City if not found
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return { lat: 8.9501, lng: 125.5302 }; // Default location on error
      }
    },

    addMarkers(startCoords, endCoords) {
      // If we have an existing marker or polyline, remove it first
      this.clearRoute();

      // Add markers for start and end points
      this.startMarker = L.marker([startCoords.lat, startCoords.lng]).addTo(this.map);
      this.startMarker.bindPopup(`<b>${this.startPoint}</b>`).openPopup();

      this.endMarker = L.marker([endCoords.lat, endCoords.lng]).addTo(this.map);
      this.endMarker.bindPopup(`<b>${this.endPoint}</b>`).openPopup();

      // Add polyline connecting start and end points
      this.polyline = L.polyline([startCoords, endCoords], { color: 'blue' }).addTo(this.map);

      // Add the moving icon for the route
      this.moveIcon(startCoords, endCoords);
    },

    moveIcon(startCoords, endCoords) {
      const icon = L.icon({
        iconUrl: '/icon/tricycle.png', // Path to your icon
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      this.movingIcon = L.marker([startCoords.lat, startCoords.lng], { icon }).addTo(this.map);

      const latLngs = [startCoords, endCoords];
      let startTime = null;
      const duration = 5000; // Total time for the animation (in milliseconds)

      // Function to ease the transition of the icon's movement
      const ease = (t) => {
        return t * t * (3 - 2 * t); // A common easing function (easeInOutQuad)
      };

      const move = (timestamp) => {
        if (!startTime) startTime = timestamp; // Capture the start time
        const elapsedTime = timestamp - startTime; // Time elapsed since the animation started
        const progress = Math.min(elapsedTime / duration, 1); // Progress between 0 and 1

        // Apply easing function to slow down the movement as the icon approaches the destination
        const easedProgress = ease(progress);

        const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * easedProgress;
        const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * easedProgress;

        this.movingIcon.setLatLng([lat, lng]);

        if (progress < 1) {
          requestAnimationFrame(move); // Continue the animation
        } else {
          // Once the destination is reached, stop the movement
          this.movingIcon.setLatLng([endCoords.lat, endCoords.lng]);
        }
      };

      // Start the animation
      requestAnimationFrame(move);
    },
    clearRoute() {
      // Remove all existing markers, polylines, and icons
      this.markers.forEach((marker) => this.map.removeLayer(marker));
      if (this.polyline) {
        this.map.removeLayer(this.polyline);
      }
      if (this.movingIcon) {
        this.movingIcon.stop();
      }

      // Clear markers array
      this.markers = [];
    },
     async saveRouteData() {
      try {
        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error retrieving user:", userError.message);
          return;
        }

        if (!user || !user.id) {
          console.error("User ID is missing, cannot save route data.");
          return;
        }

        const userId = user.id; // Use the authenticated user's ID (UUID)


        if (!this.startPoint || !this.startPoint) {
          console.error("Start point is not set or missing the name property.");
          return;
        }

        if (!this.endPoint || !this.endPoint) {
          console.error("End point is not set or missing the name property.");
          return;
        }
        // If we have user info, insert the data into the `routes` table
        const { data, error } = await supabase
          .from("routes")
          .insert([
            {
              user_id: userInfo.id, // Use the user_id from `users_info` table
              start_location: this.startPoint,
              end_location: this.endPoint,
            },
          ]);

        if (error) {
          console.error("Error saving route data:", error.message);
        } else {
          console.log("Route data saved:", data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  }
};
</script>

<style scoped>
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  /* Ensure the video stays in the background */
}

/* Video Container */
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.custom-moving-icon {
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
}

.size-6 {
  width: 24px;
  height: 24px;
  stroke: #000;
  /* Black color */
}


.moving-icon i {
  font-size: 24px;
  color: red;
  /* Change the color of the icon */
}

.routes-container {
  position: relative;
  /* Position the content above the video */
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  /* Semi-transparent background for readability */
  color: #fff;
  padding: 20px;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* Force 2 columns */
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

#map {
  height: 60vh;
  width: 80%;
  margin: 20px auto;
}

.barangay-selection {
  padding: 5px;
  background-color: rgba(254, 254, 254, 0.93);
  color: rgb(17, 17, 17);
  border-radius: 8px;
  margin: 10px auto;
  width: 50%;
  border-color: black;
}

.barangay-selection label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  font-size: 14px;
  color: rgb(17, 17, 17);
}

.barangay-selection select {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 2px solid black;
  /* Set the border color to black */
  background-color: white;
  color: black;
  font-size: 14px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  /* Ensure full width */
  max-width: 800px;
  /* Prevent modal from becoming too wide */
  box-sizing: border-box;
  /* Include padding in width */
  height: 100%;
  /* Set the height to 80% of the viewport */
  max-height: 90vh;
  /* Prevent the modal from exceeding the viewport height */
  overflow-y: auto;
  /* Add scroll if content exceeds height */
}

@media (max-width: 768px) {
  .modal-content {
    height: 90%;
    /* Adjust for smaller screens */
  }
}


.movement-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.movement-icon i {
  font-size: 24px;
  color: green;
  margin-right: 10px;
}


.close-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .modal-content {
    height: 90%;
    /* Adjust for smaller screens */
  }
}


.movement-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.movement-icon i {
  font-size: 24px;
  color: green;
  margin-right: 10px;
}


.close-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>