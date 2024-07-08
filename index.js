const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://vaishnavi:Vaishnavi30@cluster0.ls1ernz.mongodb.net/dex-application?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware to parse JSON
app.use(express.json());

// Define the product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  inStock: Boolean,
});

const Product = mongoose.model('Product', productSchema);

// Search, Sort, and Filter Products
app.get('/products', async (req, res) => {
  try {
    let query = {};
    let sort = {};
    
    // Filtering
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.inStock) {
      query.inStock = req.query.inStock === 'true';
    }

    // Sorting
    if (req.query.sortBy && req.query.order) {
      sort[req.query.sortBy] = req.query.order === 'asc' ? 1 : -1;
    }

    // Searching
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
