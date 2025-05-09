<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">User Management</h1>
      <NuxtLink to="/admin" class="text-blue-500 hover:text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Back to Dashboard
      </NuxtLink>
    </div>
    
    <!-- Search and Filter Controls -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Search by name or ID"
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div class="w-full md:w-48">
          <label for="roleFilter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
          <select 
            id="roleFilter" 
            v-model="roleFilter"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div class="w-full md:w-48">
          <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select 
            id="sortBy" 
            v-model="sortBy"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="role">Role</option>
            <option value="createdAt">Date Joined</option>
            <option value="lastLogin">Last Activity</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select 
                v-model="user.role"
                @change="updateUserRole(user)"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(user.lastLogin) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: user.overallProgress + '%' }"></div>
              </div>
              <div class="text-xs text-gray-500">{{ user.overallProgress }}% Complete</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="viewUserDetails(user)" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
              <button @click="showDeleteConfirm(user)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              No users found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination Controls -->
      <div class="px-6 py-3 flex justify-between items-center border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ pagination.start + 1 }}</span> to <span class="font-medium">{{ Math.min(pagination.end, users.length) }}</span> of <span class="font-medium">{{ users.length }}</span> users
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="pagination.page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="pagination.end >= users.length"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.end >= users.length }"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="mb-6 text-gray-600">Are you sure you want to delete the user <strong>{{ selectedUser?.name }}</strong>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteUser" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UserRole } from '~/server/services/permissions';

// Page metadata with role restriction
definePageMeta({
  middleware: ['auth', 'rbac'],
  requiredRole: 'ADMIN'
});

// Sample users data (would be fetched from API in real app)
const users = ref([
  {
    id: 'user-1',
    name: 'Jane Smith',
    role: 'ADMIN',
    lastLogin: new Date().toISOString(),
    overallProgress: 100,
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'user-2',
    name: 'John Doe',
    role: 'TEACHER',
    lastLogin: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    overallProgress: 85,
    createdAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: 'user-3',
    name: 'Alice Johnson',
    role: 'STUDENT',
    lastLogin: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    overallProgress: 65,
    createdAt: '2025-03-05T00:00:00.000Z'
  },
  {
    id: 'user-4',
    name: 'Bob Williams',
    role: 'STUDENT',
    lastLogin: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    overallProgress: 42,
    createdAt: '2025-03-20T00:00:00.000Z'
  },
  {
    id: 'user-5',
    name: 'Carol Taylor',
    role: 'STUDENT',
    lastLogin: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    overallProgress: 28,
    createdAt: '2025-04-01T00:00:00.000Z'
  }
]);

// Search, filter, and sort state
const search = ref('');
const roleFilter = ref('');
const sortBy = ref('name');

// Pagination state
const pagination = ref({
  page: 1,
  perPage: 10,
  get start() {
    return (this.page - 1) * this.perPage;
  },
  get end() {
    return this.start + this.perPage;
  }
});

// Modal state
const showDeleteModal = ref(false);
const selectedUser = ref(null);

// Filtered and sorted users
const filteredUsers = computed(() => {
  let result = [...users.value];
  
  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(searchTerm) || 
      user.id.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply role filter
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value);
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'role':
        return a.role.localeCompare(b.role);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'lastLogin':
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      default:
        return 0;
    }
  });
  
  // Apply pagination
  return result.slice(pagination.value.start, pagination.value.end);
});

// Pagination methods
function nextPage() {
  if (pagination.value.end < users.value.length) {
    pagination.value.page++;
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--;
  }
}

// Format date for display
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// User actions
function updateUserRole(user: any) {
  // In a real app, this would call an API endpoint
  console.log(`Updated user ${user.id} role to ${user.role}`);
  // You would update the user's role in the database here
}

function viewUserDetails(user: any) {
  // In a real app, this would navigate to a user detail page
  console.log(`View details for user ${user.id}`);
}

function showDeleteConfirm(user: any) {
  selectedUser.value = user;
  showDeleteModal.value = true;
}

function deleteUser() {
  if (!selectedUser.value) return;
  
  // In a real app, this would call an API endpoint
  console.log(`Deleting user ${selectedUser.value.id}`);
  
  // Remove user from the list
  const index = users.value.findIndex(u => u.id === selectedUser.value.id);
  if (index !== -1) {
    users.value.splice(index, 1);
  }
  
  // Close modal
  showDeleteModal.value = false;
  selectedUser.value = null;
}
</script>
