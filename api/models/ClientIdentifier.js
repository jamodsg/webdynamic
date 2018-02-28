/**
* ClientIdentifier.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    clientIP: {
      type: "string"
    },
    refID: {
      type: "string"
    },
    lastVisitedDate: {
      type: "date"
    },
    lastUserLoginNumber: {
      type: "string"
    }
  }
};

