<template>
  <!-- Routes Container -->
  <div class="video-container">
    <video autoplay muted loop class="background-video">
      <source src="/public/images/background.mp4" type="video/mp4" />
    </video>
  </div>

  <div class="routes-container">
    <h1>ROUTES FOR MULTICAB</h1>
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
          <option v-for="barangay in selectedRoute.barangays" :key="barangay.name" :value="barangay">
            {{ barangay.name }}
          </option>
        </select>

        <label for="destination">Destination Barangay:</label>
        <select v-model="endPoint" @change="updateRoute">
          <option disabled value="">Select destination barangay</option>
          <option v-for="barangay in filteredBarangays" :key="barangay.name" :value="barangay">
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
        <span>{{ startPoint.name }} → {{ endPoint.name }}</span>
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
          ]
        },
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
      markers: [],
      iconMarker: null, // Store the moving icon marker reference
      selectedRoute: null,
      isModalOpen: false,
      startPoint: null,
      endPoint: null,
      estimatedTime: null,
      map: null,
      routingControl: null,
    };
  },
  computed: {
    distance() {
      if (this.startPoint && this.endPoint) {
        const startLatLng = L.latLng(this.startPoint.lat, this.startPoint.lng);
        const endLatLng = L.latLng(this.endPoint.lat, this.endPoint.lng);
        return startLatLng.distanceTo(endLatLng); // Distance in meters
      }
      return 0;
    },
    estimatedTravelTime() {
      const distanceInMeters = this.distance;
      if (distanceInMeters > 0) {
        const averageSpeed = 20 * 1000 / 3600; // Speed in meters per second (20 km/h)
        const timeInSeconds = distanceInMeters / averageSpeed; // Time in seconds
        return Math.round(timeInSeconds / 60); // Convert seconds to minutes
      }
      return 0;
    },
    filteredBarangays() {
      if (!this.startPoint) {
        return this.selectedRoute?.barangays || [];
      }
      return this.selectedRoute.barangays.filter(
        (barangay) => barangay.name !== this.startPoint.name
      );
    },
  },
  methods: {
    openRouteModal(route) {
      this.selectedRoute = route;
      this.isModalOpen = true;
      this.startPoint = null;
      this.endPoint = null;
      this.estimatedTime = null;

      // Wait for the modal to render before initializing the map
      this.$nextTick(() => {
        this.initMap();
      });
    },
    closeModal() {
      this.isModalOpen = false;

      // Remove map and routing control to prevent memory leaks
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
        this.routingControl = null;
      }
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    },
    initMap() {
      if (!this.map) {
        this.map = L.map("map").setView([8.9501, 125.5302], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        }).addTo(this.map);
      } else {
        this.map.setView([8.9501, 125.5302], 13); // Reset map position
      }
    },
    updateRoute() {
      if (this.startPoint && this.endPoint && this.startPoint.name === this.endPoint.name) {
        alert("Start point and End point cannot be the same!");
        this.endPoint = null; // Reset end point if they are the same
        return;
      }

      // Remove the old route and markers before adding the new ones
      this.clearRouteAndMarkers();

      // Now proceed to display the new route
      this.routeDisplay();
    },

    clearRouteAndMarkers() {
      // Remove existing route if any
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
        this.routingControl = null;
      }

      // Remove existing markers
      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      // Remove animated icon if it exists
      if (this.iconMarker) {
        this.map.removeLayer(this.iconMarker);
        this.iconMarker = null;
      }
    },

    updateRoute() {
      if (this.startPoint && this.endPoint && this.startPoint.name === this.endPoint.name) {
        alert("Start point and End point cannot be the same!");
        this.endPoint = null; // Reset end point if they are the same
        return;
      }

      // Clear existing route and markers
      this.clearRouteAndMarkers();

      // Proceed to display the new route
      this.routeDisplay();
      this.saveRouteData();
    },

    routeDisplay() {
      if (this.startPoint && this.endPoint) {
        const startLatLng = L.latLng(this.startPoint.lat, this.startPoint.lng);
        const endLatLng = L.latLng(this.endPoint.lat, this.endPoint.lng);

        // Create the route control with the correct start and end lat/lng
        this.routingControl = L.Routing.control({
          waypoints: [startLatLng, endLatLng],
          routeWhileDragging: true,
          showInstructions: false,
          summaryTemplate: () => "",
          instructionTemplate: () => "",
          controls: { instructions: false },
          lineOptions: { styles: [{ color: 'red', weight: 4 }] },
        }).addTo(this.map);

        // Add markers for start and end points
        this.addMarkerWithName(this.startPoint);
        this.addMarkerWithName(this.endPoint);

        // Listen for the route to be calculated and animate the icon
        this.routingControl.on('routesfound', (e) => {
          const route = e.routes[0];
          const { coordinates } = route;
          this.animateIcon(coordinates);
        });
      }
    },

    addMarkerWithName(point) {
      const marker = L.marker([point.lat, point.lng]).addTo(this.map);
      marker.bindPopup(`<b>${point.name}</b><br>Lat: ${point.lat}<br>Lng: ${point.lng}`).openPopup();
      this.markers.push(marker);
    },

    animateIcon(coordinates) {
      if (!coordinates || coordinates.length === 0) {
        console.error('No coordinates available for animation.');
        return;
      }

      console.log('Animating icon with coordinates:', coordinates);

      const svgIcon = L.divIcon({
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>`,
        className: "custom-moving-icon",
        iconSize: [30, 30],
      });

      // Reuse the existing icon marker if it exists
      if (this.iconMarker) {
        this.iconMarker.setLatLng([coordinates[0].lat, coordinates[0].lng]);
      } else {
        this.iconMarker = L.marker([coordinates[0].lat, coordinates[0].lng], { icon: svgIcon }).addTo(this.map);
      }

      let i = 0;
      const moveMarker = () => {
        if (i < coordinates.length - 1) {
          i++;
          this.iconMarker.setLatLng([coordinates[i].lat, coordinates[i].lng]);
          setTimeout(moveMarker, 50); // Adjust speed (50ms per step)
        }
      };

      moveMarker();
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
