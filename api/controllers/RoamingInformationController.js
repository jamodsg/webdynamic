/**
 * RoamingInformationController
 *
 * @description :: Server-side logic for managing Roaminginformations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	roamingInfor: function (req, res) {
    var lang = sails.config.asiacell.lang;

		console.log('Got request');

		res.status(200);

		RoamingInformation
      .find({})
			.exec(function(error, collection){
				if (!error) {
					// to conform with the sameple of two field search example, the data will decorate as array
					// 'Id','countyName', 'Display','countyCode','Price','Content'
					var decoratedData = [];
					for(var i=0;i<collection.length;i++) {
						var item = collection[i];
						var contentByLang = '';

						contentByLang = item['content' + lang.charAt(0).toUpperCase() + lang.slice(1)];
						decoratedData.push([item.id, item.countyName + ' (' + item.countryCode + ')', item.countyName, item.countryCode, contentByLang]);
					}

					res.status(200);
		      res.json({success:false, data:decoratedData});
				}
			});

		// res.json({success:true, data: [
    //         ['1','Neighboring & most Arab countries 964','Neighboring & most Arab countries','964','5000','<div>This div</div>'],
    //         ['2','USA & Europe 66','USA & Europe','66','6000','<span>This span</span>'],
    //         ['3','Other countries 12','Other countries','12','7000','<strong>This is strong</strong>']
    //     ]});
  }
};
