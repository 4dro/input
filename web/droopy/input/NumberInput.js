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
	focusedField: 0,

	constructor: function()
	{
		this.inputs = [999, 999, 99];
		this.separators = [' ', '.'];
	},

// ********************* Construction *********************************************************
	buildRendering: function()
	{
		this.inherited(arguments);
		domClass.add(this.domNode, 'droopy-input');
		if (!this.domNode.getAttribute('tabindex'))
		{
			this.domNode.setAttribute('tabindex', '0');
		}
		var self = this;
		this.own(on(this.domNode, 'focus', function(e){
			self._inputFields[self.focusedField].focus();
		}));
		this._inputFields = [];
		for (var i = 0; i < this.inputs.length; i++)
		{
			var inp = document.createElement('input');
			var valSize = this.inputs[i].toString().length;
			inp.setAttribute('type', 'text');
			inp.setAttribute('maxlength', valSize);
			inp.setAttribute('data-idx', i);
			inp.setAttribute('pattern', '[0-9]');
			inp.setAttribute('tabindex', '-1');
			domClass.add(inp, 'droopy' + valSize + 'char');
			this._inputFields.push(inp);
			this.domNode.appendChild(inp);
			this.own(on(inp, 'keydown', keydoown));
		}
		this.focusedField = this._inputFields.length - 1;
		this._sepFields = [];
		for (i = 0; i < this.separators.length; i++)
		{
			var sep = document.createElement('span');
			valSize = this.separators[i].length;
			this._sepFields.push(sep);
			domClass.add(sep, 'droopy' + valSize + 'char');
			this.domNode.appendChild(sep);
		}

		function keydoown(e)
		{
			var idx = this.getAttribute('data-idx');
			var val = self.inputs[idx];
			var text = this.value;
			if (e.keyCode == keys.LEFT_ARROW)
			{
			}
			else if (e.keyCode == keys.RIGHT_ARROW)
			{
			}
			else if (e.keyCode == keys.UP_ARROW)
			{
				var num = parseInt(text) || 0;
				if (num == val)
				{
					this.value = '0'
				}
				else
				{
					this.value = (num + 1).toString();
				}
			}
			else if (e.keyCode == keys.DOWN_ARROW)
			{
				num = parseInt(text) || 0;
				if (num == 0)
				{
					this.value = val.toString();
				}
				else
				{
					this.value = (num - 1).toString();
				}
			}
		}
	}
});
});
