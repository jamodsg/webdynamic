/**
 * TranslationController
 *
 * @description :: Server-side logic for managing translations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  loadTranslationWithLocal: function(success, failure) {
    var lang = sails.config.asiacell.lang;
    Translation.find({lang: lang}).exec(function(err, result){
      if(!err) {
        success(result);
      } else {
        failure(err);
      }
    });
  }
};

