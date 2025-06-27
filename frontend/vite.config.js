import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    proxy:{
      "/api":{
        target: "http://localhost:5000",
      },
    },
  },
});
//this config file sets up Vite to use React and Tailwind CSS, 
// and it also configures a proxy for API requests to the backend server running on localhost:5000.
//When your React frontend makes a request to /api/ - Vite will proxy that request to your backend (e.g. http://localhost:x/api/...)
//So you don’t get CORS errors And you don’t have to hardcode full URLs like http://localhost:x/api/login