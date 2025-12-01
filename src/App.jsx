import { useState, useEffect } from "react";
import CustomSpinner from "./CustomSpinner";
import PokemonCard from "./PokemonCard";
import PokemonModal from "./PokemonModal";
import './App.css';

function App() {
  // Lista dos 151 Pokémon
  const [pokemon, setPokemon] = useState([]);

  // Texto digitado na busca
  const [search, setSearch] = useState("");

  // Pokémon selecionado para abrir o modal
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Detalhes completos do Pokémon atual
  const [details, setDetails] = useState(null);

  // Controle do loading inicial
  const [isLoading, setIsLoading] = useState(true);


  // Faz o fetch inicial da lista dos 151 Pokémon
  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await res.json();

        // Adiciona o ID manualmente (index + 1)
        const pokemonWithId = data.results.map((p, index) => ({
          ...p,
          id: index + 1,
        }));

        setPokemon(pokemonWithId);

      } catch (error) {
        console.error(error);

      } finally {
        // Finaliza o loading de qualquer jeito
        setIsLoading(false);
      }
    }

    fetchPokemon();
  }, []);


  // Busca detalhes do Pokémon selecionado sempre que selectedPokemon mudar
  useEffect(() => {
    if (!selectedPokemon) return;

    // Enquanto carrega, detalhes ficam null
    setDetails(null);

    async function fetchDetails() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon.id}`);
        const data = await res.json();

        setDetails(data);

      } catch (error) {
        console.error(error);
      }
    }

    fetchDetails();
  }, [selectedPokemon]);


  // Pokémon filtrados pela barra de busca
  const filtered = pokemon.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );


  // Função que retorna a cor baseada no tipo do Pokémon
  const typeColor = (type) => {
    const colors = {
      normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
      grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
      ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
      rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
      steel: "#B7B7CE", fairy: "#D685AD",
    };

    // Retorna cinza se tipo não existir
    return colors[type] || "#777";
  };


  return (
    <div className="app">

      {/* Topbar: Título + Barra de Busca */}
      <div className="topbar">
        <div className="title">
          <div className="pokeb">P</div>
          <h1>Pokédex</h1>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {/* Grade de Pokémon */}
      <div className="gridwrap">

        {isLoading ? (
          // Enquanto carrega a lista
          <CustomSpinner size={36} color="#ffcc00" />

        ) : filtered.length === 0 ? (
          // Se nenhuma busca encontrar resultados
          <div>Nenhum Pokémon encontrado.</div>

        ) : (
          // Renderiza os cards
          filtered.map(p => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              onClick={setSelectedPokemon}
              typeColor={typeColor}
            />
          ))
        )}

      </div>


      {/* Modal (somente se tiver um Pokémon selecionado) */}
      {selectedPokemon && (
        <PokemonModal
          selectedPokemon={selectedPokemon}
          details={details}
          onClose={() => setSelectedPokemon(null)}
          typeColor={typeColor}
          allPokemon={pokemon} // lista completa para achar evoluções
          onSelectPokemon={(name) => {
            // Permite clicar numa evolução e abrir o modal dela
            const poke = pokemon.find(p => p.name === name);
            if (poke) setSelectedPokemon(poke);
          }}
        />
      )}

    </div>
  );
}

export default App;
