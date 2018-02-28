/**
* Menu.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'ac_menu',
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
    content: {
      type: 'string',
      required: true
    },
    order: {
      type: 'integer'
    },
    link: {
      type: 'string'
    },
    location: {
      model: 'menuLocation'
    },
    parent: {
      model: 'menu'
    },
    submenu: {
      collection: 'menu',
      via: 'parent'
    },
    post: {
      model: 'post',
      vai: 'menu'
    },
    translatedBy: {
      collection: 'menutranslation',
      via: 'menu'
    }
  }
};

