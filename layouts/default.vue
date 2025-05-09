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
            <li><NuxtLink to="/modules">Modules</NuxtLink></li>
            <li><NuxtLink to="/practice">Daily Practice</NuxtLink></li>
            <li><NuxtLink to="/profile">Profile</NuxtLink></li>
          </ul>
        </nav>
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
}

@media (max-width: 480px) {
  .main-nav ul {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
