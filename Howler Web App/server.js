const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const { TokenMiddleware } = require('./src/middleware/TokenMiddleware');


const APIRoutes = require('./src/APIRoutes');
const FrontendRoutes = require('./src/FrontendRoutes');
const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.use("/api", APIRoutes);
app.use("/", FrontendRoutes);

app.use((req, res, next) => {
    TokenMiddleware(req, res, () => {
        if (!req.originalUrl.startsWith('/api')) {
            return res.redirect('/feed'); 
        }
        return res.status(404).json({ error: 'Not Found' });
    });
});

const PORT = 80;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));