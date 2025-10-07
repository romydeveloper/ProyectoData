// Punto de entrada principal de la aplicación React
import { StrictMode } from 'react'  //  este es el modo estricto para detectar problemas en desarrollo
import { createRoot } from 'react-dom/client'  // API moderna para renderizar React en el DOM
import './index.css'  // Estilos globales de la aplicación
import App from './App.jsx'  // Componente principal de la aplicación

// con esta seccion puedo Crear la raíz de React y renderizar la aplicación
// Busca el elemento con id='root' en el HTML y monta la app ahí
createRoot(document.getElementById('root')).render(
  // StrictMode me ayuda a identificar problemas potenciales durante el desarrollo
  <StrictMode>
    {/* Componente principal que contiene toda la aplicación */}
    <App />
  </StrictMode>,
)