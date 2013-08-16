var express = require('express')
  , fs = require('fs');

module.exports = function(parent, options) {
	var verbose = options.verbose;
	fs.readdirSync(__dirname + '/../app/controllers').forEach(function(name) {
		verbose && logger.info('\n %s:', name);
		var obj = require('./../app/controllers/' + name)
		  , name = obj.name || name
		  , prefix = obj.prefix || ''
		  , app = express()
		  , method
		  , path;

		// allow specifying the view engine
		if (obj.engine) app.set('view engine', obj.engine);
		app.set('views', __dirname + '/../app/views/' + name);

		// before middleware support
		if (obj.before) {
			path = '/' + name + '/:' + name + '_id';
			app.all(path, obj.before);
			verbose && console.log(' ALL %s -> before', path);
			path = '/' + name + '/:' + name + '_id/*';
			app.all(path, obj.before);
			verbose && console.log(' ALL %s -> before', path);
		}

		// generate routes based
		// on the exported methods
		for (var key in obj) {
			// "reserved" exports
			if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
			// route exports
			switch (key) {
				case 'index':
					method = 'get';
					path = '/';
					break;
				// Cases for distribution cells
				case 'listInitialDistributionOneDegree':
					method = 'get';
					path = '/' + name + '/onedegree/list';
					break;
				case 'listInitialDistributionCentiDegree':
					method = 'get';
					path = '/' + name + '/centidegree/list';
					break;
				case 'getDistributionStatsOneDegree':
					method = 'get';
					path = '/' + name + '/onedegree/stats/:' + '_cellid';
					break;
				/*case 'show':
					method = 'get';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:' + name + '_id/edit';
					break;
				case 'update':
					method = 'put';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;*/
				case 'searchInitialOccurrences':
					method = 'get';
					path = '/' + name + '/list';
					break;
				/*case 'searchAllOccurrences':
					method = 'get';
					path = '/' + name + '/list';
					break;*/
				case 'searchInitialPagedDataOccurrences':
					method = 'get';
					path = '/' + name + '/PagedData';
					break;
				case 'searchGeoOccurrences':
					method = 'post';
					path = '/' + name + '/search';
					break;
				case 'searchDetailsGeoOccurrences':
					method = 'get';
					path = '/' + name + '/details/search';
					break;
				case 'searchResumeScientificNameByName':
					method = 'get';
					path = '/' + name + '/resume/scientificname/name/:' + '_name';
					break;
				case 'searchResumeScientificName':
					method = 'get';
					path = '/' + name + '/resume/scientificname/name';
					break;
				case 'searchResumeKingdomNameByName':
					method = 'get';
					path = '/' + name + '/resume/kingdom/name/:' + '_name';
					break;
				case 'searchResumeKingdomName':
					method = 'get';
					path = '/' + name + '/resume/kingdom/name';
					break;
				case 'searchResumePhylumNameByName':
					method = 'get';
					path = '/' + name + '/resume/phylum/name/:' + '_name';
					break;
				case 'searchResumePhylumName':
					method = 'get';
					path = '/' + name + '/resume/phylum/name';
					break;
				case 'searchResumeClassNameByName':
					method = 'get';
					path = '/' + name + '/resume/class/name/:' + '_name';
					break;
				case 'searchResumeClassName':
					method = 'get';
					path = '/' + name + '/resume/class/name';
					break;
				case 'searchResumeOrderNameByName':
					method = 'get';
					path = '/' + name + '/resume/order/name/:' + '_name';
					break;
				case 'searchResumeOrderName':
					method = 'get';
					path = '/' + name + '/resume/order/name';
					break;
				case 'searchResumeFamilyNameByName':
					method = 'get';
					path = '/' + name + '/resume/family/name/:' + '_name';
					break;
				case 'searchResumeFamilyName':
					method = 'get';
					path = '/' + name + '/resume/family/name';
					break;
				case 'searchResumeGenusNameByName':
					method = 'get';
					path = '/' + name + '/resume/genus/name/:' + '_name';
					break;
				case 'searchResumeGenusName':
					method = 'get';
					path = '/' + name + '/resume/genus/name';
					break;
				case 'searchResumeSpeciesNameByName':
					method = 'get';
					path = '/' + name + '/resume/species/name/:' + '_name';
					break;
				case 'searchResumeSpeciesName':
					method = 'get';
					path = '/' + name + '/resume/species/name';
					break;
				case 'searchResumeDataProvidersByName':
					method = 'get';
					path = '/' + name + '/resume/dataproviders/name/:' + '_name';
					break;
				case 'searchResumeDataProviders':
					method = 'get';
					path = '/' + name + '/resume/dataproviders/name';
					break;
				case 'searchResumeDataResourcesByName':
					method = 'get';
					path = '/' + name + '/resume/dataresources/name/:' + '_name';
					break;
				case 'searchResumeDataResources':
					method = 'get';
					path = '/' + name + '/resume/dataresources/name';
					break;
				case 'searchResumeInstitutionCodesByName':
					method = 'get';
					path = '/' + name + '/resume/institutioncodes/name/:' + '_name';
					break;
				case 'searchResumeInstitutionCodes':
					method = 'get';
					path = '/' + name + '/resume/institutioncodes/name';
					break;
				case 'searchResumeCollectionCodesByName':
					method = 'get';
					path = '/' + name + '/resume/collectioncodes/name/:' + '_name';
					break;
				case 'searchResumeCollectionCodes':
					method = 'get';
					path = '/' + name + '/resume/collectioncodes/name';
					break;
				case 'searchResumeCountriesByName':
					method = 'get';
					path = '/' + name + '/resume/countries/name/:' + '_name';
					break;
				case 'searchResumeCountries':
					method = 'get';
					path = '/' + name + '/resume/countries/name';
					break;
				case 'searchResumeDepartmentsByName':
					method = 'get';
					path = '/' + name + '/resume/departments/name/:' + '_name';
					break;
				case 'searchResumeDepartments':
					method = 'get';
					path = '/' + name + '/resume/departments/name';
					break;
				case 'searchSearchHelpTextByName':
					method = 'get';
					path = '/' + name + '/searchhelptext/name/:' + '_name';
					break;
				case 'updatemongodb':
					method = 'get';
					path = '/updatemongodb';
					break;
				case 'convertFromMysqlToMongoDB':
					method = 'get';
					path = '/convertdatabase';
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}
			path = prefix + path;
			app[method](path, obj[key]);
			verbose && console.log(' %s %s -> %s', method.toUpperCase(), path, key);
		}
		// mount the app
		parent.use(app);
	});
};