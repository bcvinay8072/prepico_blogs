<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const blogs = ref([])
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  // [CHANGE 1] We must select 'thumbnail_url' to use it!
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, created_at, thumbnail_url') 
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  else blogs.value = data
  
  isLoading.value = false
})

const goToBlog = (id) => {
  router.push(`/blog/${id}`)
}
</script>

<template>
  <div class="container">
    <div class="header-section">
      <h1>Latest Posts</h1>
    </div>
    
    <div v-if="isLoading">Loading...</div>

    <div class="grid">
      <div v-for="blog in blogs" :key="blog.id" class="card" @click="goToBlog(blog.id)">
        
        <div class="card-image">
          <img v-if="blog.thumbnail_url" :src="blog.thumbnail_url" alt="Blog Cover" />
          <div v-else class="placeholder">
            <span>No Image</span>
          </div>
        </div>

        <div class="card-content">
          <span class="tag">Blog</span> <h3>{{ blog.title }}</h3>
          
          <div class="meta">
            <span class="author">Prepico Team</span>
            <span class="dot">•</span>
            <span class="date">{{ new Date(blog.created_at).toLocaleDateString() }}</span>
          </div>
        </div>

      </div>
    </div>
    
    <div v-if="!isLoading && blogs.length === 0">
      <p>No blogs found.</p>
    </div>
  </div>
</template>

<style scoped>
.container { 
  max-width: var(--max-width); 
  margin: 40px auto; 
  padding: 0 20px; 
}

h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0f172a; /* Darker header color like screenshot */
}

.grid { 
  display: grid; 
  gap: 30px; 
  /* Responsive grid: fits as many 300px cards as possible */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
}

.card { 
  background: white;
  border: 1px solid var(--border-color); 
  border-radius: 12px; /* Softer rounded corners */
  cursor: pointer; 
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures image corners get rounded too */
}

.card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: var(--primary-color);
}

/* --- IMAGE STYLES --- */
.card-image {
  height: 200px; /* Fixed height for uniformity */
  width: 100%;
  background-color: #f1f5f9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This makes sure images don't stretch/squish */
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.9rem;
  background: #e2e8f0;
}

/* --- TEXT CONTENT STYLES --- */
.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.tag {
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.card h3 {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1e293b;
}

.meta {
  margin-top: auto; /* Pushes date to bottom even if titles vary in length */
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dot {
  margin: 0 8px;
}
</style>