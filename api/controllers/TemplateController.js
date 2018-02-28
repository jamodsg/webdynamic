/**
 * TemplateController
 *
 * @description :: Server-side logic for managing Templates
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise = require("bluebird");
var s = require("underscore.string");
var htmlToText = require('html-to-text');

module.exports = {
  addTemplate: function(newTemplate, success, failure) {
    Template.create(newTemplate).exec(function(err, created){
      if (!err) {
        success({message:'New template row created!'});
      } else {
        failure(err);
      }
    });
  }

  ,templateWithIdentifier: function(template_id, success, failure) {
    //var queryString = "SELECT * FROM asiacell_informative.ac_post WHERE post_id=" + post_id;
    var findingTemplate = {id: template_id};
    Template.find(findingTemplate).exec(function(error, foundTemplate){
      if (!error) {
        success(foundTemplate[0]);
      } else {
        failure(error);
      }
    });
  }

  // manage template

  ,pageDataForPostWithTemplate: function(post) {
    var userAgentScreenType = sails.config.asiacell.userAgentScreenType

    var maxItemPerRow = function(){
      if (userAgentScreenType == "lg"){
        return 3;
      }

      if (userAgentScreenType == "md" || userAgentScreenType == "sm") {
        return 2;
      }

      if (userAgentScreenType == "xs") {
        return 1;
      }
    }

    if (!post) return; // no post founded
    if (!post.pageData) return;

    //TODO: NEXT> manage page_data by template
    // populate page data by template
    var pageData = post.pageData;
    // breadcrump
    //TODO: generagte breadcrump
    var breadcrump = {};
    pageData.breadcrump = breadcrump;

    var templateNameUseContent = ["detail",
                                  "detail_no_menu",
                                  "detail_deep",
                                  "feedback",
                                  "KadimalsahirContent",
                                  "detail_with_roaming",
                                  "EmailSubscriber"];

    // featureItem
    if (post.template.template_name == "category") {
      var featureItem = [];
      var featureItemRow = {};
      featureItemRow['row'] = [];
      var numberOfChild = post.children.length;

      for (i = 0; i < numberOfChild; i++) {
        var child = post.children[i];
        var title = 'NA';
        var summary = 'NA';
        var featuredImage = 'resources/images/asiacell/ph_summary_image.jpg'

        if (child.translatedTitleBy[0]) {
          title = child.translatedTitleBy[0].content; // trancated title to 30 characters s.truncate(child.translatedTitleBy[0].content,30);
        }

        if (child.translatedContentBy[0] && child.translatedContentBy[0].summary) {
          summary = htmlToText.fromString(child.translatedContentBy[0].summary, {
            wordwrap: false,
            hideLinkHrefIfSameAsText: true,
            ignoreHref: true
          });
        } else if (child.translatedContentBy[0] && child.translatedContentBy[0].content) {
          summary = htmlToText.fromString(child.translatedContentBy[0].content, {
            wordwrap: false,
            hideLinkHrefIfSameAsText: true,
            ignoreHref: true
          });
          summary = s.truncate(summary, 128);
        }

        if (child.translatedFeaturedImageBy[0]) {
          featuredImage = child.translatedFeaturedImageBy[0].content;
        }

        item = {
          post_id: child.id,
          name: title,
          summary: s.truncate(summary, 100),
          link: child.permalink + '?lang=' + sails.config.asiacell.lang
        };

        if (child.translatedFeaturedImageBy[0]) {
          item['image'] = featuredImage
        }

        featureItemRow['row'].push(item);

        if (((i + 1) % maxItemPerRow()) == 0) {
          featureItem.push(featureItemRow);
          featureItemRow = {};
          featureItemRow['row'] = [];
        }
      }

      if (featureItemRow['row'] && featureItemRow['row'].length > 0) {
        featureItem.push(featureItemRow);
        featureItemRow = {};
      }

      pageData.featuredItems = featureItem;
      //} else if (post.template.template_name == "detail" || post.template.template_name == "detail_no_menu" || post.template.template_name == "detail_deep" || post.template.template_name == "feedback" || post.template.template_name == "KadimalsahirContent") {
    } else if (templateNameUseContent.indexOf(post.template.template_name) > -1) {
      // get content
      var content = "";

      if (post.translatedContentBy[0]) {
        content = post.translatedContentBy[0].content;
        pageData.content = content;
        pageData.summary = content.substr(0, 100) + '...';
      }

      if (post.translatedDetailImageBy[0]) {
        pageData.detailImage = post.translatedDetailImageBy[0].content;
      }

      if (post.translatedFeaturedImageBy[0]) {
        pageData.featuredImage = post.translatedFeaturedImageBy[0].content;
      }
    }

    title = 'NA';

    if (post.translatedTitleBy[0]) {
      title = post.translatedTitleBy[0].content;
      pageData.name = title;
      pageData.title = s.truncate(title, 40);
    }

    //additional info
    pageData.permalink = post.permalink + '?lang=' + sails.config.asiacell.lang;

    var responseJSON = {
      template: post.template,
      parent: post.parent,
      id: post.id,
      pageData: pageData
    };

    return responseJSON;
  }

  ,slugifyLink: function(link){
    var links = link.split("/");
    var slugifiedLink = "";
    _.forEach(links, function(n, key) {
      slugifiedLink += "/" + s.slugify(n);
    });

    return slugifiedLink;
  }
};
