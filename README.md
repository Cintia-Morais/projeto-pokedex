# React + Vite

# 📘 Projeto Pokédex - React

Oi! Eu criei essa Pokédex como exercício de React. O objetivo era consumir a API do PokéAPI e praticar conceitos como rotas, componentes, contextos e temas. Eu fui aprendendo e aplicando tudo aos poucos, então o projeto foi sendo montado com calma e atenção. 😊

---

## 🧠 O que a Pokédex faz

- Mostra 10 Pokémons por vez, puxando da [PokéAPI](https://pokeapi.co/)
- Botão “Carregar mais” pra ver mais pokémons
- Ao clicar em um pokémon, aparece uma página de detalhes com:
  - Imagem
  - Nome
  - Tipo
  - Movimentos
  - Habilidades com descrição
- Campo de filtro por tipo de pokémon
- Tema claro e escuro com botão de alternância
- Estilo feito com styled-components

---

## 🛠️ Tecnologias usadas

- React (SPA)
- React Router DOM (rotas)
- Axios (requisições para a API)
- Context API (tema claro/escuro)
- Styled-components (estilização)
- Jest + React Testing Library (testes)
- Vite (para rodar o projeto)

---

## 🗂 Estrutura básica do projeto

src/
├── App.jsx                # Rotas principais
├── main.jsx               # Entrada da aplicação
├── pages/                 # Home e Details
├── components/            # Card do Pokémon, botão, etc
├── context/               # Contexto do tema
├── styles/                # Estilos e temas globais
├── services/              # Arquivo com chamada para a API
├── setupTests.js          # Configuração para testes

---

## ▶️ Como rodar o projeto

1. Clone o repositório:

git clone https://github.com/seu-usuario/seu-repositorio.git

2. Acesse a pasta:
cd pokedex-app

3. Instale as dependências:
npm install

4. Rode o projeto:
npm run dev

> A aplicação vai rodar em: `http://localhost:5173/`

---

## 🧪 Como rodar os testes

npm test

---

