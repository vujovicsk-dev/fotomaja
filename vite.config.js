import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — relativne putanje, pa projekat radi na bilo kojoj GitHub Pages adresi
// (https://<korisnik>.github.io/<ime-repozitorijuma>/) bez dodatnog podešavanja.
export default defineConfig({
  plugins: [react()],
  base: './',
});
