import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — sve putanje su relativne, pa sajt radi na bilo kojoj GitHub Pages adresi
// (https://<korisnik>.github.io/<bilo-koje-ime-repozitorijuma>/), bez obzira na velika/mala slova.
export default defineConfig({
  plugins: [react()],
  base: './',
});
