const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require("path")
const staticpath = path.join(__dirname, "../client")
const ordersuccesspath = path.join(__dirname, "../client/successOrder.html")
const reviewsuccesspath = path.join(__dirname, "../client/successReview.html")
const contactsuccesspath = path.join(__dirname, "../client/successContact.html")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticpath));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://saadb112:saadbhaizindabaad1@cluster0.vbcrt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create schema and model
const entrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  state: String,
  city: { type: String, required: true },
  postcode: String,
  streetaddress: { type: String, required: true },
  date: { type: Date, default: Date.now },
  message: String,
  quantity: Number,
});

const Entry = mongoose.model('Entry', entrySchema);


const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now },
  });
  
const Contact = mongoose.model('Contact', contactSchema);
  

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
});

const Review = mongoose.model('Review', reviewSchema);

// Create a POST request to store data
app.post('/order', (req, res) => {
  const { name, phone, email, state, city, postcode, streetaddress, message, quantity } = req.body;

  const entry = new Entry({
    name,
    phone,
    email,
    state,
    city,
    postcode,
    streetaddress,
    message,
    quantity,
  });

  entry.save()
    .then(() => {
      res.sendFile(ordersuccesspath)
    })
    .catch((error) => {
      res.status(500).send('Error storing data.');
    });
});
app.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
  
    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });
  
    contact.save()
      .then(result => {
        res.sendFile(contactsuccesspath)

      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });

  app.post('/review', (req, res) => {
    const { name, rating, review } = req.body;
    const newReview = new Review({
      name,
      rating,
      review,
    });
  
    newReview.save()
      .then(result => {
        res.sendFile(reviewsuccesspath)

      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
app.get('/allorder', async (req, res)=> {
  const data = await  Entry.find({});
  res.send(data)
  });

  app.get('/allreviews', (req, res) => {
    Review.find()
      .then(reviews => {
        res.json(reviews);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
  app.get('/allcontacts', (req, res) => {
    Contact.find()
      .then(contacts => {
        res.json(contacts);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
  // DELETE request to delete data by ID
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
  
    Entry.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'Data not found' });
        }
        res.json({ message: 'Data deleted successfully' });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
app.delete('/deletereview/:id', (req, res) => {
    const id = req.params.id;
  
    Review.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'Data not found' });
        }
        res.json({ message: 'Data deleted successfully' });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
app.delete('/deletecontact/:id', (req, res) => {
    const id = req.params.id;
  
    Contact.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'Data not found' });
        }
        res.json({ message: 'Data deleted successfully' });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
