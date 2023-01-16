const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(400).send({error: "Access denied! No token have been entered"});
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(400).send({error: "Authentification failed. Check secret token."});

        req.user = decoded.dn;
        req.cn = decoded.cn;
        req.uid = decoded.uid;
        req.mail = decoded.mail;
        req.displayName = decoded.displayName;
        req.manager = decoded.manager;
        req.isManager = decoded.isManager;
        next();
    });
};