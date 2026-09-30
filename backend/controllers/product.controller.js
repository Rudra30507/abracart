const mongoose = require('mongoose');
const Product = require('../models/product.model');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !category ||
      !image ||
      stock === undefined ||
      stock === null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field'
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price. Price must be greater than 0'
      });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock. Stock cannot be negative'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image: image.trim(),
      stock: numericStock
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (
      category &&
      category.trim() &&
      category.trim() !== 'All' &&
      category.trim() !== 'All Categories'
    ) {
      query.category = category.trim();
    }

    let productQuery = Product.find(query);

    if (sort === 'price_asc') {
      productQuery = productQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      productQuery = productQuery.sort({ price: -1 });
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    const products = await productQuery;

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });

    }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};
