const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 80;

const upload = multer( { dest: 'static/uploads/' });
app.use('/uploads', express.static('static/uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('static')); 

const path = require('path'); 
const templatesPath = path.join(__dirname, 'templates');
const validatePayment = require('./validation');

// goes to form
app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'form.html'));
});

// send either goes to error or success
app.post('/send',  upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
    if (!validatePayment(req.body, req.file)) 
        return res.status(400).sendFile(path.join(templatesPath, 'error.html'));
    
    const { recipientFirstName, amount } = req.body;

    const html = 
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful</title>
        <link rel="stylesheet" href="css/styles.css">
        </head>
        <body>
        <h1>Payment was successful!</h1>
        <p>You paid ${recipientFirstName} $${amount}</p>
        <h2><a href="../">Go Back</a></h2>
        </body>
        </html>
        `;

    res.send(html);
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

