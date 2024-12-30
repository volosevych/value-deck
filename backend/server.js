const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // To parse JSON requests

// Generate eBay OAuth Token
const generateEbayAccessToken = async () => {
  try {
    const response = await axios.post('https://api.sandbox.ebay.com/identity/v1/oauth2/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.EBAY_SANDBOX_APP_ID}:${process.env.EBAY_SANDBOX_CERT_ID}`
        ).toString('base64')}`,
      },
      params: {
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope',
      },
    });

    console.log('Generated eBay Access Token');
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating eBay access token:', error.response?.data || error.message);
    throw new Error('Failed to generate eBay access token');
  }
};

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
      console.error('No data returned from TCG API');
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
    console.error('Error fetching card data:', error.response?.data || error.message);
    throw new Error('Failed to fetch card data');
  }
};

// Fetch card data from eBay API
const fetchEbayCardData = async (query) => {
  const EBAY_BASE_URL = "https://api.sandbox.ebay.com/buy/browse/v1";

  try {
    console.log('Sending request to eBay API with query:', query);
    const accessToken = await generateEbayAccessToken();

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
          id: '1',
          title: 'Mock Card 1',
          price: '20.00',
          currency: 'USD',
          imageUrl: 'https://via.placeholder.com/150',
          link: 'https://www.ebay.com',
        },
        {
          id: '2',
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
      price: item.price?.value || 'N/A',
      currency: item.price?.currency || 'N/A',
      imageUrl: item.image?.imageUrl || '',
      link: item.itemWebUrl || '',
    }));
  } catch (error) {
    console.error('Error fetching card data from eBay:', error.response?.data || error.message);
    throw new Error('Failed to fetch card data from eBay');
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
    const tcgResults = await fetchPokemonCardData(`name:"${query}"`);
    results.push(...tcgResults);

    // Fetch from eBay API if enabled
    if (filters?.ebay) {
      const ebayResults = await fetchEbayCardData(query);
      results.push(...ebayResults);
    }

    res.json(results.length ? results : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Featured cards endpoint
app.get('/api/featured-cards', async (req, res) => {
  try {
    const featuredCardNames = ['Charizard', 'Pikachu', 'Blue Eyes White Dragon'];
    const promises = featuredCardNames.map((name) =>
      fetchPokemonCardData(`name:"${name}"`)
    );
    const results = await Promise.allSettled(promises);

    const successfulResults = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .flat(); // Flatten the results
    res.json(successfulResults);
  } catch (error) {
    console.error('Error fetching featured cards:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
