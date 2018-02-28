/**
* Template.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    template_name: {
      type: 'string',
      size: 100
    },
    tpl: {
      type: 'text'
    },
    template_url: {
      type:'string',
      size: 200
    }
  }
};

