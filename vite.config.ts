import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages: 저장소 이름이 서브경로가 되므로 base를 상대경로로 둠.
// 커스텀 도메인이면 '/'로 바꾸면 됨.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
