import './App.css'
import LandingPage from './landing/LandingPage'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from '@mui/material'
import './i18n'
import BusinessMain from './business-app/BusinessMain'
import ClientPage from './business-app/ClientPage'
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import MainLayout from './business-app/MainLayout'

function App() {
  return (
    <>
      <ThemeProvider theme={theme} defaultMode='light'>
        {/* <CssBaseline /> */}
        {/* <LandingPage /> */}
        {/* <BusinessMain /> */}
        {/* <ClientPage /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />} >
            <Route path="/client-page" element={<ClientPage />} />
            <Route path="/business-main" element={<BusinessMain />} />
          </Route>
          {/* You can also add a 404 Not Found page */}
          <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
        </Routes>

      </ThemeProvider>

    </>
  )
}

export default App
