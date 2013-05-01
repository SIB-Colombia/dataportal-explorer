/*
 Copyright (c) 2013, SIB Colombia, Valentina Grajales
 Nodejs.servermarkercluster is an open-source JavaScript library for Server Marker Clustering on nodejs powered server.
 https://github.com/sib PENDIENTE
*/

/* General class encapsulation */
var ServerCluster;
ServerCluster = {};
ServerCluster.version = '0.1-dev';

/*
 * ServerCluster.Util contains various utility functions used throughout Leaflet code.
 */

ServerCluster.Util = {
	extend: function (dest) { // (Object[, Object, ...]) ->
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j] || {};
			for (i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},

	setOptions: function (obj, options) {
		obj.options = ServerCluster.extend({}, obj.options, options);
		return obj.options;
	},

	splitWords: function (str) {
		return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	},

	setOptions: function (obj, options) {
		obj.options = ServerCluster.extend({}, obj.options, options);
		return obj.options;
	},

	stamp: (function () {
		var lastId = 0, key = '_leaflet_id';
		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),
};

// shortcuts for most used utility functions
ServerCluster.extend = ServerCluster.Util.extend;
ServerCluster.stamp = ServerCluster.Util.stamp;
ServerCluster.setOptions = ServerCluster.Util.setOptions;

/*
 * ServerCluster.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

ServerCluster.Class = function () {};

ServerCluster.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks) {
			this.callInitHooks();
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		ServerCluster.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		ServerCluster.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = ServerCluster.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	ServerCluster.extend(proto, props);

	proto._initHooks = [];

	var parent = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parent.prototype.callInitHooks) {
			parent.prototype.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// method for adding properties to prototype
ServerCluster.Class.include = function (props) {
	ServerCluster.extend(this.prototype, props);
};

// merge new default options to the Class
ServerCluster.Class.mergeOptions = function (options) {
	ServerCluster.extend(this.prototype.options, options);
};

// add a constructor hook
ServerCluster.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};

/*
 * ServerCluster.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var key = '_leaflet_events';

ServerCluster.Mixin = {};

ServerCluster.Mixin.Events = {

	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

		var events = this[key] = this[key] || {},
		    contextId = context && ServerCluster.stamp(context),
		    type, i, len, evt,
		    objKey, objLenKey, eventsObj;

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], fn);
				}
			}

			return this;
		}

		// types can be a string of space-separated words
		types = ServerCluster.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			evt = {
				action: fn,
				context: context || this
			};

			if (contextId) {
				// store listeners of a particular context in a separate hash (if it has an id)
				// gives a major performance boost when removing thousands of map layers

				objKey = types[i] + '_idx',
				objLenKey = objKey + '_len',
				eventsObj = events[objKey] = events[objKey] || {};

				if (eventsObj[contextId]) {
					eventsObj[contextId].push(evt);
				} else {
					eventsObj[contextId] = [evt];
					events[objLenKey] = (events[objLenKey] || 0) + 1;
				}

			} else {
				events[types[i]] = events[types[i]] || [];
				events[types[i]].push(evt);
			}
		}

		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		return (key in this) &&
		       (((type in this[key]) && this[key][type].length > 0) ||
		        (this[key][type + '_idx_len'] > 0));
	},

	removeEventListener: function (types, fn, context) { // (String[, Function, Object]) or (Object[, Object])
		var events = this[key],
		    contextId = context && ServerCluster.stamp(context),
		    type, i, len, listeners, j,
		    objKey, objLenKey;

		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.removeEventListener(type, types[type], fn);
				}
			}
			return this;
		}

		types = ServerCluster.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			if (this.hasEventListeners(types[i])) {

				objKey = types[i] + '_idx';

				if (contextId && events[objKey]) {
					listeners =  events[objKey][contextId] || [];
				} else {
					listeners = events[types[i]] || [];
				}

				for (j = listeners.length - 1; j >= 0; j--) {
					if ((!fn || listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
						listeners.splice(j, 1);
					}
				}

				if (contextId && listeners.length === 0 && events[objKey] && events[objKey][contextId]) {
					objLenKey = objKey + '_len';
					delete events[objKey][contextId];
					events[objLenKey] = (events[objLenKey] || 1) - 1;
				}
			}
		}

		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = ServerCluster.Util.extend({}, data, {
			type: type,
			target: this
		});

		var listeners, i, len, eventsObj, contextId;

		if (this[key][type]) {
			listeners = this[key][type].slice();

			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].action.call(listeners[i].context || this, event);
			}
		}

		// fire event for the context-indexed listeners as well

		eventsObj = this[key][type + '_idx'];

		if (eventsObj) {
			for (contextId in eventsObj) {
				if (eventsObj.hasOwnProperty(contextId)) {
					listeners = eventsObj[contextId];
					if (listeners) {
						for (i = 0, len = listeners.length; i < len; i++) {
							listeners[i].action.call(listeners[i].context || this, event);
						}
					}
				}
			}
		}

		return this;
	}
};

ServerCluster.Mixin.Events.on = ServerCluster.Mixin.Events.addEventListener;
ServerCluster.Mixin.Events.off = ServerCluster.Mixin.Events.removeEventListener;
ServerCluster.Mixin.Events.fire = ServerCluster.Mixin.Events.fireEvent;

/*
 * ServerCluster.Point represents a point with x and y coordinates.
 */

ServerCluster.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

ServerCluster.Point.prototype = {

	clone: function () {
		return new ServerCluster.Point(this.x, this.y);
	},

	// non-destructive, returns a new point
	add: function (point) {
		return this.clone()._add(ServerCluster.point(point));
	},

	// destructive, used directly for performance in situations where it's safe to modify existing point
	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(ServerCluster.point(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	distanceTo: function (point) {
		point = ServerCluster.point(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	equals: function (point) {
		return point.x === this.x &&
		       point.y === this.y;
	},

	contains: function (point) {
		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	toString: function () {
		return 'Point(' +
		        ServerCluster.Util.formatNum(this.x) + ', ' +
		        ServerCluster.Util.formatNum(this.y) + ')';
	}
};

ServerCluster.point = function (x, y, round) {
	if (x instanceof ServerCluster.Point) {
		return x;
	}
	if (ServerCluster.Util.isArray(x)) {
		return new ServerCluster.Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	return new ServerCluster.Point(x, y, round);
};

/*
 * ServerCluster.Icon is an image-based icon class that you can use with ServerCluster.Marker for custom markers.
 */

ServerCluster.Icon = ServerCluster.Class.extend({
	options: {
		/*
		iconUrl: (String) (required)
		iconRetinaUrl: (String) (optional, used for retina devices if detected)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (Point) (no shadow by default)
		shadowRetinaUrl: (String) (optional, used for retina devices if detected)
		shadowSize: (Point)
		shadowAnchor: (Point)
		*/
		className: ''
	},

	initialize: function (options) {
		ServerCluster.setOptions(this, options);
	},

	createIcon: function () {
		return this._createIcon('icon');
	},

	createShadow: function () {
		return this._createIcon('shadow');
	},

	_createIcon: function (name) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		var img = this._createImg(src);
		this._setIconStyles(img, name);

		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options,
		    size = ServerCluster.point(options[name + 'Size']),
		    anchor;

		if (name === 'shadow') {
			anchor = ServerCluster.point(options.shadowAnchor || options.iconAnchor);
		} else {
			anchor = ServerCluster.point(options.iconAnchor);
		}

		if (!anchor && size) {
			anchor = size.divideBy(2, true);
		}

		img.className = 'leaflet-marker-' + name + ' ' + options.className;

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop  = (-anchor.y) + 'px';
		}

		if (size) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src) {
		var el;

		if (!ServerCluster.Browser.ie6) {
			el = document.createElement('img');
			el.src = src;
		} else {
			el = document.createElement('div');
			el.style.filter =
			        'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	},

	_getIconUrl: function (name) {
		if (ServerCluster.Browser.retina && this.options[name + 'RetinaUrl']) {
			return this.options[name + 'RetinaUrl'];
		}
		return this.options[name + 'Url'];
	}
});

ServerCluster.icon = function (options) {
	return new ServerCluster.Icon(options);
};


/*
 * ServerCluster.Icon.Default is the blue marker icon used by default in Leaflet.
 */

ServerCluster.Icon.Default = ServerCluster.Icon.extend({

	options: {
		iconSize: new ServerCluster.Point(25, 41),
		iconAnchor: new ServerCluster.Point(12, 41),
		popupAnchor: new ServerCluster.Point(1, -34),

		shadowSize: new ServerCluster.Point(41, 41)
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		if (ServerCluster.Browser.retina && name === 'icon') {
			name += '@2x';
		}

		var path = ServerCluster.Icon.Default.imagePath;

		if (!path) {
			throw new Error('Couldn\'t autodetect ServerCluster.Icon.Default.imagePath, set it manually.');
		}

		return path + '/marker-' + name + '.png';
	}
});

ServerCluster.Icon.Default.imagePath = (function () {
	return '/javascripts/leaflet/images';
}());

/*
 * ServerCluster.LatLng represents a geographical point with latitude and longitude coordinates.
 */

ServerCluster.LatLng = function (rawLat, rawLng) { // (Number, Number)
	var lat = parseFloat(rawLat),
	    lng = parseFloat(rawLng);

	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + rawLat + ', ' + rawLng + ')');
	}

	this.lat = lat;
	this.lng = lng;
};

ServerCluster.extend(ServerCluster.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

ServerCluster.LatLng.prototype = {
	equals: function (obj) { // (LatLng) -> Boolean
		if (!obj) { return false; }

		obj = ServerCluster.latLng(obj);

		var margin = Math.max(
			Math.abs(this.lat - obj.lat),
			Math.abs(this.lng - obj.lng));

		return margin <= ServerCluster.LatLng.MAX_MARGIN;
	},

	toString: function (precision) { // (Number) -> String
		return 'LatLng(' + ServerCluster.Util.formatNum(this.lat, precision) + ', ' + ServerCluster.Util.formatNum(this.lng, precision) + ')';
	},

	// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
	// TODO move to projection code, LatLng shouldn't know about Earth
	distanceTo: function (other) { // (LatLng) -> Number
		other = ServerCluster.latLng(other);

		var R = 6378137, // earth radius in meters
		    d2r = ServerCluster.LatLng.DEG_TO_RAD,
		    dLat = (other.lat - this.lat) * d2r,
		    dLon = (other.lng - this.lng) * d2r,
		    lat1 = this.lat * d2r,
		    lat2 = other.lat * d2r,
		    sin1 = Math.sin(dLat / 2),
		    sin2 = Math.sin(dLon / 2);

		var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	},

	wrap: function (a, b) { // (Number, Number) -> LatLng
		var lng = this.lng;

		a = a || -180;
		b = b ||  180;

		lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

		return new ServerCluster.LatLng(this.lat, lng);
	}
};

ServerCluster.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
	if (a instanceof ServerCluster.LatLng) {
		return a;
	}
	if (ServerCluster.Util.isArray(a)) {
		return new ServerCluster.LatLng(a[0], a[1]);
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new ServerCluster.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
	}
	return new ServerCluster.LatLng(a, b);
};

/*
 * ServerCluster.LayerGroup is a class to combine several layers into one so that
 * you can manipulate the group (e.g. add/remove it) as one layer.
 */

ServerCluster.LayerGroup = ServerCluster.Class.extend({
	initialize: function (layers) {
		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	getLayerId: function (layer) {
		return ServerCluster.stamp(layer);
	},
});

ServerCluster.layerGroup = function (layers) {
	return new ServerCluster.LayerGroup(layers);
};

/*
 * ServerCluster.FeatureGroup extends ServerCluster.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

ServerCluster.FeatureGroup = ServerCluster.LayerGroup.extend({
});

ServerCluster.featureGroup = function (layers) {
	return new ServerCluster.FeatureGroup(layers);
};

/*
 * ServerCluster.Marker is used to display clickable/draggable icons on the map.
 */
ServerCluster.Marker = ServerCluster.Class.extend({

	includes: ServerCluster.Mixin.Events,

	options: {
		icon: new ServerCluster.Icon.Default(),
		title: '',
		clickable: true,
		draggable: false,
		zIndexOffset: 0,
		opacity: 1,
		riseOnHover: false,
		riseOffset: 250
	},

	initialize: function (latlng, options) {
		ServerCluster.setOptions(this, options);
		this._latlng = ServerCluster.latLng(latlng);
	},

	getLatLng: function () {
		return this._latlng;
	},

});

//TODO International date line?

ServerCluster.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
	if (!a || a instanceof ServerCluster.LatLngBounds) {
		return a;
	}
	return new ServerCluster.LatLngBounds(a, b);
};

/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

ServerCluster.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
	if (!southWest) { return; }

	var latlngs = northEast ? [southWest, northEast] : southWest;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
};

ServerCluster.LatLngBounds.prototype = {
	// extend the bounds to contain the given point or bounds
	extend: function (obj) { // (LatLng) or (LatLngBounds)
		if (typeof obj[0] === 'number' || typeof obj[0] === 'string' || obj instanceof ServerCluster.LatLng) {
			obj = ServerCluster.latLng(obj);
		} else {
			obj = ServerCluster.latLngBounds(obj);
		}

		if (obj instanceof ServerCluster.LatLng) {
			if (!this._southWest && !this._northEast) {
				this._southWest = new ServerCluster.LatLng(obj.lat, obj.lng);
				this._northEast = new ServerCluster.LatLng(obj.lat, obj.lng);
			} else {
				this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
				this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

				this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
				this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
			}
		} else if (obj instanceof ServerCluster.LatLngBounds) {
			this.extend(obj._southWest);
			this.extend(obj._northEast);
		}
		return this;
	},
};

ServerCluster.MarkerCluster = ServerCluster.Marker.extend({
	initialize: function (group, zoom, a, b) {

		ServerCluster.Marker.prototype.initialize.call(this, a ? (a._cLatLng || a.getLatLng()) : new ServerCluster.LatLng(0, 0), { icon: this });


		this._group = group;
		this._zoom = zoom;

		this._markers = [];
		this._childClusters = [];
		this._childCount = 0;
		this._iconNeedsUpdate = true;

		this._bounds = new ServerCluster.LatLngBounds();

		if (a) {
			this._addChild(a);
		}
		if (b) {
			this._addChild(b);
		}
	},

	_addChild: function (new1, isNotificationFromChild) {

		this._iconNeedsUpdate = true;
		this._expandBounds(new1);

		console.log("Es instancia");
		console.log(new1 instanceof ServerCluster.MarkerCluster);
		if (new1 instanceof ServerCluster.MarkerCluster) {
			if (!isNotificationFromChild) {
				this._childClusters.push(new1);
				new1.__parent = this;
			}
			this._childCount += new1._childCount;
		} else {
			if (!isNotificationFromChild) {
				this._markers.push(new1);
			}
			this._childCount++;
		}

		if (this.__parent) {
			this.__parent._addChild(new1, true);
		}
	},

	_updateIcon: function () {
		this._iconNeedsUpdate = true;
		if (this._icon) {
			this.setIcon(this);
		}
	},

	_recalculateBounds: function () {
		var markers = this._markers,
			childClusters = this._childClusters,
			i;

		this._bounds = new ServerCluster.LatLngBounds();
		delete this._wLatLng;

		for (i = markers.length - 1; i >= 0; i--) {
			this._expandBounds(markers[i]);
		}
		for (i = childClusters.length - 1; i >= 0; i--) {
			this._expandBounds(childClusters[i]);
		}
	},

	//Expand our bounds and tell our parent to
	_expandBounds: function (marker) {
		var addedCount,
		    addedLatLng = marker._wLatLng || marker._latlng;

		if (marker instanceof ServerCluster.MarkerCluster) {
			this._bounds.extend(marker._bounds);
			addedCount = marker._childCount;
		} else {
			this._bounds.extend(addedLatLng);
			addedCount = 1;
		}

		if (!this._cLatLng) {
			// when clustering, take position of the first point as the cluster center
			this._cLatLng = marker._cLatLng || addedLatLng;
		}

		// when showing clusters, take weighted average of all points as cluster center
		var totalCount = this._childCount + addedCount;

		//Calculate weighted latlng for display
		if (!this._wLatLng) {
			this._latlng = this._wLatLng = new ServerCluster.LatLng(addedLatLng.lat, addedLatLng.lng);
		} else {
			this._wLatLng.lat = (addedLatLng.lat * addedCount + this._wLatLng.lat * this._childCount) / totalCount;
			this._wLatLng.lng = (addedLatLng.lng * addedCount + this._wLatLng.lng * this._childCount) / totalCount;
		}
	},
});


ServerCluster.MarkerClusterGroup = ServerCluster.FeatureGroup.extend({
	options: {
		maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
		iconCreateFunction: null,

		spiderfyOnMaxZoom: true,
		showCoverageOnHover: true,
		zoomToBoundsOnClick: true,
		singleMarkerMode: false,

		disableClusteringAtZoom: null,

		// Setting this to false prevents the removal of any clusters outside of the viewpoint, which
      // is the default behaviour for performance reasons.
      removeOutsideVisibleBounds: true,

		//Whether to animate adding markers after adding the MarkerClusterGroup to the map
		// If you are adding individual markers set to true, if adding bulk markers leave false for massive performance gains.
		animateAddingMarkers: false,

		//Increase to increase the distance away that spiderfied markers appear from the center
		spiderfyDistanceMultiplier: 1,

		//Options to pass to the ServerCluster.Polygon constructor
		polygonOptions: {}
	},

	initialize: function (options) {
		ServerCluster.Util.setOptions(this, options);
		if (!this.options.iconCreateFunction) {
			this.options.iconCreateFunction = this._defaultIconCreateFunction;
		}

		ServerCluster.FeatureGroup.prototype.initialize.call(this, []);

		this._inZoomAnimation = 0;
		this._maxZoom = 18;
		this._needsClustering = [];
		//The bounds of the currently shown area (from _getExpandedVisibleBounds) Updated on zoom/move
		this._currentShownBounds = null;
	},

	addLayer: function (layer) {
		if (!this._map) {
			this._needsClustering.push(layer);
			return this;
		}
	},

	createCluster: function() {
		this._generateInitialCluster();

		//Cluster current markers
		for (var i = 0, l = this._needsClustering.length; i < l; i++) {
			var layer = this._needsClustering[i];
			if (layer.__parent) {
				continue;
			}
			this._addLayer(layer, this._maxZoom);
		}
		this._needsClustering = []; //Clear hash table

		//console.log(this);
		console.log(this._topClusterLevel);

		return null;
	},

	_generateInitialCluster: function() {
		var maxZoom = this._maxZoom; //Change with maxZoom of map library leaflet
		var radius = this.options.maxClusterRadius;

		// Disable cluster function at this zoom level
		if (this.options.disableClusteringAtZoom) {
			maxZoom = this.options.disableClusteringAtZoom - 1;
		}

		this._gridClusters = {}; // Grids with clustered markers
		this._gridUnclustered = {}; // Grids without clustered markers

		//Set up DistanceGrids for each zoom
		for (var zoom = maxZoom; zoom >= 0; zoom--) {
			this._gridClusters[zoom] = new ServerCluster.DistanceGrid(radius);
			this._gridUnclustered[zoom] = new ServerCluster.DistanceGrid(radius);
			//console.log(this._gridClusters[zoom]);
			//console.log(this._gridUnclustered[zoom]);
		}
		//console.log(this);
		this._topClusterLevel = new ServerCluster.MarkerCluster(this, -1);
		//console.log(this._topClusterLevel);
	},

	//Remove the given object from the given array
	_arraySplice: function (anArray, obj) {
		for (var i = anArray.length - 1; i >= 0; i--) {
			if (anArray[i] === obj) {
				anArray.splice(i, 1);
				return;
			}
		}
	},

	//Internal function for removing a marker from everything.
	//dontUpdateMap: set to true if you will handle updating the map manually (for bulk functions)
	_removeLayer: function (marker, removeFromDistanceGrid, dontUpdateMap) {
		var gridClusters = this._gridClusters,
			gridUnclustered = this._gridUnclustered;

		//Remove the marker from distance clusters it might be in
		if (removeFromDistanceGrid) {
			for (var z = this._maxZoom; z >= 0; z--) {
				if (!gridUnclustered[z].removeObject(marker, map.project(marker.getLatLng(), z))) {
					break;
				}
			}
		}

		//Work our way up the clusters removing them as we go if required
		var cluster = marker.__parent,
			markers = cluster._markers,
			otherMarker;

		//Remove the marker from the immediate parents marker list
		this._arraySplice(markers, marker);

		while (cluster) {
			cluster._childCount--;

			if (cluster._zoom < 0) {
				//Top level, do nothing
				break;
			} else if (removeFromDistanceGrid && cluster._childCount <= 1) { //Cluster no longer required
				//We need to push the other marker up to the parent
				otherMarker = cluster._markers[0] === marker ? cluster._markers[1] : cluster._markers[0];

				//Update distance grid
				gridClusters[cluster._zoom].removeObject(cluster, map.project(cluster._cLatLng, cluster._zoom));
				gridUnclustered[cluster._zoom].addObject(otherMarker, map.project(otherMarker.getLatLng(), cluster._zoom));

				//Move otherMarker up to parent
				this._arraySplice(cluster.__parent._childClusters, cluster);
				cluster.__parent._markers.push(otherMarker);
				otherMarker.__parent = cluster.__parent;

				if (cluster._icon) {
					//Cluster is currently on the map, need to put the marker on the map instead
					ServerCluster.FeatureGroup.prototype.removeLayer.call(this, cluster);
					if (!dontUpdateMap) {
						ServerCluster.FeatureGroup.prototype.addLayer.call(this, otherMarker);
					}
				}
			} else {
				cluster._recalculateBounds();
				if (!dontUpdateMap || !cluster._icon) {
					cluster._updateIcon();
				}
			}

			cluster = cluster.__parent;
		}

		delete marker.__parent;
	},

	_addLayer: function (layer, zoom) {
		var gridClusters = this._gridClusters,
		    gridUnclustered = this._gridUnclustered,
		    markerPoint;

		//zoom=6;
		//Find the lowest zoom level to slot this one in
		for (; zoom >= 0; zoom--) {
			markerPoint = this.project(layer.getLatLng(), zoom); // calculate pixel position
			//console.log(markerPoint);
			//console.log(markerPoint);
		
			// Try find the closest cluster to this marker point
			var closest = gridClusters[zoom].getNearObject(markerPoint);
			//console.log(closest);
			if (closest) {
				//console.log("Cerca a una grilla con cluster");
				closest._addChild(layer);
				layer.__parent = closest;
				// This point is close tn an existing cluster
				//closest._addChild(layer);
				return;
			}

			//Try find a marker close by to form a new cluster with
			closest = gridUnclustered[zoom].getNearObject(markerPoint);
			if (closest) {
				//console.log("Cerca a una grilla sin cluster");
				var parent = closest.__parent;
				if (parent) {
					this._removeLayer(closest, false);
				}

				var newCluster = new ServerCluster.MarkerCluster(this, zoom, closest, layer);
				gridClusters[zoom].addObject(newCluster, this.project(newCluster._cLatLng, zoom));
				closest.__parent = newCluster;
				layer.__parent = newCluster;

				//First create any new intermediate parent clusters that don't exist
				var lastParent = newCluster;
				for (z = zoom - 1; z > parent._zoom; z--) {
					lastParent = new ServerCluster.MarkerCluster(this, z, lastParent);
					gridClusters[z].addObject(lastParent, this.project(closest.getLatLng(), z));
				}
				parent._addChild(lastParent);

				//Remove closest from this zoom level and any above that it is in, replace with newCluster
				for (z = zoom; z >= 0; z--) {
					if (!gridUnclustered[z].removeObject(closest, this.project(closest.getLatLng(), z))) {
						break;
					}
				}
				return;
			}

			//console.log("En este nivel de zoom no será clustered");
			//Didn't manage to cluster in at this zoom, record us as a marker here and continue upwards
			gridUnclustered[zoom].addObject(layer, markerPoint);
		}

		//Didn't get in anything, add us to the top
		this._topClusterLevel._addChild(layer);
		//console.log("Imprimiendo topclusterlayer");
		//console.log(this._topClusterLevel);
		layer.__parent = this._topClusterLevel;
		return;
	},

	project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
		zoom = zoom === undefined ? this._zoom : zoom;
		return ServerCluster.CRS.latLngToPoint(ServerCluster.latLng(latlng), zoom);
	},
});

/*
 * ServerCluster.Projection contains various geographical projections used by CRS classes.
 */

ServerCluster.Projection = {};

/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */
ServerCluster.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) { // (LatLng) -> Point
		var d = ServerCluster.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    x = latlng.lng * d,
		    y = lat * d;

		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		return new ServerCluster.Point(x, y);
	},
};

/*
 * ServerCluster.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

ServerCluster.Transformation = function (a, b, c, d) {
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
};

ServerCluster.Transformation.prototype = {
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	untransform: function (point, scale) {
		scale = scale || 1;
		return new L.Point(
			(point.x / scale - this._b) / this._a,
			(point.y / scale - this._d) / this._c);
	}
};

ServerCluster.CRS = {
	projection: ServerCluster.Projection.SphericalMercator,
	transformation: new ServerCluster.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

	latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},
};

ServerCluster.DistanceGrid = function (cellSize) {
	this._cellSize = cellSize;
	this._sqCellSize = cellSize * cellSize;
	this._grid = {};
	this._objectPoint = { };
};

ServerCluster.DistanceGrid.prototype = {
	addObject: function (obj, point) {
		var x = this._getCoord(point.x),
		    y = this._getCoord(point.y),
		    grid = this._grid,
		    row = grid[y] = grid[y] || {},
		    cell = row[x] = row[x] || [],
		    stamp = ServerCluster.Util.stamp(obj);

		//console.log("Valor de X: " + x);
		//console.log("Valor de Y: " + y);
		//console.log("Longitud: " + this._grid[y][x].length);

		this._objectPoint[stamp] = point;

		cell.push(obj);
		//console.log("Longitud: " + this._grid[y][x].length);
		//console.log(cell);
	},
	//Returns true if the object was found
	removeObject: function (obj, point) {
		var x = this._getCoord(point.x),
		    y = this._getCoord(point.y),
		    grid = this._grid,
		    row = grid[y] = grid[y] || {},
		    cell = row[x] = row[x] || [],
		    i, len;

		delete this._objectPoint[ServerCluster.Util.stamp(obj)];

		for (i = 0, len = cell.length; i < len; i++) {
			if (cell[i] === obj) {

				cell.splice(i, 1);

				if (len === 1) {
					delete row[x];
				}

				return true;
			}
		}

	},
	getNearObject: function (point) {
		var x = this._getCoord(point.x),
		    y = this._getCoord(point.y),
		    i, j, k, row, cell, len, obj, dist,
		    objectPoint = this._objectPoint,
		    closestDistSq = this._sqCellSize,
		    closest = null;

		for (i = y - 1; i <= y + 1; i++) {
			row = this._grid[i];
			if (row) {

				for (j = x - 1; j <= x + 1; j++) {
					cell = row[j];
					if (cell) {

						for (k = 0, len = cell.length; k < len; k++) {
							obj = cell[k];
							dist = this._sqDist(objectPoint[ServerCluster.Util.stamp(obj)], point);
							if (dist < closestDistSq) {
								closestDistSq = dist;
								closest = obj;
							}
						}
					}
				}
			}
		}
		return closest;
	},

	_getCoord: function (x) {
		return Math.floor(x / this._cellSize);
	},

	_sqDist: function (p, p2) {
		var dx = p2.x - p.x,
		    dy = p2.y - p.y;
		return dx * dx + dy * dy;
	}
};

ServerCluster.Popup = ServerCluster.Class.extend({
	includes: ServerCluster.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		maxHeight: null,
		autoPan: true,
		closeButton: true,
		offset: new ServerCluster.Point(0, 6),
		autoPanPadding: new ServerCluster.Point(5, 5),
		className: '',
		zoomAnimation: true
	},

	initialize: function (options, source) {
		ServerCluster.setOptions(this, options);

		this._source = source;
		//this._animated = ServerCluster.Browser.any3d && this.options.zoomAnimation;
	},

	setContent: function (content) {
		this._content = content;
		this._update();
		return this;
	},

	_update: function () {
		if (!this._map) { return; }
	},

});

ServerCluster.popup = function (options, source) {
	return new ServerCluster.Popup(options, source);
};

/*
 * Popup extension to ServerCluster.Marker, adding popup-related methods.
 */

ServerCluster.Marker.include({
	bindPopup: function (content, options) {
		var anchor = ServerCluster.point(this.options.icon.options.popupAnchor) || new ServerCluster.Point(0, 0);

		anchor = anchor.add(ServerCluster.Popup.prototype.options.offset);

		if (options && options.offset) {
			anchor = anchor.add(options.offset);
		}

		options = ServerCluster.extend({offset: anchor}, options);

		if (!this._popup) {
			this
			    .on('click', this.openPopup, this)
			    .on('remove', this.closePopup, this)
			    .on('move', this._movePopup, this);
		}

		if (content instanceof ServerCluster.Popup) {
			ServerCluster.setOptions(content, options);
			this._popup = content;
		} else {
			this._popup = new ServerCluster.Popup(options, this)
				.setContent(content);
		}

		return this;
	},
});

exports.markerClusterGroup = function() {
	return new ServerCluster.MarkerClusterGroup(/*{ disableClusteringAtZoom: 15 }*/);
};

exports.latLng = function(latitude, longitude) {
	return new ServerCluster.LatLng(latitude, longitude);
};

exports.marker = function(latlng, options) {
	return new ServerCluster.Marker(latlng, options);
};