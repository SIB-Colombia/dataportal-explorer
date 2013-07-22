/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var DepartmentsGroupSchema = new Schema( {
	departmentName: {type: String, trim: true},
	isoDepartmentCode: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'department_groups' })

mongoose.model('DepartmentsGroup', DepartmentsGroupSchema)