import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { getPokemonDetails, getPokemonSpecies } from '../services/api'
import Button from '../components/Button'

const DetailPageContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Card = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border: 1px solid ${(props) => props.theme.cardBorder};
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const PokemonImage = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 15px;
`;

const PokemonName = styled.h2`
  text-transform: capitalize;
  color: ${(props) => props.theme.text};
  margin-bottom: 15px;
`;

const InfoSection = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const InfoItem = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${(props) => props.theme.text};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.cardBorder};
  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
`;

const ListItem = styled.li`
  margin-bottom: 5px;
  text-transform: capitalize;
  font-size: 0.95rem;
  color: ${(props) => props.theme.text};
`;

const AbilityDescription = styled.p`
  font-size: 0.85rem;
  color: ${(props) => props.theme.text};
  margin-left: 10px;
  font-style: italic;
`;

const Details = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true)
      setError(null)
      try {
        const details = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        const species = await getPokemonSpecies(id)

        // Buscar descrições das habilidades
        const abilitiesWithDescription = await Promise.all(
          details.abilities.map(async (abilityData) => {
            const abilityResponse = await getPokemonDetails(abilityData.ability.url)
            const descriptionEntry = abilityResponse.effect_entries.find(
              (entry) => entry.language.name === 'en'
            )
            return {
              name: abilityData.ability.name,
              description: descriptionEntry ? descriptionEntry.effect : 'No description available.',
            }
          })
        )

        setPokemon({
          id: details.id,
          name: details.name,
          image: details.sprites.front_default,
          moves: details.moves.map((m) => m.move.name),
          abilities: abilitiesWithDescription,
          types: details.types.map((t) => t.type.name),
          description: species.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
          )?.flavor_text || 'No description available.',
        })
      } catch (err) {
        console.error('Erro ao buscar detalhes do Pokémon:', err)
        setError('Não foi possível carregar os detalhes do Pokémon.')
      } finally {
        setLoading(false)
      }
    }

    fetchPokemonData()
  }, [id])

  if (loading) return <DetailPageContainer>Carregando detalhes...</DetailPageContainer>;
  if (error) return <DetailPageContainer style={{ color: 'red' }}>{error}</DetailPageContainer>;
  if (!pokemon) return <DetailPageContainer>Pokémon não encontrado.</DetailPageContainer>;

  return (
    <DetailPageContainer>
      <Card>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonName>{pokemon.name}</PokemonName>
        <InfoItem>ID: #{pokemon.id}</InfoItem>
        <InfoItem>Tipo(s): {pokemon.types.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}</InfoItem>

        <InfoSection>
          <InfoItem>Descrição:</InfoItem>
          <p>{pokemon.description}</p>
        </InfoSection>

        <InfoSection>
          <InfoItem>Movimentos:</InfoItem>
          <List>
            {pokemon.moves.map((move, index) => (
              <ListItem key={index}>{move}</ListItem>
            ))}
          </List>
        </InfoSection>

        <InfoSection>
          <InfoItem>Habilidades:</InfoItem>
          <List>
            {pokemon.abilities.map((ability, index) => (
              <ListItem key={index}>
                {ability.name}
                {ability.description && <AbilityDescription>{ability.description}</AbilityDescription>}
              </ListItem>
            ))}
          </List>
        </InfoSection>
      </Card>
      <Link to="/">
        <Button>Voltar para a lista</Button>
      </Link>
    </DetailPageContainer>
  )
}

export default Details