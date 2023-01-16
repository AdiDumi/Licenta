const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const ldap = require('ldapjs');
const TokenSchema = require('../models/Token');
dotenv.config();

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const ldapClient = ldap.createClient ({url: 'ldap://ldap_server_c:389'});
const ldapUserAttributes = ['uid', 'dn', 'cn', 'displayname', 'mail', 'manager'];
const searchBase = 'ou=Users,dc=grow,dc=app';

const adminUser="cn=admin,dc=grow,dc=app"
const adminPassword="123456"

const userLogin = (req, res) => {
    // const authHeader = req.headers.authorization;
    // if(!authHeader) {
    //     return res.status(401).send({error: 'Unauthorized request'});
    // }
    // const credentials = Buffer.from(authHeader.split(" ")[1], 'base64').toString().split(':');

    // const username = credentials[0];
    // const password = credentials[1];

    const {username, password} = req.body;
    if (!username || !password) return res.status(400).send({error: 'Username and password required'});

    let userCn, userDc1, userDc2;
    if (username.match(emailRegex)) {
        const userCred = username.split(/[@.]/)
        userCn = userCred[0];
        userDc1 = userCred[1];
        userDc2 = userCred[2];
    } else {
        const userCred = username.split('\\');
        userCn = userCred[1];
        userDc1 = userCred[0].toLowerCase();
        userDc2 = 'app';
    }

    const bindUser = 'cn=' + userCn + ',ou=Users,dc=' + userDc1 + ',dc=' + userDc2;
    ldapClient.bind(adminUser, adminPassword, (err) => {
        if (err) return res.status(400).send({error: err });
        console.log("LDAP successfully connected with user: " + bindUser);
        let exists = false;
        // Search user in LDAP
        ldapClient.search(searchBase, {
            scope: 'sub',
            filter: '(&(cn=' + userCn + ')(userpassword=' + password + '))',
            attributes: ldapUserAttributes
        }, (err, searchRes) => {
            if (err) return res.status(400).send({error: err});

            searchRes.on('searchEntry', (data) => {
                const userInfo = data.object;
                exists =  true

                ldapClient.search(searchBase, {
                    scope: 'sub',
                    filter: '(manager=' + userInfo.dn + ')',
                    attributes: ldapUserAttributes
                }, (err, searchRes) => {
                    if (err) return res.status(400).send({error: err});
                    let isManager = false;
        
                    searchRes.once('searchEntry', (_) => {
                        isManager = true;
                        const newData = data.object;
                        newData.isManager = true;
                        const accessToken = jwt.sign(newData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'});
                        const refreshToken = jwt.sign(newData, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
        
                        TokenSchema.findOne({'user': newData.dn}, (_, token) => {
                            if (token) {
                                token.refreshToken = refreshToken;
                                token.save();
                            } else {
                                const newToken = new TokenSchema( {
                                    user: newData.dn,
                                    refreshToken: refreshToken
                                });
                                
                                newToken.save();
                            }
                        });
        
                        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000});
                        res.json({accessToken});
                        return res;
                    });
            
                    searchRes.once('error', (err) => {
                        return res.status(400).send({error: err});
                    });
            
                    searchRes.once('end', () => {
                        console.log('LDAP search ended');
                        if (!isManager) {
                            userInfo.isManager = false;
                            const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'});
                            const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
            
                            TokenSchema.findOne({'user': userInfo.dn}, (_, token) => {
                                if (token) {
                                    token.refreshToken = refreshToken;
                                    token.save();
                                } else {
                                    const newToken = new TokenSchema( {
                                        user: userInfo.dn,
                                        refreshToken: refreshToken
                                    });
                                    
                                    newToken.save();
                                }
                            });
            
                            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000});
                            res.json({accessToken});
                            return res;
                        }
                    });
                });

            });
    
            searchRes.once('error', (err) => {
                return res.status(400).send({error: err});
            });
    
            searchRes.once('end', () => {
                if (!exists) return res.status(400).send({error: "Wrong credentials"})
                console.log('LDAP search ended');
            });
        });
    });

};

