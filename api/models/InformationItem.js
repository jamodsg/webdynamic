/**
* Menu.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'ac_info_item',
  attributes: {
    id: {
      type: 'integer',
      required: false,
      primaryKey: true,
      autoIncrement: true
    },
    header: {
      type: 'string',
      required: true
    },
    content: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    }
  }
};
