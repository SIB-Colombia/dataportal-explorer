
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
};