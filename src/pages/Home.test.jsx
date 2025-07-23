import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CustomThemeProvider } from '../context/ThemeContext';
import Home from './Home';
import * as api from '../services/api';


jest.mock('../services/api', () => ({
  ...jest.requireActual('../services/api'), 
  
  getPokemons: jest.fn((offset, limit) => {
    const mockResults = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
      { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
      { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
      { name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon/8/' },
      { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/' },
      { name: 'caterpie', url: 'https://pokeapi.co/api/v2/pokemon/10/' },
      { name: 'metapod', url: 'https://pokeapi.co/api/v2/pokemon/11/' },
      { name: 'butterfree', url: 'https://pokeapi.co/api/v2/pokemon/12/' },
    ];
    return Promise.resolve({
      results: mockResults.slice(offset, offset + limit),
      next: offset + limit < mockResults.length ? `next-page-url?offset=${offset + limit}` : null,
    });
  }),

  getPokemonDetails: jest.fn((url) => {
    const pokemonId = url.split('/').filter(Boolean).pop();
    const details = {
      '1': { id: 1, name: 'bulbasaur', sprites: { front_default: 'bulbasaur.png' } },
      '2': { id: 2, name: 'ivysaur', sprites: { front_default: 'ivysaur.png' } },
      '3': { id: 3, name: 'venusaur', sprites: { front_default: 'venusaur.png' } },
      '4': { id: 4, name: 'charmander', sprites: { front_default: 'charmander.png' } },
      '5': { id: 5, name: 'charmeleon', sprites: { front_default: 'charmeleon.png' } },
      '6': { id: 6, name: 'charizard', sprites: { front_default: 'charizard.png' } },
      '7': { id: 7, name: 'squirtle', sprites: { front_default: 'squirtle.png' } },
      '8': { id: 8, name: 'wartortle', sprites: { front_default: 'wartortle.png' } },
      '9': { id: 9, name: 'blastoise', sprites: { front_default: 'blastoise.png' } },
      '10': { id: 10, name: 'caterpie', sprites: { front_default: 'caterpie.png' } },
      '11': { id: 11, name: 'metapod', sprites: { front_default: 'metapod.png' } },
      '12': { id: 12, name: 'butterfree', sprites: { front_default: 'butterfree.png' } },
    };
  
    return Promise.resolve(details[pokemonId] || null); 
  }),

  getPokemonTypes: jest.fn(() => Promise.resolve({
    results: [
      { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
      { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
      { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
      { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
    ],
  })),

  getPokemonsByType: jest.fn((typeUrl) => {
    const typeName = typeUrl.split('/').filter(Boolean).pop();
    const typePokemons = {
      'fire': [
        { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
      ],
      'grass': [
        { pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
        { pokemon: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' } },
      ],
    };
    return Promise.resolve({
      pokemon: typePokemons[typeName] || [],
    });
  }),
}));


describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Home page with title and initial pokemons', async () => {
    render(
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /pokedex/i })).toBeInTheDocument();

    await waitFor(() => {
    
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/caterpie/i)).toBeInTheDocument();
    });

    expect(api.getPokemons).toHaveBeenCalledTimes(1);
    expect(api.getPokemons).toHaveBeenCalledWith(0, 10);

    expect(api.getPokemonDetails).toHaveBeenCalledTimes(10);
  });

  test('should load more pokemons when "Carregar Mais" button is clicked', async () => {
    render(
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/caterpie/i)).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', { name: /carregar mais/i });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText(/metapod/i)).toBeInTheDocument();
      expect(screen.getByText(/butterfree/i)).toBeInTheDocument();
    });

    expect(api.getPokemons).toHaveBeenCalledTimes(2);
    expect(api.getPokemons).toHaveBeenCalledWith(10, 10);

    expect(api.getPokemonDetails).toHaveBeenCalledTimes(12);
  });

  test('should filter pokemons by type', async () => {
    render(
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filtrar por tipo:/i)).toBeInTheDocument();
    });

    const typeFilter = screen.getByLabelText(/filtrar por tipo:/i);
    fireEvent.change(typeFilter, { target: { value: 'fire' } });

    await waitFor(() => {
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
      expect(screen.getByText(/charmeleon/i)).toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    });

    expect(api.getPokemonsByType).toHaveBeenCalledTimes(1);
    expect(api.getPokemonsByType).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
    
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument();
  });

  test('should toggle theme when button is clicked', async () => {
    render(
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    );

    const themeToggleButton = screen.getByRole('button', { name: /mudar para tema escuro/i });
    expect(themeToggleButton).toBeInTheDocument();

    fireEvent.click(themeToggleButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /mudar para tema claro/i })).toBeInTheDocument();
    });

    fireEvent.click(themeToggleButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /mudar para tema escuro/i })).toBeInTheDocument();
    });
  });

  test('should display "Carregando..." when fetching data', async () => {
   
    api.getPokemons.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <CustomThemeProvider>
          <Home />
        </CustomThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/carregando.../i)).toBeInTheDocument();
  });
});