import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif
    background-color: ${(props) => props.theme.background}
    color: ${(props) => props.theme.text}
     transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    min-height: 100vh; 
  }
`;
