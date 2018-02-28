/**
* Translation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    lang: {
      type: 'string',
      size: 3
    },
    key: {
      type:'string',
      size: 100
    },
    value: {
      type:'string',
      size: 255
    }
  }
};
