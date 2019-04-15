const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

// Por si tengo más de una ruta que quiero restringir...
/*router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});*/

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

// Para no acceder al perfil luego de desloguearse...
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = router;