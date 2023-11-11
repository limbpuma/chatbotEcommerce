require("dotenv").config();
const axios = require("axios");

async function fetchGPTResponse(prompt) {
  const gptBuilderUrl =
    "https://chat.openai.com/g/g-hRU50HHAk-vendor-de-tienda-ecommerce";
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      gptBuilderUrl,
      { prompt: prompt },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al hacer la solicitud a GPT-Builder:", error);
    throw error;
  }
}

module.exports = { fetchGPTResponse };
