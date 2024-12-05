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
  showModal.value = false
}
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/public/images/background.mp4" type="video/mp4" />
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
        <!-- Desktop Navigation -->
        <nav v-if="!mobile">
          <router-link to="/home" class="nav-link">Home</router-link>
          <router-link to="#" class="nav-link">Fare</router-link>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
        </nav>
        <!-- Mobile Navigation Toggle -->
        <v-btn icon v-if="mobile" @click="drawer = !drawer">
          <v-icon color="white">mdi-menu</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Drawer for Mobile Navigation -->
    <v-navigation-drawer v-model="drawer" temporary class="mobile-drawer">
      <v-list>
        <v-list-item>
          <router-link to="#" class="nav-link">Home</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/complain" class="nav-link">Complain</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="#" class="nav-link">Profile</router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Images Overlay -->
    <div class="image-container">
      <img
        src="/public/images/tricyclefare.png"
        alt="Tricycle Fare"
        class="overlay-image"
        @click="openModal('/public/images/tricyclefare.png')"
      />
      <img
        src="/public/images/multicabfare.jpg"
        alt="Multicab Fare"
        class="overlay-image"
        @click="openModal('/public/images/multicabfare.jpg')"
      />
    </div>

    <!-- Zoomed Image Modal -->
    <v-dialog v-model="showModal" max-width="800">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-img :src="zoomedImage" max-width="100%" max-height="80vh" contain></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>

    <RouterView />
  </v-app>
</template>

<style scoped>
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
.image-container {
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

.overlay-image {
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  cursor: pointer;
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

  .overlay-image {
    width: 90%;
  }
}

/* Additional Media Queries for Tablets and Larger Devices */
@media (max-width: 768px) {
  .main-title {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .nav-link {
    font-size: 1.1rem;
    margin-right: 25px;
  }
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 5.5rem;
  }

  .subtitle {
    font-size: 1.8rem;
  }
}

@media (min-width: 1025px) {
  .main-title {
    font-size: 7rem;
  }

  .subtitle {
    font-size: 2rem;
  }

  .nav-link {
    font-size: 1.2rem;
  }
}
</style>
