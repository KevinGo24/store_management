import { defineConfig } from 'vite';

export default defineConfig({
  // Indica que la raíz del proyecto es donde está este archivo
  root: './', 
  build: {
    // La carpeta final donde se guardará el proyecto listo para producción
    outDir: 'dist', 
    // Mantiene los assets (css, js, imágenes) limpios en la raíz de 'dist' sin subcarpetas pesadas
    assetsDir: '', 
  }
});