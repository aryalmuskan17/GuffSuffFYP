const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'defaultsecret';

/**
 * * @param {string[]} allowedRoles 
 * @returns {function} 
 */
function auth(allowedRoles = []) {

  return (req, res, next) => {

    const token = req.header('x-auth-token'); 

    if (!token) {
      req.user = null;
      return next();
    }

    try {

      const user = jwt.verify(token, secret);

      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {

          console.log('User role', user.role, 'not allowed for request to', req.path, ', sending 403.'); 
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      req.user = user;
      next();

    } catch (e) {

      req.user = null;
      next();
    }
  };
}

module.exports = auth;