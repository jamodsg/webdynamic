/**
 * EmailListController
 *
 * @description :: Server-side logic for managing Emaillists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var redis = require("redis");
var Q = require("q");
var client = redis.createClient();

client.auth('R3d!sAppF0rODP', function (error) {
  console.log('tried access to redis ' + error);

  client.select(7, function () {
    console.log('selected 7 ');
  });
});


module.exports = {
  createEmailList: function(req, res) {
    console.log('name is ' + req.body['name']);
    console.log('email is ' + req.body['email']);

    // validation
    var captchaStr = req.body['captchaStr'],
      captchaKey = req.body['captchaKey'],
      noCaptcaMessage = 'Captcha is not valid';

    // if this not set from the client
    if (typeof captchaStr == 'undefined' || typeof captchaKey == 'undefined') {
      res.status(200);
      res.json({success:false, message:noCaptcaMessage});
      return;
    }

    // validate by lookup the redis
    var getCaptchaStrDefer = Q.defer();
    client.get(captchaKey, function (err, reply) {
      var storedCaptchaStr = reply.toString();
      if (storedCaptchaStr != captchaStr) {
        getCaptchaStrDefer.reject();
      } else {
        getCaptchaStrDefer.resolve(storedCaptchaStr);
      }
    });

    getCaptchaStrDefer.promise.then(function (storedCaptchaStr) {

      var getByEmail = Q.defer();
      EmailList.find({email: req.body['email']}).exec(function (err, records) {
        if (records && records.length > 0) {
          getByEmail.reject();
        } else {
          getByEmail.resolve();
        }
      });

      getByEmail.promise.then(function () {
        // resolve
        EmailList.create(req.body).exec(function (err, records) {
          if (!err) {
            res.status(200);
            res.json({success:true, message:'Successful create Email List!'});
          } else {
            res.status(200);
            res.json({success:false, message:'Error when create Email List'});
          }
        });
      }, function () {
        // reject
        res.status(200);
        res.json({success:false, message:'Email is already existed'});
      });

    }, function () {
      res.status(200);
      res.json({success:false, message:noCaptcaMessage});
    });

  }
};

