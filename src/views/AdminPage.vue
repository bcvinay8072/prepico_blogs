<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const title = ref('')
const thumbnailUrl = ref('') // Stores the cover image URL
const blocks = ref([]) 
const isSubmitting = ref(false)

// --- 1. BLOCK MANAGEMENT ---

const addTextBlock = () => blocks.value.push({ type: 'text', content: '' })
const addListBlock = () => blocks.value.push({ type: 'list', content: '' }) // Bullets
const addRowBlock = () => blocks.value.push({ type: 'row', columns: [{ content: '' }, { content: '' }] })
const addImageBlock = () => blocks.value.push({ type: 'image', url: '', caption: '' })
const addVideoBlock = () => blocks.value.push({ type: 'video', url: '', caption: '' })
const addFileBlock = () => blocks.value.push({ type: 'file', url: '', fileName: '' })

const removeBlock = (index) => blocks.value.splice(index, 1)

// --- 2. UPLOAD LOGIC (The Core Fix) ---

// Helper function to upload to Supabase
const uploadFile = async (file) => {
  console.log("Starting upload for:", file.name)
  const fileName = Date.now() + '-' + file.name.replace(/\s/g, '-') // Clean filename
  
  // Upload to 'blog-assets' bucket
  const { error } = await supabase.storage.from('blog-assets').upload(fileName, file)
  
  if (error) {
    console.error("Upload error:", error)
    alert('Upload failed: ' + error.message)
    return null
  }

  // Get the Public URL
  const { data } = supabase.storage.from('blog-assets').getPublicUrl(fileName)
  console.log("Upload success. URL:", data.publicUrl)
  return data.publicUrl
}

// Function A: Handle Thumbnail Upload
const handleThumbnailUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  const url = await uploadFile(file)
  if (url) thumbnailUrl.value = url
}

// Function B: Handle Block Uploads (Images and Files)
const handleBlockUpload = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return
  
  const url = await uploadFile(file)
  
  if (url) {
    // 1. Update the URL
    blocks.value[index].url = url
    
    // 2. If it's a file, save the name for display
    if (blocks.value[index].type === 'file') {
      blocks.value[index].fileName = file.name
    }
  }
}

// --- 3. SAVE LOGIC ---

const saveBlog = async () => {
  if (!title.value) return alert('Please add a title')
  isSubmitting.value = true
  
  // Debug log to check data before sending
  console.log("Saving Blog:", { title: title.value, thumbnail: thumbnailUrl.value, blocks: blocks.value })

  const { error } = await supabase
    .from('blogs')
    .insert({
      title: title.value,
      thumbnail_url: thumbnailUrl.value, 
      content: blocks.value, 
    })

  isSubmitting.value = false
  if (error) alert('Error: ' + error.message)
  else {
    alert('Blog Published!')
    // Reset form
    title.value = ''
    thumbnailUrl.value = '' 
    blocks.value = []
  }
}
</script>

<template>
  <div class="admin-container">
    <h1>Create New Blog</h1>
    
    <div class="form-group">
      <label>Blog Title:</label>
      <input v-model="title" type="text" placeholder="Enter main title..." class="main-input" />
    </div>

    <div class="form-group">
      <label>Cover Image (Thumbnail):</label>
      <input type="file" @change="handleThumbnailUpload" accept="image/*" />
      
      <div v-if="thumbnailUrl" style="margin-top: 10px;">
        <img :src="thumbnailUrl" style="max-height: 150px; border-radius: 5px; border: 1px solid #ccc;" />
        <button @click="thumbnailUrl = ''" class="delete-btn" style="margin-left: 10px;">Remove</button>
      </div>
    </div>

    <hr />

    <h3>Content Blocks</h3>
    
    <div v-for="(block, index) in blocks" :key="index" class="block-wrapper">
      
      <div class="block-header">
        <span class="badge">{{ block.type.toUpperCase() }}</span>
        <button @click="removeBlock(index)" class="delete-btn">Remove</button>
      </div>

      <div v-if="block.type === 'text'">
        <textarea v-model="block.content" placeholder="Write your paragraph here..."></textarea>
      </div>

      <div v-if="block.type === 'list'">
        <label>Bullet Points (One per line):</label>
        <textarea v-model="block.content" placeholder="- Item 1&#10;- Item 2&#10;- Item 3" style="height: 100px;"></textarea>
      </div>

      <div v-if="block.type === 'row'" class="row-container">
        <div class="column">
          <label>Left Column</label>
          <textarea v-model="block.columns[0].content" placeholder="Left side text..."></textarea>
        </div>
        <div class="column">
          <label>Right Column</label>
          <textarea v-model="block.columns[1].content" placeholder="Right side text..."></textarea>
        </div>
      </div>

      <div v-if="block.type === 'image'" class="image-block">
        <div v-if="!block.url">
          <label>Upload Image:</label>
          <input type="file" @change="(e) => handleBlockUpload(e, index)" accept="image/*" />
        </div>
        <div v-else>
          <img :src="block.url" alt="Preview" class="img-preview" />
          <p class="success-text">✓ Image uploaded</p>
          <input v-model="block.caption" placeholder="Add a caption..." class="caption-input" />
        </div>
      </div>

      <div v-if="block.type === 'video'" class="video-block">
        <label>Video URL (YouTube):</label>
        <input v-model="block.url" type="text" placeholder="Paste YouTube link..." class="url-input" />
      </div>

      <div v-if="block.type === 'file'" class="file-block">
        <div v-if="!block.url">
          <label>Upload Document (PDF/Zip):</label>
          <input type="file" @change="(e) => handleBlockUpload(e, index)" />
        </div>
        <div v-else class="success-text">
          <p>📎 Attached: {{ block.fileName }}</p>
        </div>
      </div>

    </div>

    <div class="controls">
      <button @click="addTextBlock">+ Paragraph</button>
      <button @click="addListBlock">+ Bullets</button>
      <button @click="addRowBlock">+ Row</button>
      <button @click="addImageBlock">+ Image</button>
      <button @click="addVideoBlock">+ Video</button>
      <button @click="addFileBlock">+ File</button>
    </div>

    <hr />

    <button @click="saveBlog" :disabled="isSubmitting" class="save-btn">
      {{ isSubmitting ? 'Publishing...' : 'PUBLISH BLOG' }}
    </button>

  </div>
</template>

<style scoped>
.admin-container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.main-input { width: 100%; padding: 10px; font-size: 1.2rem; margin-bottom: 10px; }
.block-wrapper { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; background: #f9f9f9; border-radius: 8px; }
.block-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.badge { background: #333; color: white; padding: 2px 6px; font-size: 0.8rem; border-radius: 4px; }
.delete-btn { background: #ff4444; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;}
textarea { width: 100%; height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }

.row-container { display: flex; gap: 20px; }
.column { flex: 1; }

.controls { margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap; }
.controls button { padding: 10px; cursor: pointer; background: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; }
.save-btn { background: #007bff; color: white; padding: 15px; width: 100%; border: none; font-size: 1.1rem; cursor: pointer; border-radius: 4px; }
.save-btn:disabled { background: #ccc; }

.img-preview { max-width: 200px; border-radius: 5px; border: 1px solid #ccc; margin-top: 10px; }
.success-text { color: green; font-size: 0.9rem; margin: 5px 0; }
.caption-input, .url-input { margin-top: 5px; width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
</style>