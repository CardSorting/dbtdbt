<template>
  <div class="container mx-auto px-4 py-16 text-center">
    <h1 class="text-4xl font-bold text-red-600 mb-6">Access Denied</h1>
    <div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div class="flex justify-center mb-6">
        <div class="bg-red-100 p-4 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10a3 3 0 00-3 3h6a3 3 0 00-3-3m3 3v6a3 3 0 01-6 0v-6" />
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-semibold mb-4">You don't have permission to access this page</h2>
      <p class="text-gray-600 mb-6">
        Your current role doesn't have the necessary permissions to view this content.
        If you believe this is a mistake, please contact your administrator.
      </p>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <NuxtLink to="/" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors">
          Go to Homepage
        </NuxtLink>
        <NuxtLink to="/profile" class="border border-gray-300 hover:bg-gray-100 py-2 px-6 rounded-md transition-colors">
          View Profile
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Access Denied'
});
</script>
