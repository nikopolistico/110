<script setup>
import { RouterView } from 'vue-router'
import videoPath from '@/components/vids/register.mp4'
import IndexLayout from '@/components/layout/IndexLayout.vue'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { xsOnly } = useDisplay()
const isMobile = computed(() => xsOnly.value)
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source :src="videoPath" type="video/mp4" />
      </video>
    </div>

    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="text-h5 font-weight-bold white-text-custom">
          Easy Commute
        </v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <router-link to="auth">
          <button class="ml-3 adjustable-button">Sign in</button>
        </router-link>
      </v-container>
    </v-app-bar>
    <IndexLayout></IndexLayout>
    <RouterView />
  </v-app>
</template>

<style scoped>
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%; /* Default width */
  height: auto; /* Maintain aspect ratio */
  transform: translate(-50%, -50%); /* Center the video */
  min-width: 100%; /* Ensure video covers the width */
  min-height: 100%; /* Ensure video covers the height */
  object-fit: cover; /* Scale to cover the entire container */
  z-index: -1; /* Behind all content */
}
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.logo {
  font-size: 2em;
  color: white;
  user-select: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}
.transparent-navbar {
  background-color: transparent;
}

.white-text-custom {
  color: white !important;
}

.adjustable-button {
  position: absolute;
  top: var(--button-top, 50%); /* Default to center vertically */
  left: var(--button-left, 50%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}

/* Responsive adjustments */
.adjustable-button {
  position: absolute;
  top: var(--button-top, 60%); /* Default to center vertically */
  left: var(--button-left, 85%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}

/* Media Query for Small Devices */
@media (max-width: 600px) {
  .adjustable-button {
    width: 130px; /* Larger width for small devices */
    font-size: 1rem; /* Larger, more legible font size */
    top: 60%; /* Slightly adjust position for better visibility */
    left: 75%;
    transform: translate(-50%, -50%);
  }
}
/* Adjustments for smaller screens */
@media (max-width: 900px) {
  .v-app-bar-title {
    font-size: 1em;
  }
}

@media (max-width: 600px) {
  .v-app-bar-title {
    font-size: 1em;
  }
}

@media (max-width: 400px) {
  .v-app-bar-title {
    font-size: 1em;
  }
}
</style>
