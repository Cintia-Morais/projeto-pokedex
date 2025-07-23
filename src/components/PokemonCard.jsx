import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Card = styled(Link)`
  background: ${(props) => props.theme.cardBackground};
  border: 1px solid ${(props) => props.theme.cardBorder};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }

  h3 {
    margin: 0;
    text-transform: capitalize;
    font-size: 1.1rem;
  }
`;

const PokemonCard = ({ id, name, image }) => {
  return (
    <Card to={`/pokemon/${id}`}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
    </Card>
  )
}

export default PokemonCard