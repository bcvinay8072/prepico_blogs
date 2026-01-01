<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const blog = ref(null)
const loading = ref(true)

// Helper to convert standard YouTube links to Embed links
const getYouTubeEmbedUrl = (url) => {
  let videoId = '';
  
  if (url.includes('youtu.be')) {
    videoId = url.split('/').pop();
  } else if (url.includes('youtube.com')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v');
  }
  
  return `https://www.youtube.com/embed/${videoId}`;
}

onMounted(async () => {
  const blogId = route.params.id // Get ID from URL
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single()

  if (error) alert(error.message)
  else blog.value = data
  
  loading.value = false
})
</script>

<template>
  <div class="container" v-if="!loading && blog">
    <img v-if="blog.thumbnail_url" :src="blog.thumbnail_url" class="main-thumb" />
    <h1 class="blog-title">{{ blog.title }}</h1>
    <p class="meta">{{ new Date(blog.created_at).toLocaleDateString() }}</p>
    <hr />

    <div class="content-area">
      <div v-for="(block, index) in blog.content" :key="index" class="block">
        
        <p v-if="block.type === 'text'" class="text-block">
          {{ block.content }}
        </p>

        <div v-if="block.type === 'image'" class="image-block">
          <img :src="block.url" alt="Blog Image" />
          <p v-if="block.caption" class="caption">{{ block.caption }}</p>
        </div>

        <div v-if="block.type === 'row'" class="row-block">
          <div class="col">
            <p>{{ block.columns[0].content }}</p>
          </div>
          <div class="col">
            <p>{{ block.columns[1].content }}</p>
          </div>
        </div>

        <div v-if="block.type === 'video'" class="video-container">
          <div v-if="block.url.includes('youtube.com') || block.url.includes('youtu.be')" class="video-wrapper">
             <iframe 
               width="100%" 
               height="400" 
               :src="getYouTubeEmbedUrl(block.url)" 
               frameborder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowfullscreen>
             </iframe>
          </div>
          <div v-else>
            <video controls width="100%" :src="block.url">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div v-if="block.type === 'file'" class="file-download">
           <a :href="block.url" target="_blank" class="download-btn">
             📄 Download Attached File
           </a>
        </div>
        
        <ul v-if="block.type === 'list'" class="blog-list">
            <li v-for="(item, i) in block.content.split('\n')" :key="i">
              {{ item }}
            </li>
        </ul>

      </div>
    </div>
  </div>
  <div v-else class="container">Loading...</div>
</template>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; }
.blog-title { font-size: 2.5rem; margin-bottom: 10px; }
.meta { color: #888; margin-bottom: 30px; }

.block { margin-bottom: 20px; }

/* Typography */
.text-block { font-size: 1.1rem; line-height: 1.6; color: #333; }

/* Image Styles */
.image-block img { max-width: 100%; border-radius: 8px; }
.caption { text-align: center; color: #666; font-size: 0.9rem; font-style: italic; margin-top: 5px; }

/* Row Styles */
.row-block { display: flex; gap: 30px; margin: 30px 0; }
.col { flex: 1; font-size: 1.1rem; line-height: 1.6; }

/* Responsive: Stack columns on mobile */
@media (max-width: 600px) {
  .row-block { flex-direction: column; gap: 10px; }
}
.main-thumb { width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
.blog-list { margin-bottom: 20px; padding-left: 20px; line-height: 1.6; }
.download-btn { display: inline-block; background: #f0f0f0; padding: 10px 15px; border-radius: 5px; text-decoration: none; color: #333; border: 1px solid #ccc; }
.download-btn:hover { background: #e0e0e0; }
</style>