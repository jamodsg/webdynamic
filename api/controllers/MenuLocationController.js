/**
 * MenuLocationController
 *
 * @description :: Server-side logic for managing Menulocations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  addMenuLocation: function(param, success, failure) {
    console.log('Ok');
    MenuLocation.create(param).exec(function(err, created){
      if (!err) {
        success({message:'One row created!'});
      } else {
        failure(err);
      }
    });
  }

  // fetch menu item for menu location identifer
  ,menuItemForLocationIdentifier: function (location_id, success, failure) {
    MenuLocation.find().populate('menus',{location:location_id}).exec(function(error, result){
      if (!error) {
        success(result[0]);
      } else {
        failure(error);
      }
    });
  }
};

