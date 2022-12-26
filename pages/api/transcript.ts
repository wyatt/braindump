// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  interval: 3600 * 1000, // 1 hour (ms)
  uniqueTokenPerInterval: 20, // Max 500 users per second
});

type ReqData = {
  text: string;
};

type ResData = {
  tasks: string[];
  journal: string;
};

const promptStart = `The passage below is a user's brain dump of their thoughts, stresses, and things they want to get done. I want you to create a JSON object beginning only with { with 2 keys, "tasks": a bullet point list of actionable deduplicated tasks the user mentions and "journal": a brief journal entry of their emotional thoughts. Include tips for how to resolve their problems.\n\nPASSAGE BEGINS\n\n`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const options = {
  temperature: 1,
  max_tokens: 512,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  await limiter.check(res, 5, "CACHE_TOKEN").catch((e) => {
    res.status(429).end();
    return;
  });

  const body: ReqData = JSON.parse(req.body);
  const transcript = body.text;
  const prompt = promptStart + transcript;

  const gpt = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    ...options,
  });
  const gptResponse = gpt.data.choices[0].text!;
  const finalResponse = gptResponse.substring(gptResponse.indexOf("{"));

  res.json(JSON.parse(finalResponse));
}
