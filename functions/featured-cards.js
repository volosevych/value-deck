const axios = require('axios');

// Helper to fetch Pokémon card data from TCG API
const fetchPokemonCardData = async (query) => {
  try {
    console.log(`Fetching Pokémon card data for query: ${query}`);

    // Ensure the API key is available
    if (!process.env.POKEMON_API_KEY) {
      throw new Error('POKEMON_API_KEY is not defined in environment variables.');
    }

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
  // Allow only GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }, // CORS Header
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const featuredCardNames = ['Charizard', 'Pikachu', 'Blue Eyes White Dragon'];
    console.log('Fetching featured cards...');

    // Fetch data for each card
    const promises = featuredCardNames.map((name) =>
      fetchPokemonCardData(`name:"${name}"`)
    );

    const results = await Promise.allSettled(promises);

    // Handle fulfilled and rejected promises
    const featuredCards = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .flat();

    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);

    if (errors.length > 0) {
      console.warn('Some API requests failed:', errors);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }, // CORS Header
      body: JSON.stringify(featuredCards),
    };
  } catch (error) {
    console.error('Error fetching featured cards:', error.message);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }, // CORS Header
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
