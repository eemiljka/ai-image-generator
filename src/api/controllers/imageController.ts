import { Request, Response, NextFunction } from 'express';
import fetchData from '../../lib/fetchData';

interface OpenAIImageResponse {
  data: { url: string }[];
}

const generateImage = async (
  req: Request<{}, {}, { topic: string, text?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prompt = `A YouTube thumbnail about ${req.body.topic}. Make it vibrant and eye-catching. Include splash text saying "${req.body.text || 'Explore Now!'}".`;
    const response = await fetchData<OpenAIImageResponse>(`${process.env.OPENAI_API_URL}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        n: 1, 
        size: '1024x1024',
      }),
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    // send url for generated image
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    next(error);
  }
};

// Creating image edit
const editImage = async (
  req: Request<{}, {}, { image_url: string, edit_text: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await fetchData<OpenAIImageResponse>(`${process.env.OPENAI_API_URL}/v1/images/edits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: req.body.image_url,
        prompt: `Add the text "${req.body.edit_text}" to the image`,
        size: '1024x1024',
      }),
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('Failed to edit image');
    }

    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error editing image:', error);
    next(error);
  }
};

export { generateImage, editImage };
