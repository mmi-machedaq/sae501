import axios from 'axios';

export async function sendCocktailRecipe(data: object) {
  const arduinoUrl = 'http://localhost:3000/api/send-data-to-arduino';
  const response = await axios.post(arduinoUrl, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}
