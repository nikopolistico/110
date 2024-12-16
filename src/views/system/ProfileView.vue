<template>
  <div class="video-container">
    <video autoplay muted loop class="background-video">
      <source src="/public/images/background.mp4" type="video/mp4" />
    </video>
  </div>

  <v-container v-if="user_info" class="profile-container" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">

        <!-- Profile Picture -->
        <v-img :src="user_info.profile_picture
          ? `https://abgsixxwevueabvuzpmo.supabase.co/storage/v1/object/public/avatars/${user_info.profile_picture}`
          : '/path/to/default/profile.png'" alt="Profile Picture" class="profile-image" max-width="120" height="120"
          contain>
          <v-btn icon @click="triggerFileInput" class="profile-upload-btn">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </v-img>

        <v-file-input ref="fileInput" v-show="showFileInput" label="Upload Profile Picture" accept="image/*"
          @change="previewProfilePicture" hide-details dense color="white" class="white-input" />

        <!-- Save Button to Save the Profile Picture -->
        <v-btn v-if="tempProfilePicture" @click="saveProfilePicture" color="primary" class="mt-3 white-input">
          Save Profile Picture
        </v-btn>

        <!-- User Information -->
        <v-card class="pa-3 transparent-card">
          <v-card-title class="headline white--text">{{ user_info.fullname || 'No Name Provided' }}</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="white--text">Email:</v-card-subtitle>
          <v-card-text class="white--text">{{ user_info.email }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn color="error" class="mt-3 white--text" @click="logout">
    Logout
  </v-btn>
  </v-container>

  <div v-else>
    <p class="white--text">Loading user profile...</p>
  </div>
</template>

<script>
import { supabase } from '../../supabaseClient'

export default {
  data() {
    return {
      showFileInput: false, // Controls the visibility of the file input
      user_info: null,
      tempProfilePicture: null, // Holds temporary preview of the profile picture
    };
  },
  methods: {
    triggerFileInput() {
      this.showFileInput = !this.showFileInput; // Toggle file input visibility
    },
    previewProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.tempProfilePicture = e.target.result; // Temporary preview
        };
        reader.readAsDataURL(file);
      }
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error logging out:", error.message);
        } else {
          console.log("Logged out successfully");
          // Redirect to the login page or home page
          this.$router.push("/");
        }
      } catch (err) {
        console.error("Unexpected error during logout:", err.message);
      }
    },
    async saveProfilePicture() {
      if (this.tempProfilePicture && this.$refs.fileInput.files.length) {
        const file = this.$refs.fileInput.files[0]; // Get the selected file
        console.log("Uploading file:", file); // Debugging line

        // Ensure the file is an image
        if (!file.type.startsWith("image/")) {
          console.error("Selected file is not an image");
          return;
        }

        try {
          // Upload the image to Supabase storage under the 'avatars' bucket (without 'profile_pictures/')
          const { data, error } = await supabase.storage.from('avatars').upload(`${Date.now()}_${file.name}`, file);

          if (error) {
            console.error("Error uploading image:", error.message);
            return;
          }

          console.log("File uploaded successfully:", data); // Debugging line

          // Get the full path of the uploaded image (including 'avatars/' part)
          const fullPath = data.path; // Example: '{timestamp}_{filename}'

          // Update the profile with the relative path (no 'profile_pictures/' part)
          const relativePath = fullPath; // This gives us just the filename

          // Update the user's profile picture with the new file
          this.user_info.profile_picture = relativePath;

          // Save the relative path (only the filename) to the database
          await this.updateUserInfo(relativePath); // Pass only the relative path (filename)

          // Hide the save button by resetting the tempProfilePicture
          this.showFileInput = false;
          this.tempProfilePicture = null;

        } catch (error) {
          console.error("Error during image upload:", error.message);
        }
      } else {
        console.log("No profile picture selected");
      }
    }
    ,
    async updateUserInfo(profilePicturePath) {
      if (!this.user_info) {
        console.error("User info is not available");
        return; // Exit if user_info is not available
      }

      console.log("Updating user profile...");
      console.log("User ID:", this.user_info.id); // Log the user id
      console.log("New Profile Picture URL:", profilePicturePath); // Log the new profile picture

      const { data, error } = await supabase
        .from('users_info')
        .upsert({
          id: this.user_info.id,
          profile_picture: profilePicturePath, // Store the relative path (filename) in the database
        });

      if (error) {
        console.error("Error updating user profile:", error.message);
      } else {
        console.log("User profile updated successfully:", data); // Log the result of the upsert operation
      }
    }
  },
  async mounted() {
    try {
      // Fetch current authenticated user
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      if (user) {
        // Fetch user information from users_info table
        const { data: userInfo, error: fetchError } = await supabase
          .from('users_info')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        } else {
          // Check if userInfo exists and has profile_picture
          if (userInfo) {
            this.user_info = {
              id: user.id,
              email: user.email,
              fullname: userInfo.fullname || 'No Name Provided',
              profile_picture: userInfo.profile_picture || null, // Default to null if not available
            };
          } else {
            this.user_info = null; // Set to null if userInfo doesn't exist
          }
        }
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error loading user data:', error.message);
      this.user_info = null; // Set user_info to null if an error occurs
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
  filter: blur(5px);
}

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.white-input .v-input__control {
  background-color: transparent !important;
  color: white !important;
}

.white-input .v-label {
  color: white !important;
}

.profile-container {
  width: 100%;
  max-width: 50%;
  text-align: center;
  margin-top: 20px;
  background-color: rgba(80, 81, 82, 0.7);
  border-radius: 10px;
  padding: 20px;
  z-index: 1;
  position: relative;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  border: 3px solid white;
  margin-bottom: 10px;
}

.profile-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.4);
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  padding: 8px;
}

.profile-upload-btn:hover {
  background-color: rgba(255, 255, 255, 0.7);
}

.transparent-card {
  margin-top: 10%;
  background-color: transparent !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white !important;
  padding: 15px;
}

.white--text {
  color: white !important;
}

@media (max-width: 600px) {
  .profile-image {
    width: 100px;
    height: 100px;
  }

  .profile-upload-btn {
    padding: 6px;
  }

  .transparent-card {
    padding: 10px;
  }

  .logout-btn {
    background-color: #f44336;
    /* Red color for logout */
    color: white;
    margin-top: 15px;
  }

  .logout-btn:hover {
    background-color: #d32f2f;
    /* Darker red on hover */
  }
}
</style>
