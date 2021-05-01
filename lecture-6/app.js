const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const app = express();


const adminData = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

// app.set('view engine', 'pug');

/* app.engine('hbs', expressHbs({ 
        layoutsDir: 'views/layouts/', 
        defaultLayout: 'main-layout', 
        extname: 'hbs' 
    })
); */
//app.locals.layout = false;
// app.set('view engine', 'hbs')

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//filtering paths
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.render('404', { docTitle: '404 Not Found', path: null});
})

app.listen(3000);