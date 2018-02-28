/**
 * Cross-Origin Resource Sharing (CORS) Settings
 * (sails.config.cors)
 *
 * CORS is like a more modern version of JSONP-- it allows your server/API
 * to successfully respond to requests from client-side JavaScript code
 * running on some other domain (e.g. google.com)
 * Unlike JSONP, it works with POST, PUT, and DELETE requests
 *
 * For more information on CORS, check out:
 * http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
 *
 * Note that any of these settings (besides 'allRoutes') can be changed on a per-route basis
 * by adding a "cors" object to the route configuration:
 *
 * '/get foo': {
 *   controller: 'foo',
 *   action: 'bar',
 *   cors: {
 *     origin: 'http://foobar.com,https://owlhoot.com'
 *   }
 *  }
 *
 *  For more information on this configuration file, see:
 *  http://sailsjs.org/#/documentation/reference/sails.config/sails.config.cors.html
 *
 */

module.exports.cors = {

  /***************************************************************************
  *                                                                          *
  * Allow CORS on all routes by default? If not, you must enable CORS on a   *
  * per-route basis by either adding a "cors" configuration object to the    *
  * route config, or setting "cors:true" in the route config to use the      *
  * default settings below.                                                  *
  *                                                                          *
  ***************************************************************************/

  allRoutes: true,

  /***************************************************************************
  *                                                                          *
  * Which domains which are allowed CORS access? This can be a               *
  * comma-delimited list of hosts (beginning with http:// or https://) or    *
  * "*" to allow all domains CORS access.                                    *
  *                                                                          *
  ***************************************************************************/

  //origin: "http://asiacell.com,https://http://asiacell.com",
  origin: "*",
  securityLevel: 1,

  /***************************************************************************
  *                                                                          *
  * Allow cookies to be shared for CORS requests?                            *
  *                                                                          *
  ***************************************************************************/

  // credentials: true,

  /***************************************************************************
  *                                                                          *
  * Which methods should be allowed for CORS requests? This is only used in  *
  * response to preflight requests (see article linked above for more info)  *
  *                                                                          *
  ***************************************************************************/

  methods: 'GET, POST, HEAD', //PUT, DELETE, OPTIONS,

  /***************************************************************************
  *                                                                          *
  * Which headers should be allowed for CORS requests? This is only used in  *
  * response to preflight requests.                                          *
  * Customize:
   * userAgentType is custom header key to provide backend know the type of  *
   * current user agent, Some API need to prepare data for each user agent   *
  ***************************************************************************/

  headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, userAgentScreenType'

};
