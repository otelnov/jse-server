var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
	'use strict';

	var UsersSchema = new Schema({
		name: String,
		surname: String,
		username: {
			type: String,
			unique: true,
			index: true
		},
		password: {
			type: String,
			select: false
		},
		image: String,
		email: {
			type: String,
			unique: true,
			index: true,
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		},
		provider: {
			type: String,
			default: 'local'
		},
		providerId: String,
		isEnabled: {
			type: Boolean,
			default: true
		}
	});

	mongoose.model('Users', UsersSchema, 'Users');
};






