import './App.css'
import LandingPage from './landing/LandingPage'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from '@mui/material'
import './i18n'

function App() {
  return (
    <>
      <ThemeProvider theme={theme} defaultMode='light'>
        {/* <CssBaseline /> */}
        <LandingPage />
      </ThemeProvider>
    </>
  )
}

export default App
