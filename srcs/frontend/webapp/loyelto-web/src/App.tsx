
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LandingPage from './landing/LandingPage'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from '@mui/material'
import FormAndSteps from './form_business/FormAndSteps'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: 'form-business',
    element: <FormAndSteps />
  }
]);

function App() {
  return (
    <>
    
      <ThemeProvider theme={theme} defaultMode='light'>
      <RouterProvider router={router} />
        {/* <CssBaseline /> */}
        {/* <LandingPage /> */}
      </ThemeProvider>
    </>
  )
}

export default App
