/**
 * APIController
 *
 * @description :: Server-side logic for managing APIS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// declare
var winston = require('winston');
var UAParser = require('ua-parser-js');
var parser = new UAParser();
var s = require("underscore.string");
var htmlToText = require('html-to-text');
var fs = require('fs');
var get_ip = require('ipware')().get_ip;

// declare controller
var menuController = require('./MenuController');
var menuLocationController = require('./MenuLocationController');
var postController = require('./PostController');
var templateController = require('./TemplateController');
var translationController = require('./TranslationController');
var carouselController = require('./CarouselController');
var newsController = require('./NewsController');
var featuredPostController = require('./FeaturedPostController');
var promotionsController = require('./PromotionsController');

var noContentResponse = function(res) {
  res.status(204);
  res.json({success:false, data:{}, message:'no content'});
}

var successResponse = function(res,result) {
  res.status(200);
  res.json({success:true, data:result});
}

var stringMessageWithReqAndRes = function(req, res) {
  var result = {};
  var ua = req.headers['user-agent'];     // user-agent header from an HTTP request
  var uaResult = parser.setUA(ua).getResult();

  var ip = get_ip(req);
  result.ip = ip;
  result.requestPath = req.originalUrl;
  result.requestHost = req.baseUrl;
  result.ua = uaResult;
  result.date = new Date();

  return result;
}

var logSuccess = function(req, res, message) {
  var stringMessage = stringMessageWithReqAndRes(req, res);
  stringMessage.message = message;
  stringMessage.status = 'success';
  sails.log.info(JSON.stringify(stringMessage));
}

var logError = function(req, res, message) {
  var stringMessage = stringMessageWithReqAndRes(req, res);
  stringMessage.message = message;
  stringMessage.status = 'error';
  sails.log.info(JSON.stringify(stringMessage));
}


//var moveMissingImageToBottom =

module.exports = {
  tokenStorage: function(req, res) {
    var token = req.body['token'],
      deviceID = req.body['deviceID'];

    TokenStorage.findOrCreate({fingerPrint:deviceID},{token:token}).exec(function createFindCB(error, createdOrFoundRecords){
      var message = 'token has been tried to stored';
      if (!createdOrFoundRecords) {
        console.log('Token created!');
        res.status(200);
        res.json({success:true, message:message});
      } else {
        TokenStorage.update({fingerPrint:deviceID},{token:token}).exec(function afterwards(err, updated){
          if (err) {
            // handle error here- e.g. `res.serverError(err);`
            return;
          }
          console.log('Token updated!');
          res.status(200);
          res.json({success:true, message:'Token updated!'});
        });
      }
    });
    
  }

  ,getTokenByDeviceID: function(req, res) {
    var deviceID = req.param('deviceID');
    TokenStorage.findOne({fingerPrint:deviceID}).exec(function createFindCB(error, createdOrFoundRecords){
      console.log(error);
      console.log('deviceID is ' + deviceID);
      if (createdOrFoundRecords) {
        console.log('Token Fetched!');
        res.status(200);
        res.json({success:true, message:'Fetched token', data:createdOrFoundRecords});
      } else {
        res.json({success:false, message:'No token found for this deviceID', data:createdOrFoundRecords});
      }
    });
    
  }

  // response menu item for mainMenu
  ,menuCollection: function(req, res) {
    var menuItemJSON = menuController.mainMenu(function(menuItems){
      res.status(200);
      res.json({success:true, data:menuItems});
    },function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  // response menu item for menuLocation
  ,menuLocation: function (req, res) {
    var location_id = req.param('location_id');
    sails.config.asiacell.lang = req.param('lang');
    var menuItems = menuController.menuWithLocationIdentifier(location_id,function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true, data:result});
    },function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  // response menu
  ,getMenuByMenuIdentifier: function(req, res) {
    var menu_id = req.param('menu_id');
    var menuItems = menuController.menuWithMenuIdentifier(menu_id, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true, data:result});
    }, function(error){
      res.status(200);
      res.json({success:false, data:null});
    });

  }

  // response post data for giving link

  ,getPostByLink: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    sails.config.asiacell.userAgentScreenType = req.headers.useragentscreentype;
    var link = decodeURIComponent(req.param('link'));
    postController.postWithLink(link, function(post){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success: true, data: templateController.pageDataForPostWithTemplate(post)});
    } ,function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  ,getPostsChildren: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    var lang = sails.config.asiacell.lang;
    var post_id = req.param('post_id');

    postController.getPostsChildWithPostIdentifier(post_id, function(result){
      res.status(200);

      var title = 'NA';

      if (result.translatedTitleBy[0]) {
        title = result.translatedTitleBy[0].content;
      }
      var data = {name: title};

      var postChildren = result.children;
      var submenu = [];
      var index = 0;
      var maxChar = 42;

      _.forEach(postChildren, function(item, key){
        var divCollapseID = "collapse"+index;

        title = 'NA';

        if (item.translatedTitleBy[0]) {
          title = item.translatedTitleBy[0].content;
        }

        var subitem = {name: s.truncate(title, maxChar), link: item.permalink + '?lang=' + lang, id: item.id, collapseId:divCollapseID};
        if (item.children.length > 0) {
          subitem.dataToggle = 'data-toggle="collapse"';
          subitem.link = divCollapseID;

          var subitemchildren = [];
          _.forEach(item.children, function(subitemchild, key){
            subitemchildren.push({name: s.truncate(subitemchild.name, maxChar), id: item.id, link: subitemchild.permalink + '?lang=' + lang});
          });
          subitem.children = subitemchildren;
        }
        submenu.push(subitem);
        index++;
      });

      data.subposts = submenu;

      logSuccess(req, res, 'success');
      res.json({success:true, data:data});
    }, function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  ,getNews: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    var post_id = req.param('post_id');
    var lang = sails.config.asiacell.lang;

    var responseSuccess = function(data) {
      res.status(200);
      res.json({success:true, data:data});
    }

    postController.postWithParentIdentifier(post_id, function(result){
      if (result.length > 0) {

        // fetching each post for tranlsation content
        async.forEach(result, function (key, next) {

          if (key.id) {
            Post
              .findOne(key.id)
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
                    var tempSummary = (post.translatedContentBy[0])?post.translatedContentBy[0].content:'N/A';
                    summary = htmlToText.fromString(tempSummary, {
                      wordwrap: false
                    });
                    summary = s.truncate(summary, 128);
                  }

                  key.summary = summary;
                  if (post.translatedFeaturedImageBy[0]) {
                    key.featured = post.translatedFeaturedImageBy[0].content;
                  }
                  key.title = (post.translatedTitleBy[0])?post.translatedTitleBy[0].content:'N/A';
                }
                next();
              });
          } else {
            next();
          }
        }, function(err){
          logSuccess(req, res, 'success');
          responseSuccess(result);
        });
      } else {

        // no content
        res.status(204);
        res.end();
      }
    }, function(error){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:false, data:null});
    });
  }

  ,getHealthyStatus: function(req, res) {

    var response = function(message) {
      res.send(message);
    }

    fs.readFile('./healthy.json', 'utf8', function (err,data) {
      if (err) {
        response('fail');
      }
      response(data);
    });
  }

  ,createFeedback: function(req, res) {

    Survey.create(req.body).exec(function(err, created){
      if(err) {
        console.log('error ->' + err);
        res.status(200);
        res.json({success: false});
      } else {
        console.log('success created');
        res.status(200);
        res.json({success: true});
      }
    });
  }

  // response post data for giving post_identifier
  ,postWithPostIdentifier: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    var post_id = req.param('post_id');
    postController.postWithPostIdentifier(post_id, function(post){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success: true, data: templateController.pageDataForPostWithTemplate(post)});
    } ,function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  // response breadcrumb
  ,getBreadcrumbByPostIdentifier: function(req, res) {
    postController.breadcrumbWithPostIdentifier(req.param('post_id'), function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true, data:{breadcrumb: result.reverse()}});
    }, function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  // response template data for giving template_identifier
  ,getTemplateByIdentifier: function(req, res) {
    var template_id = req.param('template_id');

    templateController.templateWithIdentifier(template_id, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true, data:result});
    },function(error){
      res.status(200);
      res.json({success:false, data:null});
    });
  }

  // get translation

  ,getTranslation: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    translationController.loadTranslationWithLocal(function(result){
      res.status(200);

      // covert array to object
      var translation = {};
      _.forEach(result, function(item){
        translation[item.key] = item.value;
      });
      logSuccess(req, res, 'success');
      res.json({success:true, data:translation});
    }, function(err){
      res.status(200);
      res.json({success:false, data:err});
    })
  }

  // get carousel

  ,getCarousel: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    var carouselPostIdentifier = req.param('post_id');

    Post
      .findOne({id:req.param('post_id')})
      .exec(function(err, foundPost){
        if (foundPost) {
          if (foundPost.linkToPost) {
            carouselPostIdentifier = foundPost.linkToPost;
          }
          processCarousel(req, res, carouselPostIdentifier);
        } else {
          sails.log.debug('Error: Carousel Begine - Cannot get information for post -> ' + post_id);
          noContentResponse(res);
        }
      });

    var processCarousel = function(req, res, carouselPostIdentifier) {
      carouselController.getCarouselWithPostIdentifier(carouselPostIdentifier, function (result) {
        res.status(200);
        logSuccess(req, res, 'success');
        res.json({successful: true, data: result});
      }, function (error) {
        logError(req, res, 'process carousel error');
      });
    };
  }

  ,getFeaturedPost: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    featuredPostController.getFeaturedPostWithPostIdentifier(req.param('post_id'), function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({successful: true, data: result});
    }, function(error){
      res.status(200);
      res.json({successful: false, data: error});
    });
  }

  ,getLatestNews: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    newsController.getNewsWithPostIdentifier(req.param('post_id'), function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({successful: true, data: result});
    }, function(error){
      res.status(200);
      res.json({successful: false, data: error});
    });
  }

  ,getPromotions: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    promotionsController.getPromotionWithPostIdentifier(req.param('post_id'), function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({successful: true, data: result});
    }, function(error){
      res.status(200);
      res.json({successful: false, data: error});
    });
  }

  ,getSearch: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    var lang = sails.config.asiacell.lang;
    if (req.param('search').length == 0) {
      res.status(204);
      res.json({success:true, data: []});
      return;
    }
    try {
      var searchString = decodeURIComponent(req.param('search'));
      searchString = searchString.replace('%2E','.');

      var queryString = "SELECT post, 1 as rank FROM posttranslation\
                          WHERE MATCH(content) AGAINST('"+searchString+"' IN BOOLEAN MODE)\
                          AND lang='"+lang+"'\
                          UNION DISTINCT\
                          SELECT post, (content like '%"+searchString+"%')*1 as rank FROM titletranslation\
                          WHERE content LIKE '%"+searchString+"%'\
                          UNION DISTINCT\
                          SELECT post, 9 as rank FROM searchhelper\
                          WHERE keyword LIKE '%"+searchString+"%'\
                          GROUP BY post\
                          ORDER BY rank DESC";

      /*
       AND NOT EXISTS (SELECT * FROM ac_post\
       WHERE ac_post.id = posttranslation.post\
       AND ac_post.hideFromVisitor = 0)\
       */

      PostTranslation.query(queryString, function (err, result) {
        if (!err) {

          if (result.length > 0) {
            var searchResult = [];
            async.forEach(result, function (key, next) {
              Post
                .findOne({id:key.post})
                .populate('translatedTitleBy', {lang: lang})
                .populate('translatedSummaryBy', {lang: lang})
                .populate('translatedContentBy', {lang: lang})
                .exec(function (err, post) {

                  var summary = '';

                  if (post) {
                    if (post.translatedContentBy.length > 0) {
                      summary = htmlToText.fromString(s.truncate(post.translatedContentBy[0].content, 600), {
                        wordwrap: false
                      });
                    }
                    // push the current object only if the hideFromSearch is not true
                    if (post.hideFromSearch !== true) {
                      searchResult.push({
                        id: post.id,
                        permalink: post.permalink + '?lang=' + sails.config.asiacell.lang,
                        title: (post.translatedTitleBy[0]) ? post.translatedTitleBy[0].content : 'N/A',
                        summary: summary
                      });
                    }
                  }
                  next();
                });
            }, function (err) {
              res.status(200);
              logSuccess(req, res, 'success');
              res.json({successful: true, data: searchResult});
            });
          } else {

            // add record to search statistic
            SearchStatistics.create({keyword:searchString}).exec(function(err,result){
              if (!err) {
                console.log('search not found, but noted the search term');
              }
            });

            res.status(204);
            res.json({successful: true, data: []});
          }
        } else {
          //res.json({successful: false, data: err});
          res.json({successful: false, data: {message:'Fail to get the search result'}});
        }
      });
    } catch (e) {
      console.log("Error ->"+e);
    }
  }
  ,getKsSearch: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');
    var lang = sails.config.asiacell.lang;
    if (req.param('search').length == 0) {
      res.status(204);
      res.json({success:true, data: []});
      return;
    }
    try {
      var searchString = decodeURIComponent(req.param('search'));
      searchString = searchString.replace('%2E','.');

      var queryString = "SELECT post FROM searchhelper WHERE keyword LIKE '%" + searchString + "%' GROUP BY post";

      /*
       AND NOT EXISTS (SELECT * FROM ac_post\
       WHERE ac_post.id = posttranslation.post\
       AND ac_post.hideFromVisitor = 0)\
       */

      PostTranslation.query(queryString, function (err, result) {
        if (!err) {

          if (result.length > 0) {
            var searchResult = [];
            async.forEach(result, function (key, next) {
              Post
                .findOne({id:key.post})
                .populate('translatedTitleBy', {lang: lang})
                .populate('translatedSummaryBy', {lang: lang})
                .populate('translatedContentBy', {lang: lang})
                .exec(function (err, post) {

                  var summary = '';

                  if (post) {
                    if (post.translatedContentBy.length > 0) {
                      summary = htmlToText.fromString(s.truncate(post.translatedContentBy[0].content, 600), {
                        wordwrap: false
                      });
                    }
                    searchResult.push({
                      id: post.id,
                      permalink: post.permalink + '?lang=' + sails.config.asiacell.lang,
                      title: (post.translatedTitleBy[0]) ? post.translatedTitleBy[0].content : 'N/A',
                      summary: summary
                    });
                  }
                  next();
                });
            }, function (err) {
              res.status(200);
              logSuccess(req, res, 'success');
              res.json({successful: true, data: searchResult});
            });
          } else {

            // add record to search statistic
            SearchStatistics.create({keyword:searchString}).exec(function(err,result){
              if (!err) {
                console.log('search not found, but noted the search term');
              }
            });

            res.status(204);
            res.json({successful: true, data: []});
          }
        } else {
          //sails.config.environment
          //res.json({successful: false, data: err});
          res.json({successful: false, data: {message:'Fail to get the search result'}});
        }
      });
    } catch (e) {
      console.log("Error ->"+e);
    }
  }
  ,getSitemap: function(req, res) {
    sails.config.asiacell.lang = req.param('lang');

    var menuItems = menuController.menuWithLocationIdentifier('1',function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true, data:result});
    },function(error){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:false, data:null});
    });
  }

  ,getPopupPromotion: function(req, res) {
    var lang = sails.config.asiacell.lang = req.param('lang');
    Promotions
      .findOne({popup: true})
      .populate('post')
      .populate('translatedPopupImageBy')
      .exec(function(err, result){
        if(!err) {
          if (result) {
            var resultForPopupPromotion = {};
            resultForPopupPromotion['popupImage'] = result.translatedPopupImageBy ? result.translatedPopupImageBy[0].content : '';
            resultForPopupPromotion['permalink'] = result.post.permalink + '?lang=' + sails.config.asiacell.lang;
            logSuccess(req, res, 'success');
            successResponse(res, resultForPopupPromotion);
          } else {
            logError(req, res, 'fetching promotion but no result');
            noContentResponse(res);
          }
        } else {
          logError(req, res, 'fetching promotion but no error issued');
          noContentResponse(res);
        }
      });
  }

  ,getRefID: function(req, res) {
    var ip = get_ip(req);
    var uuid = require('node-uuid');
    var newRefId = uuid.v1();
    var lastVisitedDate = new Date();

    ClientIdentifier.findOrCreate(
      {clientIP: ip.clientIp},
      {clientIP: ip.clientIp, refID:newRefId, lastVisitedDate:lastVisitedDate},
      function(err, result){
        if (!err) {
          result.lastVisitedDate = lastVisitedDate;
          successResponse(res, {refid:result.refID});
        } else {
          logError(req, res, err);
          res.status(502);
          res.json({success:false});
        }
      });

  }

  // create menu location
  ,createMenuLocation: function(req, res) {
    var param = {name:req.param('name')};
    menuLocationController.addMenuLocation(param, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true});
    }, function(error){
      res.status(200);
      rest.json({success:false});
    });
  }

  // create menu item
  ,createMenu: function(req, res) {
    var param = this.paramFromRequest(req);
    menuController.addMenu(param, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true});
    }, function(error){
      res.status(200);
      res.json({success:false});
    });
  }

  // create post item
  ,createPost: function(req, res) {
    var param = this.paramFromRequest(req);

    postController.addPost(param, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true});
    }, function(error){
      res.status(200);
      res.json({success:false});
    });
  }

  // create template
  ,createTemplate: function(req, res) {
    var param = this.paramFromRequest(req);

    templateController.addTemplate(param, function(result){
      res.status(200);
      logSuccess(req, res, 'success');
      res.json({success:true});
    }, function(error){
      res.status(200);
      res.json({success:false});
    });
  }
  // util

  ,paramFromRequest: function(req) {
    var param = {};

    // if req header is form-data
    return req.body;
  }

  /**
   * Redirect to Asiacell Mobile App
   * */
  ,mobileapp: function(req, res) {
    var lang = 'en';
    var url = 'https://www.asiacell.com';
    var ua = req.headers['user-agent'];     // user-agent header from an HTTP request
    var uaOS = parser.setUA(ua).getOS();

    if (req.param('lang'))

      if (uaOS.name == 'Android') {
        url = 'https://play.google.com/store/apps/details?id=com.asiacell.asiacellodp';
      } else if (uaOS.name == 'iOS') {
        url = 'https://itunes.apple.com/us/app/asiacell/id1037701735?mt=8'
      }
    return res.redirect(url);
  }
};

