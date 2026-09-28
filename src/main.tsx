import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppProvider } from './presentation/state/AppContext'
import { CatalogProvider } from './presentation/state/CatalogContext'
import { OperationsProvider } from './presentation/state/OperationsContext'
import { catalogUseCases, operationsUseCases } from './app/compositionRoot'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CatalogProvider useCases={catalogUseCases}>
      <OperationsProvider useCases={operationsUseCases}>
        <AppProvider>
          <App />
        </AppProvider>
      </OperationsProvider>
    </CatalogProvider>
  </React.StrictMode>,
)
