const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField:'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    // validación de usuario
    const user = await User.findOne({email: email});
    if(user){
        return done(null, false, req.flash('signupMessage', 'The Email is already taken.'));
    } else{
        // Guardar usuario en la base de datos
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField:'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    // validación de usuario en la base de datos
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, req.flash('signinMessage', 'No user found.'));
    } if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'Incorrect Password.'));
    }
    done(null, user);
}));