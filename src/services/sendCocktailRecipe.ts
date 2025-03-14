import axios from 'axios';

export async function sendCocktailRecipe(data: object) {
  const apiRoute = '/api/send-data-to-arduino';
  const response = await axios.post(apiRoute, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}
