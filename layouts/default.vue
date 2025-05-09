<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container header-container">
        <div class="logo">
          <NuxtLink to="/">
            <h1>DBT Skills</h1>
          </NuxtLink>
        </div>
        <nav class="main-nav">
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <template v-if="isSignedIn">
              <li><NuxtLink to="/modules">Modules</NuxtLink></li>
              <li><NuxtLink to="/practice">Daily Practice</NuxtLink></li>
              <li><NuxtLink to="/profile">Profile</NuxtLink></li>
              <!-- Admin Navigation -->
              <li v-if="isAdmin"><NuxtLink to="/admin" class="admin-link">Admin</NuxtLink></li>
              <!-- Teacher Navigation -->
              <li v-if="isTeacher && !isAdmin"><NuxtLink to="/teacher" class="teacher-link">Teacher</NuxtLink></li>
            </template>
          </ul>
        </nav>
        <div class="auth-actions">
          <template v-if="isSignedIn">
            <button @click="signOut" class="sign-out-btn">Sign Out</button>
          </template>
          <template v-else>
            <NuxtLink to="/sign-in" class="auth-btn">Sign In</NuxtLink>
            <NuxtLink to="/sign-up" class="auth-btn sign-up">Sign Up</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main class="app-content">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} DBT Skills Learning App</p>
        <p class="disclaimer">This app is for educational purposes only and is not a substitute for professional mental health treatment.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '~/store/user';

// Reactive state
const isSignedIn = ref(false);
const isLoading = ref(true);
const userStore = useUserStore();

// Role-based access computed properties
const isAdmin = computed(() => userStore.role === 'ADMIN');
const isTeacher = computed(() => ['TEACHER', 'ADMIN'].includes(userStore.role));

// We'll use the $clerk instance provided by the plugin
const nuxtApp = useNuxtApp();

// Check authentication status when component mounts
onMounted(async () => {
  try {
    // Wait for Clerk to be ready
    if (nuxtApp.$clerk) {
      await nuxtApp.$clerk.load();
      isSignedIn.value = !!nuxtApp.$clerk.user;
      
      // If signed in, synchronize with user store to get role data
      if (isSignedIn.value) {
        await userStore.fetchUser().catch(err => {
          console.warn('User store sync error:', err);
          // Don't throw - we still want the app to work even if user data sync fails
        });
      }
    } else {
      console.warn('Clerk not available, using mock authentication for development');
      // For development convenience, we'll assume the user is signed in
      if (process.env.NODE_ENV !== 'production') {
        isSignedIn.value = true;
        // In development, assume admin for easier testing
        userStore.role = 'ADMIN';
        userStore.permissions = ['read:modules', 'read:lessons', 'read:users', 
                               'create:modules', 'update:modules', 'delete:modules',
                               'create:lessons', 'update:lessons', 'delete:lessons'];
      }
    }
  } catch (err) {
    console.error('Error checking auth status:', err);
    // For development, still allow access
    if (process.env.NODE_ENV !== 'production') {
      isSignedIn.value = true;
    }
  } finally {
    isLoading.value = false;
  }
});

// Handle sign out
const signOut = async () => {
  try {
    if (nuxtApp.$clerk) {
      await nuxtApp.$clerk.signOut();
      navigateTo('/');
    }
  } catch (err) {
    console.error('Error signing out:', err);
  }
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-btn, .sign-out-btn {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.auth-btn {
  color: white;
  border: 1px solid white;
  background: transparent;
}

.auth-btn.sign-up {
  background-color: white;
  color: var(--primary-color);
}

.sign-out-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  cursor: pointer;
}

.auth-btn:hover, .sign-out-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.auth-btn.sign-up:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.logo a {
  color: white;
  text-decoration: none;
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.main-nav a:hover {
  opacity: 0.8;
}

.admin-link, .teacher-link {
  position: relative;
  font-weight: 600;
}

.admin-link {
  color: #FFC107;
}

.teacher-link {
  color: #4CAF50;
}

.app-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: #f1f1f1;
  padding: 1.5rem 0;
  margin-top: auto;
  text-align: center;
}

.disclaimer {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav ul {
    gap: 1rem;
  }
  
  .auth-actions {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .main-nav ul {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
