/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */



module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

   middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/
	// maxAge ==> Number of seconds strict transport security will stay in effect.
    xframe: require('lusca').xframe('SAMEORIGIN'),
    //xframe: require('lusca').xframe('DENY'),
    prerender: require('prerender-node').set('prerenderToken', 'P7yfrVNPSCC01WOZ8XOV'),
    order: [
      'startRequestTimer',
      'xframe',
      'cookieParser',
      'session',
      'hideAcessHeader',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
   ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    myRequestLogger: function (req, res, next) {
        //To preven Iframe embeded site
        res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
        res.setHeader('Strict-Transport-Security', 'max-age=31536000');
        //To preven non browser and script cross site access
        res.setHeader('x-frame-options', 'DENY');
        res.setHeader('x-content-type-options', 'nosniff');
        res.setHeader('x-xss-protection', '1; mode=block');
        res.setHeader('Allow', 'GET,POST,HEAD,OPTIONS');
        return next();
    },
    handleBodyParserError: function handleBodyParserError(err, req, res, next) {
      sails.log.error('Payload used malformed value');
      return res.send(400, 'Payload used malformed value');
    },
    hideAcessHeader: function (req, res, next) {
        var forbidenMethods = "CHECKOUT,CONNECT,COPY,DELETE,LOCK,M-SEARCH,MERGE,MKACTIVITY,MKCOL,MOVE,NOTIFY,PATCH,PROPFIND,PROPPATCH,PURGE,PUT,REPORT,SEARCH,SUBSCRIBE,TRACE,UNLOCK,UNSUBSCRIBE";

        // disable cookie by sails
        req.session = null;

        if (req.headers.host == 'localhost:9000' || req.headers.host == 'localhost:8181' || req.headers.host == '10.13.3.167:8181') {
            sails.log.debug("Requested :: ", req.method, req.url);
            return next();
        }

        if(forbidenMethods.split(',').indexOf(req.method) > -1){
          res.status(403);
          res.json({});
        }
        else if (req.method == 'OPTIONS') {
          res.setHeader('Allow', 'GET,POST,HEAD,OPTIONS');
          res.status(200);
          res.json({});
        } else {
          sails.log.debug("Requested :: ", req.method, req.url);
          return next();
        }
    }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

//    bodyParser: require('skipper')

  }

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
