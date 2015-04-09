define([
	'dojo/_base/declare',
	'./NumberInput'
], function (declare, NumberInput)
{
return declare([NumberInput],
{
	needFill: true,
	fractionFields: 0,
	fillLeft: false,

	constructor: function()
	{
		this.inputs = [9999, 12, 31];
		this.separators = ['-', '-'];
	},

	buildRendering: function()
	{
		this.inherited(arguments);
		this.focusedField = 0;
	},

	getDate: function()
	{
		var vals = this.getValue();
		var date = new Date(vals[0], vals[1], vals[2]);
		return date;
	}
});
});