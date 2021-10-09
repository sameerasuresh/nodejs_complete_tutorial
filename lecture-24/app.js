const expess = require('express');
const app = expess();
const routes = require('./routes');

console.log('test next') 
app.use(expess.urlencoded({extended: false}));
app.use(expess.json())
app.use((req, res, next)=> {
    const allowOrigins = ['https://w3.com', 'https://cdpn.io']
    const origin = req.headers.origin;
    if(allowOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
    res.setHeader('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
    next();
});
app.use('/feed',routes.feed);

app.listen(8080);