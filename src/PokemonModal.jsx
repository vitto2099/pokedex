import { useState, useEffect } from "react";
import CustomSpinner from "./CustomSpinner";
import './Modal.css';

const PokemonModal = ({
  selectedPokemon,  // Pokémon atual
  details,          // dados completos do Pokémon
  onClose,          // fechar modal
  typeColor,        // função que devolve cor do tipo
  allPokemon,       // lista com os 151 Pokémon
  onSelectPokemon,  // função para abrir evolução
}) => {

  // lista com as evoluções (nomes)
  const [evolutions, setEvolutions] = useState([]);

  // controla se sprite shiny é exibida
  const [shiny, setShiny] = useState(false);


  // Busca cadeia de evolução sempre que "details" mudar
  useEffect(() => {
    if (!details) return;

    async function fetchEvolutions() {
      try {
        // Primeiro: pega species para achar link da cadeia
        const speciesRes = await fetch(details.species.url);
        const speciesData = await speciesRes.json();

        // Segundo: pega cadeia de evolução
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const evoChain = [];
        let evo = evoData.chain;

        // Loop percorre a cadeia até acabar
        do {
          evoChain.push(evo.species.name);
          evo = evo.evolves_to[0];
        } while (evo);

        setEvolutions(evoChain);

      } catch (err) {
        console.error(err);
        setEvolutions([]);
      }
    }

    fetchEvolutions();
  }, [details]);


  // Descobre o ID do Pokémon pelo nome
  const getPokemonId = (name) => {
    const poke = allPokemon.find(p => p.name === name);
    return poke ? poke.id : null;
  };


  // Sprite normal / shiny
  const spriteUrl = shiny
    ? details?.sprites?.front_shiny
    : details?.sprites?.front_default;


  // Caso details ainda não tenha carregado
  if (!details) {
    return (
      <div className="modalback" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <CustomSpinner size={40} color="#6390F0" />
          <div style={{ marginTop: '15px', color:'#fff' }}>
            Carregando detalhes...
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="modalback" onClick={onClose}>
      {/* Impede fechar ao clicar dentro do modal */}
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ overflowY:'auto', maxHeight:'90vh', padding:'24px' }}>
        
        {/* Botão fechar */}
        <button className="closebtn" onClick={onClose}>×</button>

        {/* Nome e número */}
        <h2 style={{ color:'#ffcc00', fontSize:'32px', textTransform:'capitalize' }}>
          {selectedPokemon.name}
          <span style={{ fontSize:'18px', color:'#94a3b8' }}>
            #{String(selectedPokemon.id).padStart(3,'0')}
          </span>
        </h2>

        {/* Toggle shiny */}
        <button
          onClick={() => setShiny(!shiny)}
          style={{ padding:'6px 12px', borderRadius:'12px', background:'#ffcc00', border:'none' }}
        >
          {shiny ? "Normal" : "Shiny"}
        </button>

        {/* SPRITE */}
        <div className="modal-sprite">
          <img src={spriteUrl} alt={selectedPokemon.name} />
        </div>

        {/* TIPOS */}
        <h3>Tipos</h3>
        <div style={{ display:"flex", gap:"10px" }}>
          {details.types.map(t => (
            <span
              key={t.type.name}
              style={{
                background: typeColor(t.type.name),
                padding:"6px 10px",
                borderRadius:"8px",
                color:"#000",
                textTransform:"capitalize",
                fontWeight:"700"
              }}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* ALTURA E PESO */}
        <h3 style={{ marginTop:"20px" }}>Informações</h3>
        <p>Altura: {details.height / 10} m</p>
        <p>Peso: {details.weight / 10} kg</p>

        {/* STATS */}
        <h3 style={{ marginTop:"20px" }}>Status Base</h3>
        {details.stats.map(s => (
          <div key={s.stat.name} style={{ marginBottom:"10px" }}>
            <strong style={{ textTransform:"capitalize" }}>{s.stat.name}:</strong>
            <div style={{ 
              height:"8px",
              background:"#222",
              borderRadius:"6px",
              overflow:"hidden",
              marginTop:"4px"
            }}>
              <div
                style={{
                  width:`${Math.min((s.base_stat/150)*100,100)}%`,
                  height:"100%",
                  background:"#ffcc00"
                }}
              />
            </div>
          </div>
        ))}

        {/* EVOLUÇÕES */}
        <h3 style={{ marginTop:"20px" }}>Evoluções</h3>
        <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
          {evolutions.map(name => {
            const id = getPokemonId(name);
            return (
              <div
                key={name}
                style={{ cursor:"pointer", textAlign:"center" }}
                onClick={() => onSelectPokemon(name)}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                  style={{ width:"90px" }}
                />
                <div style={{ textTransform:"capitalize", marginTop:"4px" }}>{name}</div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PokemonModal;
