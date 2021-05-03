const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

const errorController = require('./controllers/errors.controller');

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

app.listen(3000);