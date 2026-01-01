<script setup>
// No script needed here, just layout
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="brand-logo">
          Prepico<span class="highlight">Blogs</span>
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-item admin-link">Home</router-link>
          <router-link to="/admin" class="nav-item admin-link">Admin Panel</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view> 
    </main>

    <footer class="footer">
      <p>&copy; 2026 Prepico Blogs Assignment</p>
    </footer>
  </div>
</template>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.nav-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.highlight {
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-item:hover, .router-link-active {
  color: var(--primary-color);
}

.admin-link {
  background: var(--bg-color);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.main-content {
  min-height: 80vh;
  padding-bottom: 40px;
}

.footer {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
}
</style>