const userLogout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(200);

    const refreshToken = cookies.jwt;

    TokenSchema.findOne({'refreshToken': refreshToken}, (_, token) => {
        if (token) {
            TokenSchema.deleteOne({'refreshToken': refreshToken}, (err, _) => {
                if (err) return res.status(400).send({error: "Could not remove token"});
            });
        } 
    });

    ldapClient.unbind((err) => {
        if (err) return res.status(400).send({error: err});
    });

    res.clearCookie('jwt', {httpOnly: true});
    res.sendStatus(200);

};

const getCurrentUserInfo = (req, res) => {
    return res.status(200).send({
        dn: req.user,
        cn: req.cn,
        mail: req.mail,
        displayName: req.displayName,
        manager: req.manager,
        isManager: req.isManager})
}

const getManager = (req, res) => {
    ldapClient.bind(adminUser,adminPassword, (err) => { 
        if (err) return res.status(400).send({error: err });
        if (req.manager === undefined) return res.sendStatus(200);

        ldapClient.search(req.manager, {
            scope: 'sub',
            attributes: ldapUserAttributes
        }, (err, searchRes) => {
            if (err) return console.log(err);
            hasResult = false;
            searchRes.on('searchEntry', (data) => {
                hasResult = true;
                const username = req.query.username
                if (username === undefined || username == "")
                    return res.status(200).send(data.object)
                if (data.object.cn.includes(username) || data.object.displayName.includes(username))
                    return res.status(200).send(data.object)
                return res.sendStatus(200);
            });
            
            searchRes.once('error', (err) => {
                return console.log(err);
            });
                    
            searchRes.once('end', () => {
                console.log('LDAP search ended ');
                if (!hasResult) return res.sendStatus(200);
            });
            
        });
    });
};

const getTeamUsers = (req, res) => {
    let teamUsers = []
    
    ldapClient.bind(adminUser,adminPassword, (err) => {
        if (err) return res.status(400).send({error: err });
        let username = req.query.username
        if (username === undefined || username == "") username = "*"
        else username = "*" + username + "*"
        ldapClient.search(searchBase, {
            scope: 'sub',
            filter: "(&(|(manager=" + req.user +")(manager=" + req.manager + "))(|(cn=" + username + ")(displayname=" + username + ")))",
            attributes: ldapUserAttributes
        }, (err, searchRes) => {
            if (err) return console.log(err);
            
            searchRes.on('searchEntry', (data) => {
                if (data.object.dn != req.user && teamUsers.length < 10) teamUsers.push(data.object)
            });
            
            searchRes.once('error', (err) => {
                return console.log(err);
            });
                    
            searchRes.once('end', () => {
                console.log('LDAP search ended ');
                return res.status(200).send(teamUsers)
            });
            
        });
    });
    
};

const getOtherUsers = (req, res) => {
    let otherUsers = []

    ldapClient.bind(adminUser,adminPassword, (err) => { 
        if (err) return res.status(400).send({error: err });

        let username = req.query.username
        if (username === undefined || username == "") username = "*"
        else username = "*" + username + "*"

        let filters = "(&(!(|(manager=" + req.user +")(manager=" + req.manager + ")))(|(cn=" + username + ")(displayname=" + username + ")))"
        if (req.manager === undefined) filters = "(&(!(manager=" + req.user +"))(|(cn=" + username + ")(displayname=" + username + ")))"

        ldapClient.search(searchBase, {
            scope: 'sub',
            filter: filters,
            attributes: ldapUserAttributes
        }, (err, searchRes) => {
            if (err) return console.log(err);
            
            searchRes.on('searchEntry', (data) => {
                if (data.object.dn != searchBase && data.object.dn != req.user && data.object.dn != req.manager && otherUsers.length < 10) otherUsers.push(data.object);
            });
            
            searchRes.once('error', (err) => {
                return console.log(err);
            });
                    
            searchRes.once('end', () => {
                console.log('LDAP search ended ');
                return res.status(200).send(otherUsers)
            });
            
        });
    });
};

module.exports = {
    userLogin,
    userLogout,
    getTeamUsers,
    getOtherUsers,
    getManager,
    getCurrentUserInfo
}
