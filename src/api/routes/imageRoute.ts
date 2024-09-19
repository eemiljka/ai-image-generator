import express from 'express';
import { body } from 'express-validator';
import { validate } from '../../middlewares';
import { generateImage, editImage } from '../controllers/imageController';

const router = express.Router();

// Route to generate a new image
router.route('/').post(
  body('topic').notEmpty().escape(),
  body('text').optional().escape(),
  validate,
  generateImage
);

// Route to edit an existing image (e.g., add text)
router.route('/edit').post(
  body('image_url').notEmpty().isURL(), // The URL of the image to edit
  body('edit_text').notEmpty().escape(), // The text to add to the image
  validate,
  editImage
);

export default router;