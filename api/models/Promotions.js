/**
* Promotions.js
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
      model: 'Post' // Post should be single <li>content the carousel image</li>
    },
    popup: {
      type: 'boolean',
      defaultTo: false
    },
    translatedPopupImageBy: {
      collection: 'popupimagetranslation',
      via: 'promotions'
    }
  }
};

