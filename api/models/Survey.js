/**
* Survey.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    r_design: {
      type: 'integer'
    },
    r_usability: {
      type: 'integer'
    },
    r_findinformation: {
      type: 'integer'
    },
    r_usefulinformation: {
      type: 'integer'
    },
    r_qualityhelp: {
      type: 'integer'
    },
    r_selectionexplaination: {
      type: 'integer'
    },
    c_purposevisit: {
      type: 'integer'
    },
    c_purposevisit_comment: {
      type: 'string'
    },
    yn_foundlooking: {
      type: 'integer'
    },
    yn_foundlooking_comment: {
      type: 'string'
    },
    c_sourcevisit: {
      type: 'integer'
    },
    c_sourcevisitz_comment: {
      type: 'string'
    },
    c_oftenvisit: {
      type: 'integer'
    },
    c_morecontent: {
      type: 'integer'
    },
    c_morecontent_comment: {
      type: 'string'
    },
    r_reqularvisit: {
      type: 'integer'
    },
    r_recommendvisit: {
      type: 'integer'
    },
    t_comment: {
      type: 'text'
    }
  }
};

