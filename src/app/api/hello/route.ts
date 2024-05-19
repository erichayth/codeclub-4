import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET(request: NextRequest) {

// Define the response mapping
const responseArray = {
	1: "You're contestant number 1",
	2: "You're contestant number 2",
	3: "You're contestant number 3",
	4: "You're contestant number 4"
  };
  
  // Function to generate a random number and return the corresponding message
  function getRandomMessage() {
	const id = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
	return responseArray[id]; // Return the message associated with the random number
  }
  
  export default {
	async fetch(request) {
	  const responseMessage = getRandomMessage(); // Call the function to get a random message
	  return new Response(responseMessage, {
		headers: { 'content-type': 'text/plain' }
	  });
	}
  };
}