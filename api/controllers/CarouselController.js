/**
 * CarouselController
 *
 * @description :: Server-side logic for managing carousels
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var htmlToText = require('html-to-text');
var s = require("underscore.string");

module.exports = {

  getCarouselWithPostIdentifier: function(post_id, success, failure) {
    var lang = sails.config.asiacell.lang;
    Carousel.find({relatedPost: post_id}).populate('post').exec(function(err, result){

      if (err) {
        failure({message:'Error fetching data', error:err});
        return;
      }

        if (result.length > 0) {
          async.forEach(result, function (key, next) {

            if (key.post.id) {
              Post.findOne(key.post.id).populate('translatedContentBy', {lang: lang}).exec(function(err, post){
                if (post && post.translatedContentBy) {
                  key.content = post.translatedContentBy[0].content;
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

