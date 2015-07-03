/**
 * Module dependencies.
 */
var mongodb = require('mongodb')
  , MongoClient = require('mongodb').MongoClient;

var Client = require('mariasql');

var c = new Client();
c.connect({
	host: '127.0.0.1',
	user: 'valentina',
	password: 'password',
	db: 'dataportal'
});

c.on('connect', function() {
	console.log('Client connected');
})
.on('error', function(err) {
	console.log('Client error: ' + err);
})
.on('close', function(hadError) {
	console.log('Client closed');
});

MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
	if (error) console.info(error);
	db.createCollection("help_search_text", function(err, collection) {
		var helpSearchText = {subjectName: "canonical", subjectID: 0, text: "<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "commonname", subjectID: 31, text: "<p>Escriba un nombre común y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre común que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "kingdom", subjectID: 100, text: "<p>Escriba un nombre de reino y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un reino que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "phylum", subjectID: 101, text: "<p>Escriba un nombre de filo y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un filo que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "class", subjectID: 102, text: "<p>Escriba un nombre de clase y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una clase que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "order_rank", subjectID: 103, text: "<p>Escriba un nombre de orden y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un orden que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "family", subjectID: 104, text: "<p>Escriba un nombre de familia y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una familia que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "genus", subjectID: 105, text: "<p>Escriba un nombre de género y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un género que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "species", subjectID: 106, text: "<p>Escriba un nombre de especie y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una especie que concuerde con el organismo.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "dataproviders", subjectID: 25, text: "<p>Seleccione un publicador de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los publicadores especificados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "dataresources", subjectID: 24, text: "<p>Seleccione un recurso de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los recursos especificados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "countries", subjectID: 5, text: "<p>Seleccione un país de la lista y dar clic en Agregar filtro para filtrar su búsqueda a uno o más paises.</p><p>Este filtro retornará registros del país identificado, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "departments", subjectID: 38, text: "<p>Seleccione un departamento de la lista y oprima en Agregar filtro para acotar su búsqueda a uno o más departamentos.</p><p>Este filtro retorna los registros que pertenecen al departamento, independientemente de si estos tienen o no coordenadas; tenga en cuenta que al adicionar un filtro de coordenadas (Condición de selección, Latitud o Longitud) limitará los resultados a los registros georeferenciados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "counties", subjectID: 39, text: "<p>Seleccione un municipio de la lista y oprima en Agregar filtro para acotar su búsqueda a uno o más municipios.</p><p>Este filtro retorna los registros que pertenecen al municipio, independientemente de si estos tienen o no coordenadas; tenga en cuenta que al adicionar un filtro de coordenadas (Condición de selección, Latitud o Longitud) limitará los resultados a los registros georeferenciados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "paramo", subjectID: 40, text: "<p>Seleccione un páramo de la lista y dar clic en Agregar filtro para filtrar su búsqueda a uno o más páramos.</p><p>Este filtro retornará registros del páramo identificado, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "seazone", subjectID: 41, text: "<p>Seleccione una área marítima de la lista y dar clic en Agregar filtro para filtrar su búsqueda a una o más áreas marítimas.</p><p>Este filtro retornará registros de la área marítima identificada, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>"};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "coordinatesState", subjectID: 28, text: '<p></p><p>Seleccione "incluye coordenadas" para filtrar aquellos registros que no están georreferenciados; alternativamente, seleccione "no incluye coordenadas" para excluir registros georreferenciados. Para ver todos los registros, no utilize este filtro.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "latitude", subjectID: 1, text: '<p></p><p>Ingrese una latitud en formato decimal (ej. -1.1) y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "longitude", subjectID: 2, text: '<p></p><p>Ingrese una longitud en formato decimal (ej. -73.2) y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "altitude", subjectID: 34, text: '<p>Ingrese una altitud en metros y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros con un valor de altitud que coincida con la selección. Este filtro sólo es compatible con los valores de números enteros.</p><p>Por favor tenga en cuenta que los valores de altitud subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de altitud, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "deep", subjectID: 35, text: '<p>Ingrese una profundidad en metros y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros con un valor de profundidad que coincida con la selección. Este filtro admite valores decimales a 2 decimales.</p><p>Por favor tenga en cuenta que los valores de profundidad subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de profundidad, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "occurrenceDate", subjectID: 4, text: '<p></p><p>Seleccione un rango de fecha y haga clic en Agregar filtro.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "occurrenceYearRange", subjectID: 33, text: '<p></p><p>Seleccione un rango de años y haga clic en Agregar filtro..</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "occurrenceYear", subjectID: 21, text: '<p></p><p>Ingrese un año y haga clic en Agregar filtro. Este filtro retornará registros del año (o años) que concuerdan con la selección.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "occurrenceMonth", subjectID: 22, text: '<p></p><p>Seleccione un mes de la lista y haga clic en Agregar filtro. Este filtro retornará registros del mes especificado, sin importar el año.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "institutionCode", subjectID: 12, text: '<p></p><p>Ingrese un código de institución y "es". Este filtro retornará registros con el código de institución dado.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "collectionCode", subjectID: 13, text: '<p></p><p>Ingrese un código de colección y "es". El filtro retornará registros con el código de colección.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
		helpSearchText = {subjectName: "catalogNumber", subjectID: 14, text: '<p></p><p>Ingrese un número de catálogo y pulse en Agregar filtro. Este filtro retornará registros con el número de catálogo especificado.</p>'};
		collection.insert(helpSearchText, function(err, records) {
			if (err) throw err;
		});
	});
});
