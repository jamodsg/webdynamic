/**
 * MenuController
 *
 * @description :: Server-side logic for managing Menus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	menuWithMenuIdentifier: function(menu_id,success, failure) {
    Menu.find({ where: {id: menu_id}, sort:'order'}).populate('submenu').exec(function(error, result){
      if (!error) {
        success(result);
      } else {
        failure(error);
      }
    });
  }

  ,menuWithLocationIdentifier: function(location_id,success, failure) {

    var lang = sails.config.asiacell.lang;
    Menu
      .find()
      .where({location:location_id, sort:'order ASC'})
      .populate('translatedBy', {lang: lang})
      .exec(function(err, menus){
        if (err) {
          sails.log.info('Error->'+err);
          sails.log.info('Connection Name ->' + sails.config.models.connection);
        }

        var menuItems = [];
        async.forEach(menus, function(item, next){
          Menu
            .find({parent:item.id, sort:'order ASC'})
            .populate('translatedBy', {lang: lang})
            .sort('order ASC')
            .exec(function(err, result){
              var submenu = [];
              _.forEach(result,function(eachItem){
                submenu.push(
                  {
                    content:eachItem.translatedBy[0].content,
                    link:eachItem.link + '?lang=' + lang,
                    name:eachItem.name,
                    order:eachItem.order
                  }
                );
              });
              menuItems.push(
                {
                  content:item.translatedBy[0].content,
                  submenu:submenu,
                  link:item.link + '?lang=' + lang,
                  name:item.name,
                  order:item.order
                });
              next();
            });
        }, function(err){

          menuItems = _.sortBy(menuItems, function (item) {return item.order})
          success(menuItems);
        });
      });
  }

  ,addMenu: function(newMenu, success, failure) {
    Menu.create(newMenu).exec(function(err, created){
      if (!err) {
        success({message:'One row created!'});
      } else {
        failure(err);
      }
    });
  }
};

