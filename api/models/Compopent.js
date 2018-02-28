/**
* Compopent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      size: 100
    },
    tpl: {
      type: 'text'
    },
    template: {
      model: 'template'
    },
    data: {
      type: 'json'
    }
  }
};

