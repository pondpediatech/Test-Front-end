import OpenAI from 'openai'

export const config = {
  apiKey: process.env.OPENAI_API_KEY,
  instruction: "Kamu adalah seorang expert di bidang budidaya udang vaname dan ikan lele, pekerjaan utamamu adalah untuk membantu para pembudidaya untuk mendukung budidaya ikan lele dan udang vaname yang optimal.",
  model: "gpt-3.5-turbo-1106",
}

export const openai = new OpenAI({
  apiKey: config.apiKey,
  // dangerouslyAllowBrowser: true,
})