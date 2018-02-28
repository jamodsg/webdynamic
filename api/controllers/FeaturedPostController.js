/**
 * FeaturedPostController
 *
 * @description :: Server-side logic for managing Featuredposts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var htmlToText = require('html-to-text');
var s = require("underscore.string");

module.exports = {
  getFeaturedPostWithPostIdentifier: function(post_id, success, failure) {
    var lang = sails.config.asiacell.lang;
    FeaturedPost
      .find({relatedPost: post_id, sort:'order ASC'})
      .populate('post')
      .exec(function(err, result){

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
                var summary = "";
                if (post.translatedContentBy[0] && post.translatedContentBy[0].summary) {
                  summary = htmlToText.fromString(post.translatedContentBy[0].summary, {
                    wordwrap: false
                  });
                } else {
                  summary = htmlToText.fromString(post.translatedContentBy[0]?post.translatedContentBy[0].content:'N/A', {
                    wordwrap: false
                  });
                  summary = s.truncate(summary, 128);
                }

                key.summary = summary;

                if (post.translatedFeaturedImageBy[0]) {
                  key.featured = post.translatedFeaturedImageBy[0].content;
                }

                key.title = post.translatedTitleBy[0].content;
                key.post.permalink = key.post.permalink + '?lang=' + lang;
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

