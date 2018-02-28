/**
* PostTranslation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    post: {
      model: 'post',
      via: 'translatedContentBy'
    },
    lang: {
      type: 'string',
      size: 3
    },
    content: {
      type: 'text'
    },
    summary: {
      type: 'string',
      index: 'fulltext'
    }
  }
};

