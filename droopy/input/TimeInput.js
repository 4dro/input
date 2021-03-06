define([
	'dojo/_base/declare',
	'./NumberInput'
], function(declare, NumberInput){
return declare([NumberInput],
{
	needFill: true,
	fillLeft: false,

	// Time config
	useHours: true,
	useMinutes: true,
	useSeconds: true,
	fractionFields: 0,

	constructor: function()
	{
		this.inputs = [23, 59, 59];
		this.separators = [':', ':'];
	},

	buildRendering: function()
	{
		this.inherited(arguments);
		this.focusedField = 0;
	}
});
});