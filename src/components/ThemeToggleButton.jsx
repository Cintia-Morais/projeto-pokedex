import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'

const Button = styled.button`
  background: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.buttonText};
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

const ThemeToggleButton = () => {
  const { themeName, toggleTheme } = useTheme()
  return (
    <Button onClick={toggleTheme}>
      {themeName === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
    </Button>
  )
}

export default ThemeToggleButton