import { async } from 'regenerator-runtime';

export async function getJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Something is going wrong! Try again');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}
