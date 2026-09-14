import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <LanguageProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </LanguageProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
