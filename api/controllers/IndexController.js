/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var UAParser = require('ua-parser-js');
var parser = new UAParser();

module.exports = {
  index: function(req, res, next) {

    var UAParser = require('ua-parser-js');
    var parser = new UAParser();
    var ua = req.headers['user-agent'];     // user-agent header from an HTTP request
    var uaResult = parser.setUA(ua).getResult();
    sails.log.info(uaResult);

    sails.log.info('--------');
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    sails.log.info(query);
    sails.log.info('--------');

    //res.sendfile(sails.config.appPath + '/assets/index.html');
    if (req.cookies['asiacellwebsite.cookie.languageOption'] != 'en') {
      //res.view('homepage');
      sails.log.info('--- SEND RIGHT TO LEFT ----');
      res.sendfile(sails.config.appPath + '/assets/index-rtl.html');
    } else {
      res.sendfile(sails.config.appPath + '/assets/index.html');
    }
  },

  googleVerify: function(req, res, next) {
    res.sendfile(sails.config.appPath + '/assets/googleddf4e8fc39bee43b.html');
  },

  mobileApp: function(req,res, next) {
    var lang = req.param('lang');
    var url = 'https://www.asiacell.com';
    var ua = req.headers['user-agent'];     // user-agent header from an HTTP request
    var uaOS = parser.setUA(ua).getOS();
    var supportOS = ['Android', 'iOS'];

    if (uaOS.name == 'Android') {
      url = 'https://play.google.com/store/apps/details?id=com.asiacell.asiacellodp';
    } else if (uaOS.name == 'iOS') {
      url = 'https://itunes.apple.com/us/app/asiacell/id1037701735?mt=8'
    }

    if(supportOS.indexOf(uaOS.name) > -1) {
      if (lang == 1) {
        messageHTML = 'أهلاً بك في آسيايل، يرجى تحميل التطبيق على الرابط التالي: <a href="'+url+'">'+url+'</a>';
      } else if (lang == 2){
        messageHTML = 'بةخيربييت بؤ ئاسياسيل، بؤ دابةزاندنى ئةبليكةيشنةكه کلیك لەسەر ئەم لينكه بکە: <a href="'+url+'">'+url+'</a>';
      } else if (lang == 3) {
        messageHTML = 'Welcome to Asiacell, please click on the link below to download application: <a href="'+url+'">'+url+'</a>';
      }
      return res.redirect(url);
    } else {

      if (lang == 1) {
        messageHTML = 'عذراً! لا يتوفر تطبيق آسيايسل لنوعية جهازك في الوقت الحالي.';
      } else if (lang == 2){
        messageHTML = 'ببوره! له ئيستادا ئةبليكةيشنى ئاسياسيل بةردةست نيه بؤ جؤرى مؤبايلةكةت.';
      } else if (lang == 3) {
        messageHTML = 'Sorry! Asiacell application is currently not available for your phone.';
      }
    }
    return res.view('mobileApp', {message:messageHTML});
  }
};

