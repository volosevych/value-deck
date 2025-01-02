const axios = require('axios');

// Helper to fetch Pokémon card data from TCG API
const fetchPokemonCardData = async (query) => {
  try {
    console.log(`Fetching Pokémon card data for query: ${query}`);

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
      console.warn(`No data returned for query: ${query}`);
      return []; // Return empty array if no data is found
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
    console.error(`Error fetching data for query "${query}":`, error.response?.data || error.message);
    return []; // Return empty array on error to continue processing
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const featuredCardNames = ['Charizard', 'Pikachu', 'Blue Eyes White Dragon']; // Adjusted to highlight issue with invalid names
    console.log('Fetching featured cards...');

    // Fetch data for each card
    const promises = featuredCardNames.map((name) =>
      fetchPokemonCardData(`name:"${name}"`)
    );

    const results = await Promise.all(promises);

    // Flatten results and filter out empty arrays
    const featuredCards = results.flat().filter((card) => card && card.name);

    if (featuredCards.length === 0) {
      console.warn('No featured cards found.');
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(featuredCards),
    };
  } catch (error) {
    console.error('Error fetching featured cards:', error.message);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
