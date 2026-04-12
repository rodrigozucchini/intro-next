import { PokemonsResponse } from "./interfaces/pokemons-response";
import { SimplePokemon } from "./interfaces/simple-pokemons";
import { PokemonGrid } from "./interfaces/components/PokemonGrid";
import { cacheTag, revalidateTag } from "next/cache";

const getPokemons = async( limit= 20, offset= 0 ):Promise<SimplePokemon[]> => {
    const data: PokemonsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then(res => res.json());

    const pokemons = data.results.map(pokemon => ({
      id: pokemon.url.split('/').at(-2)!,
      name: pokemon.name
    }))

    return pokemons;
}

export default async function PokemonsPage() {
  'use cache';

  cacheTag('pokemons');
  revalidateTag('pokemons', 'max');

  const pokemons = await getPokemons(151);

  return (
    <div className="flex flex-col">

      <span className="text-5xl my-2">Listado de Pokemons</span>

      <div className="flex flex-wrap gap-10 items-center justify-center">
      <PokemonGrid pokemons={pokemons}/>
      </div>
    </div>
  );
}