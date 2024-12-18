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
import { supabase } from '../../supabaseClient'
import axios from 'axios';

export default {
  data() {
    return {
      routes: [
        {
          id: "1",
          barangays: [
            { name: "Bangcasi - Dumalagan Crossing"},
            { name: "J.C Aquino Avenue"},
            { name: "A.D. Curato St. (BCES)"},
            { name: "Durano St."},
            { name: "Balik J.C Aquino Ave. (Jollibee Centro)"},
            { name: "Balik Bancasi-Dumalagan Crossing"}
          ],
          city: "Butuan City",
        },
        {
          id: "2",
          barangays: [
            { name: "Bangcasi - Dumalagan Crossing"},
            { name: "J.C Aquino Avenue"},
            { name: "North Montilla Blvd"},
            { name: "T. Calo St." },
            { name: "Balik J.C Aquino Ave" },
            { name: "Balik Bancasi-Dumalagan Crossing"}
          ],
          city: "Butuan City",
        },
        {
          id: "4",
          barangays: [
            { name: "Bangcasi - Dumalagan Crossing"},
            { name: "J.C Aquino Avenue"},
            { name: "A. D. Curato St. (BCPO)"},
            { name: "T. Sanchez St. (SSS)"},
            { name: "M. Calo St." },
            { name: "G. Flores St." },
            { name: "Rosales St. (SJIT)" },
            { name: "North Montilla Blvd. (Obrero Elem. School)"},
            { name: "Taboan" },
            { name: "Holy Redeemer"},
            { name: "City Hall" },
            { name: "Gaisano" },
            { name: "balik J. C. Aquino (DBP)" },
            { name: "balik Bancasi-Dumalagan Crossing"},
          ],
          city: "Butuan City",
        },
        {
          id: "8",
          barangays: [
            { name: "Sto. Niño Brgy. Hall"},
            { name: "Los Angeles" },
            { name: "Sumilihon"},
            { name: "Taguibo"},
            { name: "Ampayon Rotonda" },
            { name: "Philippine Science High School"},
            { name: "Tiniwisan Crossing" },
            { name: "Baan Viaduct"},
            { name: "J.C. Aquino Ave."},
            { name: "J. Rosales St. (DBP)" },
            { name: "City Hall"},
            { name: "J. Satorre St."},
            { name: "Ochoa St. (Masagana)"},
            { name: "Salvador Calo St."},
            { name: "Langihan Public Market"},
            { name: "Magsaysay St. (Puregold Langihan)"},
            { name: "Andaya St."},
            { name: "North Montilla Blvd."},
            { name: "J.C. Aquino Ave. (Mcdo Downtown)" },
            { name: "R. Calo St. (Dunkin Donut)"},
            { name: "T. Sanchez St. (ANHS)"},
            { name: "M. Calo St."},
            { name: "Foot of Bridge"},
            { name: "Balik Baan Viaduct"},
            { name: "Baan Km. 3"},
            { name: "Tiniwisan Crossing"},
            { name: "Philippine Science High School"},
            { name: "Ampayon"},
            { name: "Taguibo" },
            { name: "Sumilihon"},
            { name: "Los Angeles" },
            { name: "Sto. Niño Brgy. Hall" }
          ],
          city: "Butuan City",
        },
        {
          id: "12",
          barangays: [
            { name: "Amparo" },
            { name: "Bit-os" },
            { name: "Mandacpan Elem. School"},
            { name: "San Vicente" },
            { name: "Montilla Blvd." },
            { name: "Holy Redeemer"},
            { name: "City Hall" },
            { name: "BCSAT" },
            { name: "Gaisano" },
            { name: "Montilla Blvd."},
            { name: "San Vicente" },
            { name: "Mandacpan Elem. School" },
            { name: "Bit-os" },
            { name: "Amparo" }
          ],
          city: "Butuan City",
        },

        {
          id: "13",
          barangays: [
            { name: "Banza National High School"},
            { name: "Brgy. Maug" },
            { name: "Brgy. Mahogany"},
            { name: "Baan Viaduct" },
            { name: "M. Calo St."  },
            { name: "G. Flores St." },
            { name: "Rosales St. (SJIT)"  },
            { name: "North Montilla Blvd." },
            { name: "Obrero Elem. School" },
            { name: "Langihan Public Market", },
            { name: "City Hall" },
            { name: "J. Rosales St."},
            { name: "J. C. Aquino Ave. (DBP)" },
            { name: "Baan Viaduct" },
            { name: "Brgy. Mahogany" },
            { name: "Brgy. Maug" },
            { name: "Brgy. Banza" }
          ],
          city: "Butuan City",
        },

        {
          id: "10",
          barangays: [
            { name: "Bancasi-Dumalagan Crossing" },
            { name: "J.C. Aquino Ave."},
            { name: "Baan Viaduct" },
            { name: "Baan Km. 3"},
            { name: "Tiniwisan Crossing"},
            { name: "Philippine Science High School" },
            { name: "Ampayon" },
            { name: "Vice Versa"}
          ],
          city: "Butuan City",
        },

        {
          id: "7",
          barangays: [
            { name: "De Oro Brgy. Hall"},
            { name: "Taligaman Brgy. Hall"},
            { name: "Antongalon Elem. School"},
            { name: "LTFRB"},
            { name: "Ampayon Rotonda" },
            { name: "Caraga State University"},
            { name: "Philippine Science High School" },
            { name: "Tiniwisan Crossing"},
            { name: "Butuan Medical Center"},
            { name: "Filinvest (Hi-way)"},
            { name: "Baan Viaduct"},

            // Column 2
            { name: "M. Calo St."},
            { name: "G. Flores St."},
            { name: "North Montilla Blvd."},
            { name: "Andaya St." },
            { name: "Langihan Public Market" },
            { name: "City Hall"},
            { name: "J. C. Aquino Ave. (DBP)"},
            { name: "SM"},
            { name: "R. Calo St. (Dunkin)"},
            { name: "T. Sanchez St. (ANHS)"},
            { name: "M. Calo St." },

            // Column 3
            { name: "Foot of Bridge"},
            { name: "Balik Baan Viaduct"},
            { name: "Baan Km. 3" },
            { name: "Philippine Science High School"},
            { name: "Tiniwisan Crossing" },
            { name: "Ampayon"},
            { name: "Antongalon"},
            { name: "Taligaman" },
            { name: "De Oro Brgy. Hall" }
          ],
          city: "Butuan City",
        },

        {
          id: "14",
          barangays: [
            { name: "Ampayon"},
            { name: "Tiniwisan" },
            { name: "Alviola"},
            { name: "Era (Crossing)"},
            { name: "Lemon (Crossing)"},
            { name: "Pigdaulan (Crossing)"},
            { name: "Mahay (Crossing)"},
            { name: "San Vicente (Crossing)"},
            { name: "Montilla Boulevard"},
            { name: "SM"},
            { name: "Gaisano"},
            { name: "Robinsons" }
          ],
          city: "Butuan City",
        },

      ],
      selectedRoute: null,
      isModalOpen: false,
      startPoint: null,
      endPoint: null,
      estimatedTime: null,
      map: null,
      movingIcon: null,
      polyline: null,
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

      this.$nextTick(() => {
        this.initMap();
      });
    },
    closeModal() {
      this.isModalOpen = false;
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

      this.clearRoute();
      this.estimatedTime = this.estimatedTravelTime;
      this.routeDisplay();
    },
    async routeDisplay() {
      if (this.startPoint && this.endPoint) {
        const startCoords = await this.getCoordinates(this.startPoint);
        const endCoords = await this.getCoordinates(this.endPoint);

        this.clearRoute();
        this.map.setView([startCoords.lat, startCoords.lng], 12);

        this.addMarkers(startCoords, endCoords);
      }
    },
    async getCoordinates(address) {
      try {
        // Constructing dynamic address string
        const addressString = `${address} ${this.selectedRoute.city}, Philippines`;

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: addressString, // Dynamically built address with barangay, city, and province
            format: 'json',
            addressdetails: 1,
          }
        });

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return {
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          };
        } else {
          console.error("Location not found for:", addressString);
          // Return default location if no location is found
          return { lat: 8.9501, lng: 125.5302 }; // Default location (Butuan City)
        }
      } catch (error) {
        console.error("Error fetching coordinates: ", error);
        return { lat: 8.9501, lng: 125.5302 }; // Default location on error
      }
    },
    addMarkers(startCoords, endCoords) {
      // Add a marker for the start point
      const startMarker = L.marker([startCoords.lat, startCoords.lng]).addTo(this.map);
      startMarker.bindPopup(`<b>${this.startPoint}</b>`).openPopup();

      // Add a red circle marker for the start point
      const startCircle = L.circleMarker([startCoords.lat, startCoords.lng], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1,
        radius: 10
      }).addTo(this.map);
      startCircle.bindPopup(`<b>${this.startPoint}</b>`).openPopup();

      // Add a marker for the end point
      const endMarker = L.marker([endCoords.lat, endCoords.lng]).addTo(this.map);
      endMarker.bindPopup(`<b>${this.endPoint}</b>`).openPopup();

      // Add line connecting start and end points
      this.polyline = L.polyline([startCoords, endCoords], { color: 'blue' }).addTo(this.map);

      // Add moving icon
      this.moveIcon(startCoords, endCoords);
    },
    clearRoute() {
      if (this.map) {
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            this.map.removeLayer(layer);
          }
        });
        if (this.movingIcon) {
          this.movingIcon.stop();
        }
      }
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


        if (!this.startPoint || !this.startPoint.name) {
          console.error("Start point is not set or missing the name property.");
          return;
        }

        if (!this.endPoint || !this.endPoint.name) {
          console.error("End point is not set or missing the name property.");
          return;
        }
        // If we have user info, insert the data into the `routes` table
        const { data, error } = await supabase
          .from("routes")
          .insert([
            {
              user_id: userInfo.id, // Use the user_id from `users_info` table
              start_location: this.startPoint.name,
              end_location: this.endPoint.name,
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
@import "leaflet/dist/leaflet.css";
@import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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
  grid-template-columns: repeat(3, 1fr);
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
</style>
