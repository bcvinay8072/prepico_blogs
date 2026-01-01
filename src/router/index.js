import { createRouter, createWebHistory } from 'vue-router'
import BlogList from '../views/BlogList.vue'
import BlogPost from '../views/BlogPost.vue'
import AdminPage from '../views/AdminPage.vue'

const routes = [
  { path: '/', component: BlogList },           // Home page shows list
  { path: '/blog/:id', component: BlogPost },   // :id is dynamic (e.g., /blog/123)
  { path: '/admin', component: AdminPage }      // Admin interface
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router