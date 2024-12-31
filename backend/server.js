const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Configure CORS for local testing
app.use(cors({
  origin: ['https://value-deck.netlify.app', 'http://localhost:3000'], // Adjust frontend port if necessary
  credentials: true,
}));

app.use(express.json()); // To parse JSON requests

// Fetch card data from TCG API
const fetchPokemonCardData = async (query) => {
  try {
    console.log('Sending request to TCG API with query:', query);
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
      console.warn('No data returned from TCG API');
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
    console.error('Error fetching card data from TCG API:', error.response?.data || error.message);
    throw new Error('Failed to fetch card data from TCG API');
  }
};

// Fetch card data from eBay API
const fetchEbayCardData = async (query) => {
  const EBAY_BASE_URL = 'https://api.sandbox.ebay.com/buy/browse/v1';

  try {
    console.log('Sending request to eBay API with query:', query);

    // Get OAuth token for eBay
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

    // Fetch eBay item data
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
      console.warn('No data returned from eBay API. Returning mock data for testing.');
      return [
        {
          id: 'mock-1',
          title: 'Mock Card 1',
          price: '20.00',
          currency: 'USD',
          imageUrl: 'https://via.placeholder.com/150',
          link: 'https://www.ebay.com',
        },
        {
          id: 'mock-2',
          title: 'Mock Card 2',
          price: '15.00',
          currency: 'USD',
          imageUrl: 'https://via.placeholder.com/150',
          link: 'https://www.ebay.com',
        },
      ];
    }

    return response.data.itemSummaries.map((item) => ({
      id: item.itemId,
      title: item.title,
      price: item.price?.value ? `${item.price.value} ${item.price.currency}` : 'N/A',
      currency: item.price?.currency || '',
      imageUrl: item.image?.imageUrl || '',
      link: item.itemWebUrl || '',
    }));
  } catch (error) {
    console.error('Error fetching card data from eBay API:', error.response?.data || error.message);
    throw new Error('Failed to fetch card data from eBay API');
  }
};

// Search endpoint for all cards
app.post('/api/search', async (req, res) => {
  const { query, filters } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = [];

    // Fetch from TCG API
    console.log(`Fetching Pokémon card data for query: ${query}`);
    const tcgResults = await fetchPokemonCardData(`name:"${query}"`);
    results.push(...tcgResults);

    // Fetch from eBay API
    if (filters?.ebay) {
      console.log(`Fetching eBay card data for query: ${query}`);
      const ebayResults = await fetchEbayCardData(query);
      results.push(...ebayResults);
    }

    res.json(results.length ? results : []);
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
