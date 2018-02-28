/**
 * CaptchaController
 *
 * @description :: Server-side logic for managing Captchars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var redis = require("redis");
var client = redis.createClient();

client.auth('R3d!sAppF0rODP', function (error) {
  console.log('tried access to redis ' + error);

  client.select(7, function () {
    console.log('selected 7 ');
  });
});

module.exports = {
  canvasImg: function(req, res) {

    var dw = 100, dh = 30;
    var localConfig = {
      numberOfDigit: 4
    };

    // generate captcha string
    var captchaStr = Math.floor(1000 + Math.random() * 9000);

    // generate unique key
    const uuidv5 = require('uuid/v5');

    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    var ukey = uuidv5('' + captchaStr, MY_NAMESPACE);


    if (req.param('width')) {
      dw = req.param('width') * 1;
    }

    if (req.param('height')) {
      dh = req.param('height') * 1;
    }

    var Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(dw * 1, dh * 1),
      ctx = canvas.getContext('2d');

    var color1 = "#f7f7f7",color2="#a1a1a1";
    var numberOfStripes = dw / 5;
    for (var i=0;i<numberOfStripes*2;i++){
      var thickness = dw / numberOfStripes;
      ctx.beginPath();
      ctx.strokeStyle = i % 2?color1:color2;
      ctx.lineWidth =thickness;
      ctx.lineCap = 'round';

      ctx.moveTo(i*thickness + thickness/2 - dw,0);
      ctx.lineTo(0 + i*thickness+thickness/2,dw);
      ctx.stroke();
    }

    ctx.font = '30px Impact';
    ctx.fillStyle = "#c21421";
    ctx.fillText(captchaStr, dw / 3.5, (dh - 5));
    // res.setHeader('Content-Type', 'image/png');
    // canvas.pngStream().pipe(res);
    canvas.toDataURL(function(err, png){
      client.set(ukey,captchaStr, 'EX', 3*60);
      if (client.get(ukey) == captchaStr) {
        sails.log.info("Successfully store captcha to redis");
      }

      res.json(200,{
        captcharSrc: png,
        captCharKey: ukey
      });
    });
  }
};

