/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// declare underscore
var s = require("underscore.string");
var Promise = require("bluebird");

module.exports = {
	postWithPostIdentifier: function(post_id, success, failure) {
    var lang = sails.config.asiacell.lang;
    var findingPost = {id: post_id};

    Post
      .find({id:post_id})
      .populate('children', {hideFromVisitor: false})
      .populate('template')
      .populate('translatedContentBy', {lang: lang})
      .populate('translatedSummaryBy', {lang: lang})
      .populate('translatedTitleBy', {lang: lang})
      .populate('translatedFeaturedImageBy', {lang: lang})
      .exec(function(error, foundPost){
      if (!error) {
        // fetch translation of children
        if (foundPost[0] && foundPost[0].children.length > 0) {
          async.forEach(foundPost[0].children, function (key, next) {
            Post
              .findOne({id:key.id})
              .populate('translatedContentBy', {lang: lang})
              .populate('translatedSummaryBy', {lang: lang})
              .populate('translatedTitleBy', {lang: lang})
              .populate('translatedFeaturedImageBy', {lang: lang})
              .exec(function(error, result){
                //key = result;
                key.translatedTitleBy.push(result.translatedTitleBy[0]);
                key.translatedSummaryBy.push(result.translatedSummaryBy[0]);
                key.translatedContentBy.push(result.translatedContentBy[0]);
                key.translatedFeaturedImageBy.push(result.translatedFeaturedImageBy[0]);
                next();
              });
          }, function (err) {
            success(foundPost[0]);
          });
        } else {
          success(foundPost[0]);
        }
      } else {
        failure(error);
      }
    });
  }

  ,postWithParentIdentifier: function(post_id, success, failure) {

    var findingPost = {parent: post_id, hideFromVisitor:false, sort:'createdAt DESC'};
    Post.find(findingPost).exec(function(error, foundPost){
      if (!error) {
        success(foundPost);
      } else {
        failure(error);
      }
    });
  }

  ,getPostsChildWithPostIdentifier: function(post_id, success, failure) {
    var findingPost = {id: post_id};
    var lang = sails.config.asiacell.lang;
    Post
      .find({id:post_id})
      .populate('children', {hideFromVisitor: false, sort:'order ASC'})
      .populate('translatedTitleBy', {lang: lang})
      .exec(function(err, result){
      if (!err && result.length > 0){
        var post = result[0];
        var numberOfChild = post.children.length;
        var index = 0;
        _.forEach(post.children, function(postItem, key){

          var postTranslatedIdentifier = postItem.id;

          if (postItem.linkToPost){
            postTranslatedIdentifier = postItem.linkToPost;
          }

          Post.findOne({id:postTranslatedIdentifier})
            .populate('children', {hideFromVisitor: false, sort:'order ASC'})
            .populate('translatedTitleBy', {lang: lang})
            .exec(function(err, result){
            index ++;
            if (!err) {
              postItem.children = result.children;
              postItem.translatedTitleBy.push(result.translatedTitleBy[0]);
              if (index == numberOfChild) {

                // fetching translate
                if (post.linkToPost) {
                  Post
                    .findOne({id:post.linkToPost})
                    .populate('translatedTitleBy', {lang: lang})
                    .exec(function(err, translatedResult){
                      if(translatedResult) {
                        post.translatedTitleBy.push(translatedResult.translatedTitleBy[0]);
                        success(post);
                      } else {
                        success(post);
                      }
                    });
                } else {
                  success(post);
                }
              }
            }

          });

        });

      } else {
        failure(err);
      }
    });
  }

  // response breadcumb
  ,breadcrumbWithPostIdentifier: function(post_id, success, failure) {
    var lang = sails.config.asiacell.lang;
    var output = [];
    var recursiveFunc = function(lastChildren) {
      if (lastChildren.parent) {
        Post
          .find({id:lastChildren.parent})
          .populate('translatedTitleBy', {lang: lang})
          .exec(function(err, result){
          if (!err) {
            if (result[0].linkToPost) {
              Post
                .findOne({id:result[0].linkToPost})
                .populate('translatedTitleBy', {lang: lang})
                .exec(function(err, linkedPost){
                  if (result) {
                    result[0].translatedTitleBy.push(linkedPost.translatedTitleBy[0]);
                    loop(result);
                  } else {
                    loop(result);
                  }
                });
            } else {
              loop(result);
            }
          } else {
            failure(err);
          }
        });
      } else {
        success(output);
      }
    }

    var loop = function(result) {
      var post = result[0];
      var title = 'NA';

      if (post.translatedTitleBy[0]) {
        title = post.translatedTitleBy[0].content;
      }
      output.push({name: title, link: post.permalink + '?lang=' + lang});
      recursiveFunc(post);
    }

    Post
      .find({id:post_id})
      .populate('translatedTitleBy', {lang: lang})
      .exec(function(err, result){
      if (!err && result.length > 0){

        // if post is linking, get title from link table
        if (result[0].linkToPost) {
          Post
            .findOne({id:result[0].linkToPost})
            .populate('translatedTitleBy', {lang: lang})
            .exec(function(err, linkedPost){
              if (result) {
                result[0].translatedTitleBy.push(linkedPost.translatedTitleBy[0]);
                loop(result);
              } else {
                loop(result);
              }
            });
        } else {
          loop(result);
        }
      } else {
        failure(err);
      }
    });
  }

  // give post by link
  ,postWithLink:function(link, success, failure) {
    var lang = sails.config.asiacell.lang;
    Post.find({permalink:link, parent: {'>': 0}})
      .populate('children', {hideFromVisitor: false, sort:'order ASC'})
      .populate('template')
      .populate('translatedContentBy', {lang: lang})
      .populate('translatedSummaryBy', {lang: lang})
      .populate('translatedTitleBy', {lang: lang})
      .populate('translatedFeaturedImageBy', {lang: lang})
      .populate('translatedDetailImageBy', {lang: lang})
      .exec(function(error, foundPost){
      if (!error) {

        // declare a function to fetch children of specific post
        var fetchingChildren = function(foundPost, updateChildLink) {
          // fetch translation of children
          if (foundPost[0] && foundPost[0].children.length > 0) {
            var parentPost = foundPost[0];

            // transfering contect each child
            async.forEach(foundPost[0].children, function (key, next) {
              Post
                .findOne({id:key.id})
                .populate('translatedContentBy', {lang: lang})
                .populate('translatedSummaryBy', {lang: lang})
                .populate('translatedTitleBy', {lang: lang})
                .populate('translatedFeaturedImageBy', {lang: lang})
                .populate('translatedDetailImageBy', {lang: lang})
                .exec(function(error, result){

                  // link from one post to another
                  if (updateChildLink) {
                    var permalink = parentPost.permalink + "/" + s.slugify(key.name);
                    Post
                      .findOrCreate({parent:foundPost[0].id, linkToPost:key.id},
                      {
                        parent:foundPost[0].id,
                        linkToPost:key.id,
                        permalink: permalink + '?lang=' + lang,
                        name: result.name,
                        template: key.template,
                        hideFromVisitor: false,
                        pageData: {}
                      })
                      .exec(function(err, founded){
                        if (founded) {
                          key.translatedTitleBy.push(result.translatedTitleBy[0]);
                          key.translatedSummaryBy.push(result.translatedSummaryBy[0]);
                          key.translatedContentBy.push(result.translatedContentBy[0]);
                          key.translatedFeaturedImageBy.push(result.translatedFeaturedImageBy[0]);
                          key.translatedFeaturedImageBy.push(result.translatedDetailImageBy[0]);
                          key.permalink = permalink + '?lang=' + lang;
                          template: key.template;
                          pageData: {};
                          next();
                        }else{
                          next();
                        }
                      });

                  } else {
                    key.translatedTitleBy.push(result.translatedTitleBy[0]);
                    key.translatedSummaryBy.push(result.translatedSummaryBy[0]);
                    key.translatedContentBy.push(result.translatedContentBy[0]);
                    key.translatedFeaturedImageBy.push(result.translatedFeaturedImageBy[0]);
                    key.translatedFeaturedImageBy.push(result.translatedDetailImageBy[0]);
                    next();
                  }

                });
            }, function (err) {
              success(foundPost[0]);
            });
          }else {
            success(foundPost[0]);
          }
        }

        // modify the link
        // link content of source post
        if (foundPost[0] && (foundPost[0].linkToPost)) {
          Post.findOne({id:foundPost[0].linkToPost, parent: {'>': 0}})
            .populate('children', {hideFromVisitor: false, sort:'order ASC'})
            .populate('template')
            .populate('translatedContentBy', {lang: lang})
            .populate('translatedSummaryBy', {lang: lang})
            .populate('translatedTitleBy', {lang: lang})
            .populate('translatedFeaturedImageBy', {lang: lang})
            .populate('translatedDetailImageBy', {lang: lang})
            .exec(function(error, linkedPost) {
              if(!error){
                //
                try {
                  foundPost[0].template = linkedPost.template;
                  foundPost[0].children = linkedPost.children;
                  foundPost[0].translatedContentBy = linkedPost.translatedContentBy;
                  foundPost[0].translatedSummaryBy = linkedPost.translatedSummaryBy;
                  foundPost[0].translatedTitleBy = linkedPost.translatedTitleBy;
                  foundPost[0].translatedFeaturedImageBy = linkedPost.translatedFeaturedImageBy;
                  foundPost[0].translatedDetailImageBy = linkedPost.translatedDetailImageBy;

                  // modify children link
                  // link content of source children
                  fetchingChildren(foundPost, true);
                } catch (err) {
                  sails.log.debug('Unexpected error while transfer content from link to post -> ' + foundPost[0].linkToPost);
                }

                //fetchingChildren(foundPost);
              }else{
                sails.log.debug('fail to load link content for post -> ' + foundPost[0].linkToPost);
                failure(error);
              }
            });
        } else {
          fetchingChildren(foundPost);
        }

      } else {
        failure(error);
      }
    });

  }
  // create post
  ,addPost: function(newPost, success, failure) {
    Post.create(newPost).exec(function(err, created){
      if (!err) {
        success({message:'New post row created!'});
      } else {
        failure(err);
      }
    });
  }

  // logic
};

