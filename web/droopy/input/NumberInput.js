define([
	'dojo/_base/declare',
	'dijit/_WidgetBase'
], function(declare, _WidgetBase){
return declare([_WidgetBase], {
	inputs: null,
	separators: null,

	constructor: function(args)
	{
		this.inputs = [];
		this.separators = [];
		declare.safeMixin(this, args);
	},

	buildRendering: function()
	{
		this.inherited(arguments);
	}
});
});
