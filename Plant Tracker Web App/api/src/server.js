const express = require('express');
const pushRoutes = require('./routes/PushRoutes');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
const multer = require('multer');   // for photo uploads
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// imported routes
const authentication = require('./routes/authentication');
const plantEndpoints = require('./routes/plants');
const scheduleEndpoints = require('./routes/schedule');
const usersRoutes = require('./routes/users'); // added --> handles /profile + plants


// routes
app.use('/auth', authentication);
app.use('/users', usersRoutes); // added --> handles both /users/plants, /users/profile etc
app.use('/plants', plantEndpoints);
app.use('/schedule', scheduleEndpoints);
app.use('/push', pushRoutes);

// uploads folder
app.use('/static', express.static(path.join(__dirname, 'static')));

// this is for testing
app.get('/', (req,  res) => {
  res.json({your_api: 'Plant PWA API is running'});
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));