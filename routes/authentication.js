module.exports = function(app, passport) {
    var defaultOpt = {
    root: __dirname + '../../views',
    dotfiles: 'deny'
};  

	// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get('/login', function (req, res) {
               console.log('login: ');
       res.render('login', {error: req.flash('loginMessage')});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/login');
	});

 	// =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};

