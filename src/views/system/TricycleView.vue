<template>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/public/images/background.mp4" type="video/mp4" />
      </video>
    </div>
  
    <!-- Content Section (Routes) -->
    <div class="routes-container">
      <h1>ROUTES FOR MULTICAB</h1>
      <div class="routes-grid">
        <!-- Displaying Routes -->
        <div
          v-for="(route, index) in routes"
          :key="index"
          class="route-card group"
        >
          <button
            @click="goToRouteDetails(route)"
            class="route-button"
          >
            <div class="route-icon group-hover:bg-black">
              <i class="mdi mdi-jeepney group-hover:text-white"></i>
            </div>
            <span>Route {{ route }}</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        routes: ["Green", "Red", "Yellow", "White"],
      };
    },
    methods: {
      goToRouteDetails(routeId) {
        this.$router.push({
          name: "route-detail",
          params: {
            routeId,
            vehicleType: "multicab",
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Background Video */
  .background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: -1; /* Ensure the video stays in the background */
  }
  
  /* Video Container */
  .video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1; /* Ensures it's behind the content */
  }
  
  /* Content Section */
  .routes-container {
    position: relative; /* Position the content above the video */
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background for readability */
    color: #fff;
    padding: 20px;
    z-index: 1; /* Make sure the content is above the video */
  }
  
  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .routes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Force 2 columns */
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
  </style>
  