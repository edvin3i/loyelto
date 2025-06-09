import './App.css'
import LandingPage from './landing/LandingPage'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from '@mui/material'
import './i18n'
import BusinessMain from './business-app/BusinessMain'
import ClientPage from './business-app/ClientPage'

function App() {
  return (
    <>
      <ThemeProvider theme={theme} defaultMode='light'>
        {/* <CssBaseline /> */}
        {/* <LandingPage /> */}
        {/* <BusinessMain /> */}
        <ClientPage />
      </ThemeProvider>
    </>
  )
}

export default App
