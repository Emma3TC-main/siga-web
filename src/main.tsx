import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppProvider } from './presentation/state/AppContext'
import { CatalogProvider } from './presentation/state/CatalogContext'
import { OperationsProvider } from './presentation/state/OperationsContext'
import { catalogUseCases, operationsUseCases, reportingUseCases } from './app/compositionRoot'
import { AuthProvider, useAuth } from './presentation/state/AuthContext'
import { ReportingProvider } from './presentation/state/ReportingContext'
import Login from './presentation/pages/auth/Login'
import App from './App'

function AuthenticatedRoot() {
  const { phase } = useAuth()

  if (phase !== 'AUTHENTICATED') return <Login />

  return (
    <CatalogProvider useCases={catalogUseCases}>
      <OperationsProvider useCases={operationsUseCases}>
        <ReportingProvider useCases={reportingUseCases}>
          <AppProvider>
            <App />
          </AppProvider>
        </ReportingProvider>
      </OperationsProvider>
    </CatalogProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthenticatedRoot />
    </AuthProvider>
  </React.StrictMode>,
)
