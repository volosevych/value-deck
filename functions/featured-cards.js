const axios = require('axios');
require('dotenv').config({ path: './.env' });


// Helper to fetch Pokémon card data from TCG API
const fetchPokemonCardData = async (query) => {
  try {
    console.log(`Fetching Pokémon card data for query: ${query}`);
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: {
        'X-Api-Key': process.env.POKEMON_API_KEY,
      },
      params: {
        q: query,
        pageSize: 10,
      },
    });

    if (!response.data || !response.data.data) {
      console.warn('No data returned from TCG API.');
      return [];
    }

    return response.data.data.map((card) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images?.small || '',
      set: card.set?.name || 'Unknown',
      rarity: card.rarity || 'Unknown',
      prices: card.cardmarket?.prices?.averageSellPrice || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching Pokémon card data:', error.response?.data || error.message);
    throw new Error('Failed to fetch Pokémon card data.');
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const featuredCardNames = ['Charizard', 'Pikachu', 'Blue Eyes White Dragon'];
    console.log('Fetching featured cards...');
    const promises = featuredCardNames.map((name) =>
      fetchPokemonCardData(`name:"${name}"`)
    );

    const results = await Promise.allSettled(promises);

    const featuredCards = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .flat();

    return {
      statusCode: 200,
      body: JSON.stringify(featuredCards),
    };
  } catch (error) {
    console.error('Error fetching featured cards:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
