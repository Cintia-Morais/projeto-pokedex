import React, { createContext, useState, useContext, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../styles/themes'
import { GlobalStyle } from '../styles/global'

const ThemeContext = createContext()

export const CustomThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' ? darkTheme : lightTheme
  })

  const [themeName, setThemeName] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', themeName)
  }, [themeName])

  const toggleTheme = () => {
    if (themeName === 'light') {
      setTheme(darkTheme)
      setThemeName('dark')
    } else {
      setTheme(lightTheme)
      setThemeName('light')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)