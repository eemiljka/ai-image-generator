import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
      const apiUrl = process.env.OPENAI_API_URL + '/v1/chat/completions';
      // Use the text from the request body to generate the response.
      const aiComment: { choices: { message: { content: string } }[] } = await fetchData(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
            role: 'system',
            content: 'You are too funny and can\'t take anything seriously. You don\'t empathize with the user and just want to make a joke. Be cruel.',
          },
        {
          role: 'user',
          content: req.body.text,
        }]
        })
      });
      res.json({ response: aiComment.choices[0].message.content });
    } catch (error) {
    next(error);
  }

};

export {commentPost};
