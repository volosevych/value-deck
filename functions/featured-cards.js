const axios = require('axios');

// Helper to fetch Pokémon card data from TCG API
const fetchPokemonCardData = async () => {
  try {
    console.log('Fetching Pokémon card data...');

    if (!process.env.POKEMON_API_KEY) {
      throw new Error('POKEMON_API_KEY is not defined in environment variables.');
    }

    // Fetch a larger batch of cards to choose featured ones
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: {
        'X-Api-Key': process.env.POKEMON_API_KEY,
      },
      params: {
        pageSize: 100, // Fetch a larger batch of cards
      },
    });

    if (!response.data || !response.data.data) {
      console.warn('No data returned from TCG API.');
      return []; // Return empty array if no data is found
    }

    // Map the data to simplify the structure
    return response.data.data.map((card) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images?.small || '',
      set: card.set?.name || 'Unknown',
      rarity: card.rarity || 'Unknown',
      prices: card.cardmarket?.prices?.averageSellPrice || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching data from TCG API:', error.response?.data || error.message);
    return []; // Return empty array on error to continue processing
  }
};

// Handler function to return three random featured cards
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    console.log('Fetching and selecting featured cards...');

    // Fetch cards from TCG API
    const cards = await fetchPokemonCardData();

    if (cards.length === 0) {
      console.warn('No cards available for selection.');
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No cards found.' }),
      };
    }

    // Randomly select 3 cards as featured cards
    const featuredCards = cards.sort(() => 0.5 - Math.random()).slice(0, 3);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(featuredCards),
    };
  } catch (error) {
    console.error('Error processing featured cards:', error.message);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
