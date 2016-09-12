define(["knockout"], function(ko) {
	var ResumeDepartment = function(data) {
		this.departmentName = data.departmentName;
		this.isoDepartmentCode = data.isoDepartmentCode;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.departmentNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeDepartment;
});