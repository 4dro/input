define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-class',
	'dojo/on',
	'dojo/keys'
], function(declare, _WidgetBase, domClass, on, keys){
return declare([_WidgetBase], {
	// public properties
	inputs: null,
	separators: null,
	fraction: 2,

	// internal properties
	_inputFields: null,
	_sepFields: null,

	constructor: function()
	{
		this.inputs = [999, 999, 99];
		this.separators = [' ', '.'];
	},

	buildRendering: function()
	{
		this.inherited(arguments);
		domClass.add(this.domNode, 'droopy-input');
		this._inputFields = [];
		for (var i = 0; i < this.inputs.length; i++)
		{
			var inp = document.createElement('input');
			var val = this.inputs[i];
			inp.setAttribute('type', 'text');
			inp.setAttribute('maxlength', val.toString().length);
			inp.setAttribute('data-idx', i);

			this._inputFields.push(inp);
			this.domNode.appendChild(inp);
			this.own(on(inp, 'keypress', function(e){

			}));
		}
		this._sepFields = [];
		for (i = 0; i < this.separators.length; i++)
		{
			var sep = document.createElement('span');
			this._sepFields.push(sep);
			this.domNode.appendChild(sep);
		}
	}
});
});
