import "dotenv/config";
import OpenAI from "openai";

export async function fetchResponse(searchData: string) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set or is empty.");
    }

    // const response = await client.responses.create({
    //   model: "gpt-4o-mini-search-preview",
    //   input: searchData,
    // });

    var searchDataSample = [
      "The Bicycle Thief",
      "Café Lunette",
      "Tribute",
      "Daryâ",
      "Henry House",
      "Tony's Donair",
      "East Side Mario's",
      "Lou Pécou Pizzeria",
      "YiLan Chinese Halal Restaurant",
      "The Narrows Public House",
      "The Auction House",
      "The Press Gang",
      "Shuck Seafood + Raw Bar",
      "Salty's",
      "The Wooden Monkey",
      "Bistro le Coq",
      "Gio Restaurant",
      "2 Doors Down",
      "Field Guide",
      "The Old Triangle Irish Alehouse"
  ];

  var userInputPrompt = "pasta made with wine";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini-search-preview",
      web_search_options: {},
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": `
                Please provide information exclusively related to food specific to the given location.
                Here is the list json object of restaurants and use this as search context: 
                ${searchDataSample}.
                Here is the user prompt: ${userInputPrompt},
                if the prompt is not related to food, or the provided search context then please respond with "please try again".
                otherwise, respond with the name of a restaurant from the search context.
                Avoid answering off-topic questions and do not provide justifications, explanations, links for your responses just return the name of the restaurant in simple text and nothing else.
              `
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `${userInputPrompt}`
            }
          ]
        }
      ],
    
  });

    return await completion; // Return the text of the first choice
    // return await response; // Return the text of the first choice
  } catch (error) {
    console.error("Error in fetchResponse:", error);
  }
}
