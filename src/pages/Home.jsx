import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { getPokemons, getPokemonTypes, getPokemonsByType, getPokemonDetails } from '../services/api'
import PokemonCard from '../components/PokemonCard'
import Button from '../components/Button'
import ThemeToggleButton from '../components/ThemeToggleButton'

const HomePageContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const Grid = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  justify-content: center;
  list-style: none;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  label {
    margin-right: 10px;
    font-size: 1.1rem;
  }
  select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.cardBorder};
    background-color: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.text};
  }
`;

const Home = () => {
  const [pokemons, setPokemons] = useState([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const LIMIT = 10

  const getDetailedPokemons = useCallback(async (pokemonList) => {
    const results = await Promise.allSettled(
      pokemonList.map(async ({ url }) => {
        try {
          const data = await getPokemonDetails(url)

          if (!data || !data.id || !data.name || !data.sprites || !data.sprites.front_default) {
            console.warn(`Dados incompletos ou nulos para o Pokémon na URL: ${url}`, data);
            return null
          }

          return {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
          }
        } catch (error) {
          console.error(`Erro ao buscar detalhes do Pokémon na URL: ${url}`, error)
          return null;
        }
      })
    )

    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value)
  }, [])


  const fetchPokemons = useCallback(async (currentOffset = 0, currentSelectedType = 'all', append = false) => {
    setLoading(true)
    try {
      let fetchedPokemons = []
      if (currentSelectedType === 'all') {
        const data = await getPokemons(currentOffset, LIMIT)
        if (data && data.results) { 
          fetchedPokemons = await getDetailedPokemons(data.results)
        } else {
            console.warn("Resposta de getPokemons vazia ou sem 'results'.", data)
        }
      } else {
        const data = await getPokemonsByType(`https://pokeapi.co/api/v2/type/${currentSelectedType}`)
        if (data && data.pokemon) { 
        
          const filteredPokemonsUrls = data.pokemon.slice(0, 20).map((p) => p.pokemon)
          fetchedPokemons = await getDetailedPokemons(filteredPokemonsUrls)
        } else {
            console.warn("Resposta de getPokemonsByType vazia ou sem 'pokemon'.", data)
        }
      }

      setPokemons((prev) => (append ? [...prev, ...fetchedPokemons] : fetchedPokemons))
    } catch (error) {
      console.error('Erro geral ao carregar pokemons na Home:', error)
    } finally {
      setLoading(false)
    }
  }, [getDetailedPokemons]) 

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await getPokemonTypes()
        setTypes(data.results)
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    }
    loadTypes()
  }, [])

  useEffect(() => {
    setPokemons([])
    setOffset(0)
    fetchPokemons(0, selectedType, false)
  }, [selectedType, fetchPokemons])

  useEffect(() => {
    if (selectedType === 'all' && offset > 0) { 
      fetchPokemons(offset, selectedType, true)
    }
  }, [offset, selectedType, fetchPokemons])

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value)
  }

  const handleLoadMore = () => {
    setOffset((prev) => prev + LIMIT)
  }

  return (
    <HomePageContainer>
      <Header>
        <h1 style={{ textAlign: 'center' }}>Pokedex</h1>
        <ThemeToggleButton />
      </Header>

      <FilterContainer>
        <label htmlFor='type-filter'>Filtrar por tipo: </label>
        <select id='type-filter' value={selectedType} onChange={handleTypeChange}>
          <option value='all'>Todos</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
      </FilterContainer>

      <Grid>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} {...pokemon} />
        ))}
      </Grid>

      {selectedType === 'all' && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Carregando...' : 'Carregar Mais'}
          </Button>
        </div>
      )}
    </HomePageContainer>
  )
}

export default Home