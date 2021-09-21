const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Please enter the token to proceed');

    try {
        const decoded = jwt.verify(token, 'jwtsecretkey');
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).send('Token is not valid');
    }
}