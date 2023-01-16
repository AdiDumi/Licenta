const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const TokenSchema = require('../models/Token');
dotenv.config();

const refreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(400).send({error: 'Access denied! No token have been entered'});

    const refreshToken = cookies.jwt;

    TokenSchema.findOne({'refreshToken': refreshToken}, (_, token) => {
        if (!token) {
            return res.status(400).send({error: 'No refresh token saved'});
        } 

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(400).send({error: err});
    
            if(token.user !== decoded.dn) return res.status(400).send({error: 'Incorect user token'});
    
            const accessToken = jwt.sign({"dn": decoded.dn, "cn": decoded.cn, "uid": decoded.uid, "displayname": decoded.displayname, "mail":decoded.mail, "manager":decoded.manager},
                process.env.ACCESS_TOKEN_SECRET, {expiresIn: '300s'});
            res.json({accessToken});
            return res;
        });
    });
};

module.exports = {refreshToken};