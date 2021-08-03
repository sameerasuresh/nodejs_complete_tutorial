exports.get404 = (req, res, next) => {
    res.status(404).render('404', { docTitle: '404 Not Found', path: '/404', isAuthenticated: req.isLoggedIn});
}

exports.get500 = (req, res, next) => {
    res.status(500)
        .render('500', { docTitle: '500 Server error', path: '/500', isAuthenticated: req.isLoggedIn})
}