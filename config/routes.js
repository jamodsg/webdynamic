/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

var vidStreamer = require("vid-streamer");

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'get /wap': {
    view: 'homepage'
  },

  'get /videos/:videofile': vidStreamer,

  'get /!': 'IndexController.index',

  'get /': 'IndexController.index',
  'get /index.html': 'IndexController.index',

  'get /googleddf4e8fc39bee43b.html': 'IndexController.googleVerify',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'get /api/v10/menuLocation/:location_id/:lang': {
    controller: "APIController",
    action: "menuLocation",
    cors: true
  }

  ,'get /api/v10/post/:post_id/:lang': {
    controller: "APIController",
    action: "postWithPostIdentifier",
    cors: true
  }

  ,'get /api/v10/menu/:menu_id/:lang': {
    controller: "APIController",
    action: "getMenuByMenuIdentifier",
    cors: true
  }

  ,'get /api/v10/template/:template_id/:lang': {
    controller: "APIController",
    action: "getTemplateByIdentifier",
    cors: true
  }

  ,'get /api/v10/breadcrumb/:post_id/:lang': {
    controller: "APIController",
    action: "getBreadcrumbByPostIdentifier",
    cors: true
  }

  ,'get /api/v10/postByLink/:link/:lang': {
    controller: "APIController",
    action: "getPostByLink",
    cors: true
  }

  // retrieve posts which is child of post with identifer
  ,'get /api/v10/posts/:post_id/:lang': {
    controller: "APIController",
    action: "getPostsChildren",
    cors: true
  }

  // translation
  ,'get /api/v10/translation/:lang':{
    controller: "APIController",
    action: "getTranslation",
    cors: true
  }

  ,'get /api/v10/carousel/:post_id/:lang': {
    controller: "APIController",
    action: "getCarousel",
    cors: true
  }

  ,'get /api/v10/featured/:post_id/:lang': {
    controller: "APIController",
    action: "getFeaturedPost",
    cors: true
  }

  ,'get /api/v10/latestnews/:post_id/:lang': {
    controller: "APIController",
    action: "getLatestNews",
    cors: true
  }

  ,'get /api/v10/promotions/:post_id/:lang': {
    controller: "APIController",
    action: "getPromotions",
    cors: true
  }

  ,'get /api/v10/search/:search/:lang': {
    controller: "APIController",
    action: "getSearch",
    cors: true
  }

  ,'post /api/v10/tokenStorage': {
    controller: "APIController",
    action: "tokenStorage",
    cors: true
  }

  ,'get /api/v10/getTokenByDeviceID/:deviceID': {
    controller: "APIController",
    action: "getTokenByDeviceID",
    cors: true
  }

  ,'get /api/v10/ksSearch/:search/:lang': {
    controller: "APIController",
    action: "getKsSearch",
    cors: true
  }

  ,'get /api/v10/sitemap/:lang': {
    controller: "APIController",
    action: "getSitemap",
    cors: true
  }

  ,'get /api/v10/news/:post_id/:lang': {
    controller: "APIController",
    action: "getNews",
    cors: true
  }

  , 'get /healthycheck': {
    controller:"APIController",
    action: "getHealthyStatus",
    cors: true
  }

  , 'get /api/v10/popupPromotion/:lang': {
    controller:"APIController",
    action:"getPopupPromotion",
    cors: true
  }

  , 'get /api/v10/roamingInfor/:lang': {
    controller:"RoamingInformationController",
    action:"roamingInfor",
    cors: true
  }

  /*, 'get /api/v10/catpcha': {
    controller:"APIController",
    action:"getCatpcha",
    cors: true
  }*/

  , 'get /api/v10/refid/:lang': {
    controller:"APIController",
    action:"getRefID",
    cors: true
  }

  // PUT

  // action to check link of each menuItem and update the post id
  /*,'put /api/v10/autoPostMenu': {
    controller: "APIController",
    action: "autoPostMenu",
    cors: false
  }*/

  // POST

  ,'post /api/v10/feedback/:lang': {
    controller: "APIController",
    action: "createFeedback",
    cors: true
  }

  ,'post /api/v10/emailList/:lang': 'EmailListController.createEmailList'

  ,'get /api/v10/captcha/:lang':'CaptchaController.canvasImg'

  /*,'post /api/v10/menuLocation/:lang': {
    controller: "APIController",
    action: "createMenuLocation",
    cors: false
  }

  ,'post /api/v10/menu/:lang': {
    controller: "APIController",
    action: "createMenu",
    cors: false
  }

  ,'post /api/v10/post/:lang': {
    controller: "APIController",
    action: "createPost",
    cors: false
  }

  ,'post /api/v10/template/:lang': {
    controller: "APIController",
    action: "createTemplate",
    cors: false
  }*/

  /**
   * Redirect to Mobile App
   * */
  ,'get /mobileapp/:lang': 'IndexController.mobileApp'
};
