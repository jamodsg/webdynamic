/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'ac_post',
  attributes: {
    id : {
      type: 'integer',
      required: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      size: 100,
      required: true
    },
    pageData: {
      type: 'json'
    },
    template: {
      model: 'template'
    },
    parent: {
      model: 'post'
    },
    homePage:{
      type: 'boolean',
      defaultsTo: false
    },
    children: {
      collection: 'post',
      via: 'parent'
    },
    menu: {
      model:'menu',
      via:'post'
    },
    level: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    permalink: {
      type:'string'
    },
    translatedFeaturedImageBy: {
      collection:'featureimagetranslation',
      via: 'post'
    },
    translatedDetailImageBy: {
      collection:'detailimagetranslation',
      via: 'post'
    },
    translatedContentBy: {
      collection: 'posttranslation',
      via: 'post'
    },
    translatedTitleBy: {
      collection: 'titletranslation',
      via: 'post'
    },
    translatedSummaryBy: {
      collection: 'summarytranslation',
      via: 'post'
    },
    popularRate: {
      type: 'integer'
    },
    hideFromSearch: {
      type: 'boolean',
      defaultsTo:false
    },
    hideFromVisitor: {
      type: 'boolean',
      defaultsTo:false
    },
    order: {
      type: 'integer'
    },
    linkToPost: {
      type: 'integer'
    }
  }
};

