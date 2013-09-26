define(["underscore", "knockout"], function(_, ko) {
	var BaseViewModel = function(options) {
		this._setup(options);
		this.initialize.call(this, options);
	};

	_.extend(BaseViewModel.prototype, {
		initialize: function() {
		},

		_setup: function(options) {
			var prop;
			options = options || {};
			for(prop in this) {
				if (this.hasOwnProperty(prop)) {
					if (options[prop]) {
						this[prop] = _.isArray(options[prop]) ?
							ko.observableArray(options[prop]) :
							ko.observable(options[prop]);
					}
					else {
						this[prop] = _.isArray(this[prop]) ?
							ko.observableArray(this[prop]) :
							ko.observable(this[prop]);
					}
				}
			}
		}
	});

	return BaseViewModel;
});