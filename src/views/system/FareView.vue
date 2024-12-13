<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const drawer = ref(false)
const zoomedImage = ref(null)
const showModal = ref(false)

const openModal = (image) => {
  zoomedImage.value = image
  showModal.value = true
}

const closeModal = () => {
  zoomedImage.value = null // Reset image when closing
  showModal.value = false
}
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/images/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="logo-container"> Easy Commute </v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <nav v-if="!mobile">
          <router-link to="/home" class="nav-link">Home</router-link>
          <router-link to="/routes" class="nav-link">Ride</router-link>
          <router-link to="#" class="nav-link">Fare</router-link>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
        </nav>
        <v-btn icon v-if="mobile" @click="drawer = !drawer">
          <v-icon color="white">mdi-menu</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Drawer for Mobile Navigation -->
    <v-navigation-drawer v-model="drawer" temporary class="mobile-drawer">
      <v-list>
        <v-list-item>
          <router-link to="/home" class="nav-link">Home</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/routes" class="nav-link">Ride</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="#" class="nav-link">Fare</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/profile" class="nav-link">Profile</router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Images Overlay -->
    <div class="image-container-1">
      <img
        src="/images/tricyclefare.png"
        alt="Tricycle Fare"
        class="overlay-image"
        @click="openModal('/images/tricyclefare.png')"
      />
    </div>

    <div class="image-container-2">
      <img
        src="/images/multicabfare.jpg"
        alt="Multicab Fare"
        class="overlay-image"
        @click="openModal('/images/multicabfare.jpg')"
      />
    </div>

    <!-- Fullscreen Zoomed Image -->
    <v-dialog
      v-model="showModal"
      fullscreen
      overlay-color="black"
      transition="fade-transition"
      persistent
    >
      <v-img :src="zoomedImage" class="zoomed-image" @click="closeModal"></v-img>
    </v-dialog>

    <RouterView />
  </v-app>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  font-size: 2rem; /* Large screens default size */
  font-weight: bold;
  text-align: center;
  color: white; /* Ensures visibility on dark backgrounds */
  transition: font-size 0.3s ease;
}

@media (max-width: 1200px) {
  .logo-container {
    font-size: 1.5rem; /* Medium screens */
  }
}

@media (max-width: 600px) {
  .logo-container {
    font-size: 1.2rem; /* Small screens (mobile devices) */
    justify-content: center;
  }
}

/* Background Video */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
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

/* Navbar Styles */
.transparent-navbar {
  background-color: transparent;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-right: 50px;
  font-weight: 500;
  transition: opacity 0.3s ease;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}

.nav-link:hover {
  opacity: 0.8;
}

.white-text-custom {
  color: white !important;
}

/* Image Container and Overlay Images */
.image-container-1,
.image-container-2 {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;
}

.image-container-2 {
  transform: translateX(-50%) translateY(80%); /* Adjust the position of the second image */
}

.overlay-image {
  width: 100%;
  max-width: 600px; /* Keeps the image within a limit */
  height: auto; /* Maintains aspect ratio */
  border-radius: 10px;
  cursor: pointer;
  object-fit: contain;
}

/* Zoomed Image */
.zoomed-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
  cursor: zoom-out;
}

/* Mobile Responsiveness */

@media (max-width: 600px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .nav-link {
    margin-right: 20px;
  }

  .contact-button {
    font-size: 0.9rem;
    padding: 8px 15px;
  }

  .overlay {
    left: 5%;
  }

  /* Navigation drawer */
  .v-navigation-drawer {
    width: 250px;
    background-color: black;
  }

  .v-list-item {
    padding: 16px 0;
  }

  .v-list-item a {
    font-size: 1.1rem;
    padding: 8px 16px;
    color: #007bb5;
  }

  .v-list-item a:hover {
    color: #00bfff;
  }
}
@media (max-width: 600px) {
  /* Adjust image width */
  .overlay-image {
    width: 90%; /* Adjust width of images on mobile */
    max-width: none; /* Remove max-width constraint */
  }

  /* Adjust image containers for better positioning on mobile */
  .image-container-1,
  .image-container-2 {
    position: relative;
    top: 10%; /* Adjust vertical position */
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px; /* Reduce gap between images */
  }

  /* Image 2 (second image) */
  .image-container-2 {
    top: 20%; /* Adjust vertical position of the second image */
  }
}
</style>