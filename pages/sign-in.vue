<template>
  <div class="auth-page">
    <div class="auth-container card">
      <div class="auth-header">
        <h1>Sign In to DBT Skills</h1>
        <p>Continue your learning journey</p>
      </div>
      
      <div class="auth-content">
        <ClerkSignIn />
      </div>
      
      <div class="auth-footer">
        <p>Don't have an account? <NuxtLink to="/sign-up">Sign Up</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: ['auth']
});
</script>

<style scoped>
.auth-page {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
}

.auth-content {
  margin-bottom: 2rem;
}

.auth-footer {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
