/**
 * EmailList.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:'ac_email_subscriber',
  attributes: {
    id: {
      type: 'integer',
      required: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    }
  }
};

