const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
// const openRouterApiKey=process.env.OPENROUTER_API_KEY
const model="deepseek/deepseek-chat"
// const model = "cohere/north-mini-code:free";
// const model = "nvidia/nemotron-3-ultra-550b-a55b:free";

export const generateResponse=async (prompt) => {
  const res = await fetch(openRouterUrl, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: model,
    messages: [
      {
        role: 'system',
        content: "You are a helpful assistant. You must return ONLY valid raw JSON" ,
      },
      {
        role: 'user',
        content: prompt ,
      },
    ],
    temperature:0.2,
    max_tokens: 8000
  }),
});

if(!res.ok){
    const err=await res.text()
    throw new Error("openRouter err "+err )
}

const data = await  res.json()
return data.choices[0].message.content
}