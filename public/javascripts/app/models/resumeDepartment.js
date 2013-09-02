define(["knockout"], function(ko) {
	var ResumeDepartment = function(data) {
		this.departmentName = data.departmentName;
		this.isoDepartmentCode = data.isoDepartmentCode;
		this.occurrences = data.occurrences;

		this.departmentNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.departmentName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.departmentName;
			}
		}, this);
	};

	return ResumeDepartment;
});