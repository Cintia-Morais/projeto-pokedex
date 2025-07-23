import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
})

export const getPokemons = async (offset = 0, limit = 10) => {
  const response = await api.get(`pokemon?offset=${offset}&limit=${limit}`)
  return response.data
}

export const getPokemonDetails = async (url) => {
  const response = await axios.get(url)
  return response.data
}

export const getPokemonSpecies = async (id) => {
  const response = await api.get(`pokemon-species/${id}/`)
  return response.data
}

export const getPokemonTypes = async () => {
  const response = await api.get('type')
  return response.data
}

export const getPokemonsByType = async (typeUrl) => {
  const response = await axios.get(typeUrl)
  return response.data
}