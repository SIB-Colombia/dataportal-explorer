define(["knockout"], function(ko) {
	var ResumeOrderName = function(data) {
		this.id = data.id;
		this.order_rank = data.order_rank;
		this.occurrences = data.occurrences;

		this.order_rankWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.order_rank.replace(regex, "<strong>$1</strong>");
			} else {
				return this.order_rank;
			}
		}, this);
	};

	return ResumeOrderName;
});