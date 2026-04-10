import { Pokemon, PokemonsResponse } from '..';
import { Metadata } from "next";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { cache } from 'react';

interface Props {
  params: Promise<{ name: string }>; 
}

export async function generateStaticParams() {

    const data: PokemonsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${151}`)
        .then(res => res.json());

    const static151Pokemons = data.results.map(pokemon => ({
      name: pokemon.name
    }))

    return static151Pokemons.map( id => ({
      name: name,
    }));
}

// ✅ Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {

  try {
    const { name } = await params; 

    const pokemon = await getPokemon(name);

    return {
      title: `#${ pokemon.id } - ${ pokemon.name }`,
      description: `Página del pokémon ${ pokemon.name }`
    };

  } catch (error) {
    return {
      title: 'Página del pokémon',
      description: 'Error al cargar el pokémon'
    };
  }
}


// ✅ Fetch optimizado + cache compartido
const getPokemon = cache(async (name: string): Promise<Pokemon> => {

  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${ name }`, {
    cache: 'force-cache'
  });

  // 🔥 Validación real
  if (!resp.ok) {
    notFound();
  }

  const pokemon: Pokemon = await resp.json();

  return pokemon;
});


// ✅ Página
export default async function PokemonPage({ params }: Props) {

  const { name } = await params; // 👈 FIX
  const pokemon = await getPokemon(name);

  return (
    <div className="flex mt-5 flex-col items-center text-slate-800">
      <div className="relative flex flex-col items-center rounded-[20px] mx-auto bg-white bg-clip-border shadow-lg p-3">

        <div className="mt-2 mb-8 w-full">
          <h1 className="px-2 text-xl font-bold text-slate-700 capitalize">
            #{pokemon.id} {pokemon.name}
          </h1>

          <div className="flex flex-col justify-center items-center">
            <Image
              src={pokemon.sprites.other?.dream_world.front_default ?? ''}
              width={150}
              height={150}
              alt={`Imagen del pokemon ${pokemon.name}`}
              className="mb-5"
            />

            <div className="flex flex-wrap">
              {
                pokemon.moves.map(move => (
                  <p key={move.move.name} className="mr-2 capitalize">
                    {move.move.name}
                  </p>
                ))
              }
            </div>
          </div>
        </div>


        <div className="grid grid-cols-2 gap-4 px-2 w-full">

          {/* Types */}
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Types</p>
            <div className="text-base font-medium flex">
              {
                pokemon.types.map(type => (
                  <p key={type.slot} className="mr-2 capitalize">
                    {type.type.name}
                  </p>
                ))
              }
            </div>
          </div>

          {/* Peso */}
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Peso</p>
            <span className="text-base font-medium">
              {pokemon.weight}
            </span>
          </div>

          {/* Sprites normales */}
          <div className="flex flex-col justify-center rounded-2xl bg-white px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Regular Sprites</p>
            <div className="flex justify-center">
              <Image src={pokemon.sprites.front_default} width={100} height={100} alt="front" />
              <Image src={pokemon.sprites.back_default} width={100} height={100} alt="back" />
            </div>
          </div>

          {/* Sprites shiny */}
          <div className="flex flex-col justify-center rounded-2xl bg-white px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Shiny Sprites</p>
            <div className="flex justify-center">
              <Image src={pokemon.sprites.front_shiny} width={100} height={100} alt="shiny front" />
              <Image src={pokemon.sprites.back_shiny} width={100} height={100} alt="shiny back" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}