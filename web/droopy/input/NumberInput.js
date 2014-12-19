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
		var self = this;
		this._inputFields = [];
		for (var i = 0; i < this.inputs.length; i++)
		{
			var inp = document.createElement('input');
			var valSize = this.inputs[i].toString().length;
			inp.setAttribute('type', 'text');
			inp.setAttribute('maxlength', valSize);
			inp.setAttribute('data-idx', i);
			inp.setAttribute('pattern', '[0-9]');
			domClass.add(inp, 'droopy' + valSize + 'char');
			this._inputFields.push(inp);
			this.domNode.appendChild(inp);
			this.own(on(inp, 'keydown', function(e){
				var idx = this.getAttribute('data-idx');
				if (e.keyCode == keys.LEFT_ARROW)
				{
					debugger;

				}
				else if (e.keyCode == keys.RIGHT_ARROW)
				{
					debugger;

				}
			}));
		}
		this._sepFields = [];
		for (i = 0; i < this.separators.length; i++)
		{
			var sep = document.createElement('span');
			valSize = this.separators[i].length;
			this._sepFields.push(sep);
			domClass.add(sep, 'droopy' + valSize + 'char');
			this.domNode.appendChild(sep);
		}
	}
});
});
