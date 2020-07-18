"use strict";

var mongoose = require('mongoose'); // An Object-Document Mapper for Node.js


var assert = require('assert'); // N.B: Assert module comes bundled with Node.js.


mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.
// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection

var db = mongoose.connect('mongodb://localhost:27017/contact-manager'); // Converts value to lowercase

function toLower(v) {
  return v.toLowerCase();
} // Define a contact Schema


var contactSchema = mongoose.Schema({
  firstname: {
    type: String,
    set: toLower
  },
  lastname: {
    type: String,
    set: toLower
  },
  phone: {
    type: String,
    set: toLower
  },
  email: {
    type: String,
    set: toLower
  }
}); // Define model as an interface with the database

var Contact = mongoose.model('Contact', contactSchema);
/**
 * @function  [addContact]
 * @returns {String} Status
 */

var addContact = function addContact(contact) {
  Contact.create(contact, function (err) {
    assert.equal(null, err);
    console.info('New contact added');
    db.disconnect();
  });
};
/**
 * @function  [getContact]
 * @returns {Json} contacts
 */


var getContact = function getContact(name) {
  // Define search criteria. The search here is case-insensitive and inexact.
  var search = new RegExp(name, 'i');
  Contact.find({
    $or: [{
      firstname: search
    }, {
      lastname: search
    }]
  }).exec(function (err, contact) {
    assert.equal(null, err);
    console.info(contact);
    console.info("".concat(contact.length, " matches"));
    db.disconnect();
  });
}; // Export all methods


module.e;