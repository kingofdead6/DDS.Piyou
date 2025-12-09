import asyncHandler from 'express-async-handler';
import Product from '../Models/Product.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import validator from 'validator';

// Get all products (public)
export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = {};
  if (category) query.category = category;

  const products = await Product.find(query).lean();

  const filteredProducts = products
    .map(product => {
      const availableColors = product.availableColors.filter(color =>
        color.sizes.some(size => size.quantity > 0)
      );
      const hasAvailableStock = availableColors.some(color =>
        color.sizes.some(size => size.quantity > 0)
      );
      if (hasAvailableStock) {
        return { ...product, availableColors };
      }
      return null;
    })
    .filter(product => product !== null);

  res.status(200).json(filteredProducts);
});

// Get all products for admin (admin)
export const getAdminProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = {};
  if (category) query.category = category;

  const products = await Product.find(query).lean();
  res.status(200).json(products);
});

// Get single product by ID (public)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const availableColors = product.availableColors.filter(color =>
    color.sizes.some(size => size.quantity > 0)
  );

  const hasAvailableStock = availableColors.some(color =>
    color.sizes.some(size => size.quantity > 0)
  );

  if (!hasAvailableStock) {
    res.status(404);
    throw new Error('Product not available');
  }

  res.status(200).json({ ...product, availableColors });
});

// Create product (admin)
export const createProduct = asyncHandler(async (req, res) => {
  let { name, category, price, gender, availableColors, showOnProductsPage, showOnTrendingPage, showOnBestOffersPage, showOnSpecialsPage } = req.body;

  // Parse availableColors if it's a string
  if (typeof availableColors === 'string') {
    try {
      availableColors = JSON.parse(availableColors);
    } catch (error) {
      res.status(400);
      throw new Error('Invalid availableColors format');
    }
  }

  // Basic validations
  if (!name || !validator.isLength(name, { min: 1, max: 100 })) {
    res.status(400);
    throw new Error('Valid name required');
  }
  if (!category) {
    res.status(400);
    throw new Error('Category is required');
  }
  if (!price || isNaN(price) || price < 0) {
    res.status(400);
    throw new Error('Valid positive price required');
  }
  if (gender && !['male', 'female', 'unisex'].includes(gender)) {
    res.status(400);
    throw new Error('Gender must be male, female, or unisex');
  }

  // Upload images
  let images = [];
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const view = req.body.views ? req.body.views[i] : null;
      const imageUrl = await uploadToCloudinary(file);
      images.push({ image: imageUrl, view });
    }
  }

  const product = await Product.create({
    name,
    category,
    price: Number(price),
    gender: gender || 'unisex',
    availableColors,
    images,
    showOnProductsPage: showOnProductsPage === 'true' || showOnProductsPage === true,
    showOnTrendingPage: showOnTrendingPage === 'true' || showOnTrendingPage === true,
    showOnBestOffersPage: showOnBestOffersPage === 'true' || showOnBestOffersPage === true,
    showOnSpecialsPage: showOnSpecialsPage === 'true' || showOnSpecialsPage === true,
  });

  res.status(201).json(product);
});

// Update product (admin)
// Update product (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    price,
    gender,
    availableColors,
    showOnProductsPage,
    showOnTrendingPage,
    showOnBestOffersPage,
    showOnSpecialsPage
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update basic fields
  if (name) product.name = name;
  if (category) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (gender && ['male', 'female', 'unisex'].includes(gender)) product.gender = gender;

  // Handle availableColors safely
  if (availableColors) {
    let parsedColors = availableColors;
    if (typeof availableColors === 'string') {
      try {
        parsedColors = JSON.parse(availableColors);
      } catch (error) {
        res.status(400);
        throw new Error('Invalid availableColors format');
      }
    }
    product.availableColors = parsedColors;
  }

  // Toggle flags
  if (showOnProductsPage !== undefined) product.showOnProductsPage = showOnProductsPage === 'true' || showOnProductsPage === true;
  if (showOnTrendingPage !== undefined) product.showOnTrendingPage = showOnTrendingPage === 'true' || showOnTrendingPage === true;
  if (showOnBestOffersPage !== undefined) product.showOnBestOffersPage = showOnBestOffersPage === 'true' || showOnBestOffersPage === true;
  if (showOnSpecialsPage !== undefined) product.showOnSpecialsPage = showOnSpecialsPage === 'true' || showOnSpecialsPage === true;

  // Handle new images without deleting old ones if none uploaded
  if (req.files && req.files.length > 0) {
    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const view = req.body.views ? req.body.views[i] : null;
      const imageUrl = await uploadToCloudinary(file);
      images.push({ image: imageUrl, view });
    }
    product.images = images; // Replace only if new images uploaded
  }

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});


// Toggle showOnProductsPage (admin)
export const toggleShowOnProductsPage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.showOnProductsPage = !product.showOnProductsPage;
  await product.save();
  res.status(200).json(product);
});

//Toggle Show on Trending Page
export const toggleShowOnTrendingPage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.showOnTrendingPage = !product.showOnTrendingPage;
  await product.save();
  res.status(200).json(product);
});

export const toggleShowOnBestOffersPage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.showOnBestOffersPage = !product.showOnBestOffersPage;
  await product.save();
  res.status(200).json(product);
});

export const toggleShowOnSpecialsPage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.showOnSpecialsPage = !product.showOnSpecialsPage;
  await product.save();
  res.status(200).json(product);
});

// Delete product (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Product deleted' });
});


export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const query = { showOnProductsPage: true };
  if (category && category !== "All Shoes") {
    query.category = category;
  }

  const products = await Product.find(query).lean();

  // Process stock info but NEVER hide the product
  const processedProducts = products.map(product => {
    const availableColors = product.availableColors.filter(color =>
      color.sizes.some(size => size.quantity > 0)
    );

    const hasStock = availableColors.length > 0;

    return {
      ...product,
      availableColors: hasStock ? availableColors : product.availableColors, // keep all colors if sold out
      hasStock // useful for frontend badges
    };
  });

  res.status(200).json(processedProducts);
});

// Get Trending Products
export const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ showOnTrendingPage: true }).lean();
  
  const processed = products.map(product => ({
    ...product,
    availableColors: product.availableColors.filter(color =>
      color.sizes.some(size => size.quantity > 0)
    )
  })).filter(p => p.availableColors.length > 0); // only in-stock

  res.json(processed);
});

// Get Best Offers
export const getBestOffers = asyncHandler(async (req, res) => {
  const products = await Product.find({ showOnBestOffersPage: true }).lean();
  
  const processed = products.map(product => ({
    ...product,
    availableColors: product.availableColors.filter(color =>
      color.sizes.some(size => size.quantity > 0)
    )
  })).filter(p => p.availableColors.length > 0);

  res.json(processed);
});

// Get Specials
export const getSpecials = asyncHandler(async (req, res) => {
  const products = await Product.find({ showOnSpecialsPage: true }).lean();
  
  const processed = products.map(product => ({
    ...product,
    availableColors: product.availableColors.filter(color =>
      color.sizes.some(size => size.quantity > 0)
    )
  })).filter(p => p.availableColors.length > 0);

  res.json(processed);
});

export const getSimilarProducts = asyncHandler(async (req, res) => {
  const { id, category } = req.query;
  
  const products = await Product.find({ 
    category,
    _id: { $ne: id },
    "availableColors.sizes.quantity": { $gt: 0 }
  })
  .lean()
  .limit(12);

  res.json(products);
});