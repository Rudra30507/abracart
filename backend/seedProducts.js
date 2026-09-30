const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');

dotenv.config({ path: __dirname + '/.env' });
dotenv.config();

const mongoURI = process.env.MONGO_URI || process.env.url || 'mongodb://127.0.0.1:27017/shopkart';

const seedProducts = [
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches, tactile feedback, and durable braided cable.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    stock: 10
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory foam cushions.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    stock: 25
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Crisp AMOLED display with continuous heart rate monitoring, SPO2 sensor, GPS, and water resistance.',
    price: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    stock: 15
  },
  {
    name: 'Classic Cotton Denim Jacket',
    description: 'Premium vintage washed blue denim jacket with sturdy brass buttons and deep utility pockets.',
    price: 2499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    stock: 20
  },
  {
    name: 'Minimalist Leather Backpack',
    description: 'Sleek water-resistant vegan leather backpack with dedicated 15.6 inch padded laptop compartment.',
    price: 1899,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    stock: 12
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'The definitive classic handbook for software engineers on craftsmanship, mastery, and career growth.',
    price: 899,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    stock: 30
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven framework for building good daily habits, breaking bad ones, and mastering small behaviors.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    stock: 45
  },
  {
    name: 'Ceramic Pour-Over Coffee Maker',
    description: 'Artisanal ceramic dripper with heat-resistant borosilicate glass server carafe for rich morning brews.',
    price: 1299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    stock: 18
  },
  {
    name: 'Aromatic Soy Scented Candle',
    description: 'Hand-poured natural soy wax candle scented with calming French lavender, amber, and vanilla essential oils.',
    price: 499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    stock: 40
  },
  {
    name: 'Organic Extra Virgin Olive Oil',
    description: 'First cold-pressed Mediterranean extra virgin olive oil packaged in UV-protected glass bottle.',
    price: 799,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    stock: 22
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');

    // Clear existing products to prevent duplicates
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const created = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${created.length} products into MongoDB!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

runSeed();
