const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./utils/path');

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');
const { rootDir1 } = require('./utils/path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//filtering paths
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join( rootDir.rootDir1, 'views', '404.html'));
})

app.listen(3000);