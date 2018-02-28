/**
 * PromotionsController
 *
 * @description :: Server-side logic for managing Promotions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var htmlToText = require('html-to-text');
var s = require("underscore.string");

module.exports = {
  getPromotionWithPostIdentifier: function(post_id, success, failure) {
    var lang = sails.config.asiacell.lang;
    Promotions.find({relatedPost: post_id}).populate('post').exec(function(err, result){

      if (err) {
        failure({message:'Error fetching data', error:err});
        return;
      }

      if (result.length > 0) {
        async.forEach(result, function (key, next) {

          if (key.post.id) {
            Post
              .findOne(key.post.id)
              .populate('translatedContentBy', {lang: lang})
              .populate('translatedFeaturedImageBy', {lang: lang})
              .populate('translatedTitleBy', {lang: lang})
              .exec(function(err, post){
                if (post && post.translatedContentBy) {
                  var content = "";
                  if(post.translatedContentBy[0] && post.translatedContentBy[0].content) {
                    content = post.translatedContentBy[0].content;
                  }
                  key.content = content;
                  key.featured = (post.translatedFeaturedImageBy[0])?post.translatedFeaturedImageBy[0].content:'resources/images/asiacell/ph_summary_image.jpg';
                  key.title = post.translatedTitleBy[0].content;
                }
                next();
              });
          } else {
            next();
          }
        }, function(err){
          success(result);
        });
      } else {
        failure({message:'No data', error:err});
      }
    });
  }
};

