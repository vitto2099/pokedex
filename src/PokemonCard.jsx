import CustomSpinner from "./CustomSpinner";
import './Card.css';

const PokemonCard = ({ pokemon, onClick, typeColor }) => (
  <div
    className="card"
    // seta um "hue" baseado no ID para gerar a cor do card
    style={{ "--hue": `${pokemon.id * 10}` }}
    // clica no card → abre modal
    onClick={() => onClick(pokemon)}
  >
    <div className="card-top">
      {/* Número do Pokémon com 3 dígitos */}
      <span className="id">#{String(pokemon.id).padStart(3, '0')}</span>

      {/* Imagem dentro do círculo */}
      <div className="thumbwrap">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          alt={pokemon.name}

          // fallback caso a imagem oficial dê erro
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/78x78/A8A77A/fff?text=${pokemon.id}`;
          }}
        />
      </div>
    </div>

    {/* Nome do Pokémon */}
    <div className="name">{pokemon.name}</div>
  </div>
);

export default PokemonCard;
