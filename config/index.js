var mongoose = require('mongoose');

module.exports = function (app) {
	'use strict';

	var devConfig = {
		MONGO_DB: 'mongodb://localhost/jse-dev',
		PORT: 3000,
		HOST: 'http://localhost',
		JWT_SECRET: 'sEDve3dFgr300c35D854ca6/a0568a5',
	};

	var liveConfig = {
		MONGO_DB: 'mongodb://localhost/jse-dev',
		PORT: 3003,
		HOST: 'https://jse.me',
		JWT_SECRET: '434cc08FV79e01c35ED56c/a6a05f68a5',
	};

	var env = process.env.NODE_ENV || 'development';

	if (env === 'development') {
		mongoose.connect(devConfig.MONGO_DB);
		app.set('config', devConfig);
	}

	if (env === 'production') {
		mongoose.connect(liveConfig.MONGO_DB);
		app.set('config', liveConfig);
	}

};