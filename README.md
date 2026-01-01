# Prepico Blogs - Frontend Intern Assignment

A robust Content Management System (CMS) built with **Vue 3** and **Supabase**. This project allows administrators to create dynamic blog posts with complex, nested layouts and rich media support.

## 🚀 Features

* **Block-Based Editor:** A Notion-style editor supporting various content blocks.
* **Complex Layouts:** Supports **Horizontal Rows** with nested columns (satisfies the "complex structure" requirement).
* **Rich Media Support:**
    * **Images:** Direct upload to Supabase Storage with live preview.
    * **Videos:** Embed YouTube videos or direct MP4 links via URL.
    * **Files:** Attach downloadable files (PDF, Zip, etc.).
    * **Lists:** Bullet point support.
    * **Thumbnails:** Custom cover image upload for each blog post.
* **Real-time Preview:** Admin interface updates instantly as content is added.
* **Frontend Viewer:** A polished, responsive public-facing page to view published blogs, styled with the Prepico design palette.
* **Backend:** Supabase (PostgreSQL) using JSONB for flexible content storage.

## 🛠️ Tech Stack

* **Frontend:** Vue.js 3, Vite, Vue Router
* **Backend:** Supabase (Database & Auth), PostgreSQL
* **Storage:** Supabase Storage (for images/assets)
* **Styling:** CSS Variables, Responsive Grid Layout

## 📦 Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/bcvinay8072/prepico_blogs.git
cd prepico_blogs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory. Add your Supabase credentials (these connect the app to the database):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)
If setting up a fresh Supabase project, execute this SQL in the SQL Editor:

```sql
create table blogs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  thumbnail_url text,
  content jsonb default '[]'::jsonb
);

-- Enable RLS (Row Level Security) if needed, or allow public access for demo.
```
*Note: Ensure a public storage bucket named `blog-assets` exists.*

### 5. Run the Application
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🎥 Demo Video

**[Click here to watch the walkthrough video]** (https://drive.google.com/file/d/12MR6bdeieudPjZEXFTiCHWRqtG6bQ7u-/view?usp=drive_link)

---

## 📂 Project Structure

* `src/views/AdminPage.vue`: The CMS interface for creating/editing blogs. Handles file uploads and JSON structure generation.
* `src/views/BlogList.vue`: The home page displaying the grid of available blogs.
* `src/views/BlogPost.vue`: The dynamic viewer that renders the JSON content into HTML.
* `src/supabase.js`: Supabase client configuration.

## 👤 Author

**Chenchu Vinay Boga**
* **Email:** 23f2003186@ds.study.iitm.ac.in
