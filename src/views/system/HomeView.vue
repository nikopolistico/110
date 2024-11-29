<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>
<template>
  <AppLayout>
    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="text-h5 font-weight-bold white-text-custom">
          Easy Commute
        </v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <nav>
          <router-link to="#" class="nav-link">Home</router-link>
          <router-link to="#" class="nav-link">Complain</router-link>
          <router-link to="#" class="nav-link">Contact Us</router-link>
          <router-link to="#" class="nav-link">Profile</router-link>
        </nav>
      </v-container>
    </v-app-bar>
  </AppLayout>
</template>
