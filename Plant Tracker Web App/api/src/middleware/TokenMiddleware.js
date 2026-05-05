const jwt = require("jsonwebtoken");
const TOKEN_COOKIE_NAME = "EvergreenToken";
const SECRET = process.env.API_SECRET_KEY;

exports.TokenMiddleware = (req, res, next) => {
  let token = null;
  if(req.cookies[TOKEN_COOKIE_NAME]) {
    token = req.cookies[TOKEN_COOKIE_NAME];
  }
  
  else {
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1].trim();
    }
  }

  const handleUnauthorized = () => {
    if (!req.originalUrl.startsWith('/api')) {
      return res.redirect('/'); 
    }
    return res.status(401).json({error: 'Not Authenticated'});
  };

  if (!token) {
    return handleUnauthorized();
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload.user;
    next();
  } catch(error) {
    return handleUnauthorized();
  }
}

exports.generateToken = (req, res, user) => {
    let payload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        user: user
    }

    const token = jwt.sign(payload, SECRET);

    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge:  1000 * 3600 // 1 hour
    });

};


exports.removeToken = (req, res) => {
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        maxAge:  -1000
    });
};
