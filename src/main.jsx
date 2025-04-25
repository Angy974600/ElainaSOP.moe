import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { GlobalProvider } from './Pages/context/GlobalContext'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider> {/* Avvolgi l'intera app con il provider */}
      <App />
    </GlobalProvider>
  </StrictMode>,
)
