<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- User Management -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">User Management</h2>
          <div class="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">Manage user roles, permissions, and account settings</p>
        <NuxtLink to="/admin/users" class="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors">
          Manage Users
        </NuxtLink>
      </div>
      
      <!-- Module Management -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Module Management</h2>
          <div class="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">Create and edit modules, lessons, and content</p>
        <NuxtLink to="/admin/modules" class="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
          Manage Modules
        </NuxtLink>
      </div>
      
      <!-- System Settings -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">System Settings</h2>
          <div class="bg-purple-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">Configure global settings, roles, and permissions</p>
        <NuxtLink to="/admin/settings" class="block text-center bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition-colors">
          System Settings
        </NuxtLink>
      </div>
    </div>
    
    <!-- Stats Section -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">System Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-500 text-sm">Total Users</p>
          <p class="text-2xl font-bold">{{ stats.totalUsers }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-500 text-sm">Active Today</p>
          <p class="text-2xl font-bold">{{ stats.activeToday }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-500 text-sm">Modules</p>
          <p class="text-2xl font-bold">{{ stats.totalModules }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-500 text-sm">Lessons</p>
          <p class="text-2xl font-bold">{{ stats.totalLessons }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata with role restriction
definePageMeta({
  middleware: ['auth', 'rbac'],
  requiredRole: 'ADMIN'
});

// Dummy data for demonstration
const stats = {
  totalUsers: 128,
  activeToday: 42,
  totalModules: 8,
  totalLessons: 64
};
</script>
