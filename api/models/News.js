/**
* News.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    relatedPost: {
      type: 'integer' // must be post id
    },
    post: {
      model: 'Post'
    },
    showOnHome: {
      type: 'boolean',
      defaultTo: false
    }
  }
};

