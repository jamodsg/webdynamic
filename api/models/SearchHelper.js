/**
* SearchHelper.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    keyword: {
      type: 'string',
      size: 255
    },
    post: {
      type:'integer'
    }
  }
};

