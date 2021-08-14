const expess = require('express');
const app = expess();
const routes = require('./routes');

console.log('test next') 
//app.use(expess.urlencoded({extended: false}));
//app.use(expess.json())

app.use('/feed',routes.feed);

app.listen(8080, () => {
    console.log('server started');
});