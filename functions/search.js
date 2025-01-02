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
      console.warn(`No data returned from TCG API for query: ${query}`);
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
    console.error(`Error fetching Pokémon card data for query "${query}":`, {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status',
    });

    // Return an empty array to allow the rest of the process to continue
    return [];
  }
};

// Helper to fetch eBay card data
const fetchEbayCardData = async (query) => {
  const EBAY_BASE_URL = 'https://api.sandbox.ebay.com/buy/browse/v1';

  try {
    console.log(`Fetching eBay data for query: ${query}`);

    if (!process.env.EBAY_SANDBOX_APP_ID || !process.env.EBAY_SANDBOX_CERT_ID) {
      throw new Error('eBay API credentials are not defined in environment variables.');
    }

    // Generate OAuth token for eBay API
    const tokenResponse = await axios.post(
      'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.EBAY_SANDBOX_APP_ID}:${process.env.EBAY_SANDBOX_CERT_ID}`
          ).toString('base64')}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('Successfully generated eBay OAuth token.');

    // Fetch eBay item summaries
    const response = await axios.get(`${EBAY_BASE_URL}/item_summary/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        limit: 10,
      },
    });

    if (!response.data || !response.data.itemSummaries) {
      console.warn(`No data returned from eBay API for query: ${query}`);
      return [];
    }

    return response.data.itemSummaries.map((item) => ({
      id: item.itemId,
      title: item.title || 'Unknown',
      price: item.price?.value ? `${item.price.value} ${item.price.currency}` : 'N/A',
      imageUrl: item.image?.imageUrl || 'https://via.placeholder.com/150',
      link: item.itemWebUrl || '#',
    }));
  } catch (error) {
    console.error(`Error fetching eBay card data for query "${query}":`, {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status',
    });

    // Return mock data as a fallback for eBay queries
    return [
      {
        id: 'mock-1',
        title: 'Mock Card 1',
        price: '20.00 USD',
        imageUrl: 'https://via.placeholder.com/150',
        link: 'https://www.ebay.com',
      },
      {
        id: 'mock-2',
        title: 'Mock Card 2',
        price: '15.00 USD',
        imageUrl: 'https://via.placeholder.com/150',
        link: 'https://www.ebay.com',
      },
    ];
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

  // Extract the query parameter
  const query = event.queryStringParameters?.query;

  if (!query) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Query parameter is required' }),
    };
  }

  try {
    console.log(`Searching for cards with query: ${query}`);
    const tcgResults = await fetchPokemonCardData(`name:"${query}"`);
    const ebayResults = await fetchEbayCardData(query);

    const results = [...tcgResults, ...ebayResults];

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error(`Error processing search for query "${query}":`, error.message);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
