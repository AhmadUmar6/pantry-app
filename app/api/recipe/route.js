import Groq from "groq-sdk";

const API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: API_KEY });

export async function POST(request) {
  try {
    const { items } = await request.json();
    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid items array' }), { status: 400 });
    }

    const response = await getGroqChatCompletion(items);
    const recipeString = response.choices[0]?.message?.content.trim();
    
    // Parse the markdown-formatted recipe string into a structured object
    const recipe = parseRecipe(recipeString);

    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), { status: 500 });
  }
}

async function getGroqChatCompletion(items) {
  return groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: `Please suggest a healthy short recipe using strictly only these items (dont just suggest delights be creative): ${items.join(', ')}. Please keep it in this format: (line 1) Recipe name (don't add the word recipe), (skip a line), (line 3) Ingredients: ________ (for each ingredient make sure it is has its own line), (skip a line), (line n) Instructions: 1. ______________ (for each instruction make sure it is numbered and has its own line). Start with Recipe, don't mention anything else before that. Make sure the words recipe name, Ingredients, and Instructions are bold. Make sure everything is its own line. Write in markdown.`
      }
    ],
    max_tokens: 800,
  });
}

function parseRecipe(recipeString) {
  const lines = recipeString.split('\n').filter(line => line.trim() !== '');
  
  const title = lines[0].replace(/^#+\s*/, '').trim();
  
  const ingredientsStartIndex = lines.findIndex(line => line.toLowerCase().includes('ingredients:'));
  const instructionsStartIndex = lines.findIndex(line => line.toLowerCase().includes('instructions:'));
  
  const ingredients = lines.slice(ingredientsStartIndex + 1, instructionsStartIndex)
    .map(line => line.replace(/^[-*]\s*/, '').trim());
  
  const instructions = lines.slice(instructionsStartIndex + 1)
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return {
    title,
    ingredients,
    instructions
  };
}
