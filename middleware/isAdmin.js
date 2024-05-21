const jwt = require('jsonwebtoken');

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied');

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;

      if (!roles.includes(req.user.roles[0])) {
        return res.status(403).send('Access forbidden');
      }

      next();
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  };
};

module.exports = authorize;
