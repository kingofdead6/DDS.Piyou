import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleShowOnProductsPage,
  toggleShowOnTrendingPage,
  toggleShowOnBestOffersPage,
  toggleShowOnSpecialsPage,
  getFeaturedProducts,
  getTrendingProducts,
  getBestOffers,
  getSpecials,
  getSimilarProducts
} from '../Controllers/product.js';

import { protect, admin } from '../Middleware/auth.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// ===== PUBLIC ROUTES =====
router.get('/', getProducts);
router.get('/admin-products', protect, admin, getAdminProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/best-offers', getBestOffers);
router.get('/specials', getSpecials);
router.get('/:id', getProductById);
router.get('/similar', getSimilarProducts);
// ===== ADMIN ROUTES =====
router.post('/', protect, admin, upload.array('images', 10), createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct);

router.patch('/:id/toggle-products-page', protect, admin, toggleShowOnProductsPage);
router.patch('/:id/toggle-trending-page', protect, admin, toggleShowOnTrendingPage);
router.patch('/:id/toggle-best-offers-page', protect, admin, toggleShowOnBestOffersPage);
router.patch('/:id/toggle-specials-page', protect, admin, toggleShowOnSpecialsPage);

router.delete('/:id', protect, admin, deleteProduct);

export default router;
