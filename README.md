# Pokédex - Projeto Intro React

## Rodando localmente
```bash
npm create vite@latest pokedex -- --template react
cd pokedex
npm install
npm run dev

📂 Estrutura do Projeto
src/
│ App.jsx            # Estado global, fetch inicial e lógica principal
│ PokemonCard.jsx    # Componente de card individual da lista
│ PokemonModal.jsx   # Modal com detalhes + cadeia de evolução
│ CustomSpinner.jsx  # Componente de loading
│ *.css              # Arquivos de estilos

🌐 API utilizada

PokéAPI:
https://pokeapi.co

Rotas úteis:

https://pokeapi.co/api/v2/pokemon?limit=151

https://pokeapi.co/api/v2/pokemon/{id}

Para ver evoluções:
Clique em um Pokémon para abrir o modal com os detalhes e cadeia evolutiva.

🧠 Conceitos React utilizados

useState — controla lista, loading, e Pokémon selecionado

useEffect — faz o fetch inicial da PokéAPI

Props — enviadas para PokemonCard, PokemonModal e CustomSpinner