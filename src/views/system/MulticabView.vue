<template>
  <v-container>
    <!-- Row 1 -->
    <v-row justify="center">
      <v-col cols="auto" v-for="(route, index) in routes.slice(0, 3)" :key="index">
        <div
          class="flip-container"
          @mouseenter="hoveredButton = index"
          @mouseleave="hoveredButton = null"
        >
          <div :class="['flipper', { flipped: hoveredButton === index }]">
            <!-- Front Side -->
            <v-btn height="72" min-width="164" class="flip-front">
              <v-icon class="mr-1">mdi mdi-jeepney</v-icon>
            </v-btn>
            <!-- Back Side -->

            <v-btn height="72" min-width="164" class="flip-back">
              <RouterLink to="/map" style="text-decoration: none">Route {{ route }}</RouterLink>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- Row 2 -->
    <v-row justify="center">
      <v-col cols="auto" v-for="(route, index) in routes.slice(3, 6)" :key="index + 3">
        <div
          class="flip-container"
          @mouseenter="hoveredButton = index + 3"
          @mouseleave="hoveredButton = null"
        >
          <div :class="['flipper', { flipped: hoveredButton === index + 3 }]">
            <!-- Front Side -->
            <v-btn height="72" min-width="164" class="flip-front">
              <v-icon class="mr-1">mdi mdi-jeepney</v-icon>
            </v-btn>
            <!-- Back Side -->
            <v-btn height="72" min-width="164" class="flip-back">
              <RouterLink to="/map" style="text-decoration: none">Route {{ route }}</RouterLink>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- Row 3 -->
    <v-row justify="center">
      <v-col cols="auto" v-for="(route, index) in routes.slice(6, 9)" :key="index + 6">
        <div
          class="flip-container"
          @mouseenter="hoveredButton = index + 6"
          @mouseleave="hoveredButton = null"
        >
          <div :class="['flipper', { flipped: hoveredButton === index + 6 }]">
            <!-- Front Side -->
            <v-btn height="72" min-width="164" class="flip-front">
              <v-icon class="mr-1">mdi mdi-jeepney</v-icon>
            </v-btn>
            <!-- Back Side -->
            <v-btn height="72" min-width="164" class="flip-back">
              <RouterLink to="/map" style="text-decoration: none">Route {{ route }} </RouterLink>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      routes: [1, 2, 4, 7, 8, 10, 11, 13, 14], // Route numbers
      hoveredButton: null, // Track which button is hovered
    }
  },
}
</script>

<style scoped>
.flip-container {
  perspective: 1000px;
  transform: translate(0%, 250%);
}

.flipper {
  position: relative;
  width: 164px;
  height: 72px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipper.flipped {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
}

.flip-front {
  background-color: #1c85be;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-back {
  background-color: #c9ecef;
  color: white;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
