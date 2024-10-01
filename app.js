const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
dotenv.config();

const app = express();

//Importing routes
const expenseRoute = require('./routes/expenseRoutes');
const userRoute = require('./routes/userRoutes');
const premiumRoute = require('./routes/premiumRoutes');
const premiumFeatures = require('./routes/premiumFeaturesRoutes');

// Importing and connecting to the database
const mongoConnect = require("./util/database");

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Redirecting to routes
app.use('/expense', expenseRoute);
app.use('/user', userRoute);
app.use('/premium', premiumRoute);
app.use('/premiumFeature', premiumFeatures);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(morgan('combined', {stream: accessLogStream}));

const port = process.env.PORT;

// Default routes for user 
app.get("/", (req, res) => {  
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start the server after connecting to MongoDB
mongoConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

    
    