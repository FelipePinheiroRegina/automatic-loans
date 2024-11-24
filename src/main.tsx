import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { DataUserProvider } from './contexts/DataUserContext'
import { App } from './pages/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataUserProvider>
        <App/>
      </DataUserProvider>
    </ThemeProvider>
  </StrictMode>,
)
