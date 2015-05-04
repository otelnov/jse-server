var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = function (app) {
	'use strict';

	var config = app.get('config');
	var jwtSecret = config.JWT_SECRET;

	app.get('/users/me', function (req, res) {
		res.send(req.user);
	});

	app.post('/users/register', register, auth, _.noop);

	app.post('/users/login', login, auth, _.noop);

	function auth(req, res) {
		var user = req.userData;
		var token = jwt.sign({
			username: user.username
		}, jwtSecret);
		res.send({
			token: token,
			user: user
		});
	}

	function register(req, res, next) {
		var body = req.body;

		if (!body.username || !body.password || !body.email) {
			return res.status(400).end('username, email and password are required!');
		}

		Users.findOne({
			$or: [
				{'username': body.username},
				{'email': body.email}
			]
		}, function (err, user) {
			if (err) {
				return res.status(400).end(err);
			}

			if (user) {
				return res.status(400).end('user exists');
			}

			var newUser = new Users({
				username: body.username,
				email: body.email,
				password: md5(body.password)
			});

			newUser.save(function (err, user) {
				if (err) {
					return res.status(400).end(err);
				}
				req.userData = user;
				next();
			});
		});
	}

	function login(req, res, next) {
		var body = req.body;

		if (!body.username || !body.password) {
			return res.status(400).end('username and password are required!');
		}

		Users.findOne({
			username: body.username,
			password: md5(body.password)
		}).lean().exec(function (err, user) {
			if (err) {
				return res.status(503).end(err);
			}

			if (!user) {
				return res.status(401).end('username or password incorrect');
			}

			req.userData = user;
			next();
		})
	}

	function md5(string) {
		return crypto.createHash('md5').update(string).digest('hex');
	}

};