define(["knockout"], function(ko) {
	var ResumeOrderName = function(data) {
		this.id = data.id;
		this.order_rank = data.order_rank;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.order_rankWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeOrderName;
});