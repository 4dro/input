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
	fractionFields: 1,

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
		if (this.separators.length != this.inputs.length - 1)
		{
			throw new Error('Input initialization error: wrong parameters.');
		}
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
		this._sepFields = [];
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
			this.own(on(inp, 'focus', function(e){
				self.focusedField = parseInt(this.getAttribute('data-idx'));
				e.target.selectionStart = 0;
				e.target.selectionEnd = this.value.length;
			}));
			this.own(on(inp, 'keydown', keydown));
			this.own(on(inp, 'keypress', function(e){
				if (e.charCode < 0x30 || e.charCode > 0x39)
				{
					// TODO: check selection then delete
					e.preventDefault();
					return;
				}
				var idx = parseInt(this.getAttribute('data-idx'));
				self._updateLowers(idx);
			}));
			if (this.separators.length > i)
			{
				var sep = document.createElement('span');
				valSize = this.separators[i].length;
				sep.textContent = this.separators[i];
				this._sepFields.push(sep);
				domClass.add(sep, 'droopy' + valSize + 'char');
				this.domNode.appendChild(sep);
			}
		}
		this.focusedField = this._inputFields.length - 1 - this.fractionFields;

		function keydown(e)
		{
			var idx = parseInt(this.getAttribute('data-idx'));
			var val = self.inputs[idx];
			var text = this.value;
			if (e.keyCode == keys.LEFT_ARROW)
			{
				if (this.selectionStart == 0 || this.selectionEnd == 0)
				{
					if (idx > 0)
					{
						self._updateValue(idx, text);
						self._inputFields[idx - 1].focus();
						e.preventDefault();
					}
				}
			}
			else if (e.keyCode == keys.RIGHT_ARROW)
			{
				if (this.selectionStart == text.toString().length ||
					this.selectionEnd == text.toString().length)
				{
					if (idx < self._inputFields.length - 1)
					{
						self._updateValue(idx, text);
						self._inputFields[idx + 1].focus();
						e.preventDefault();
					}
				}
			}
			else if (e.keyCode == keys.UP_ARROW)
			{
				var num = parseInt(text) || 0;
				if (num == val)
				{
					self._updateValue(idx, 0);
				}
				else
				{
					self._updateValue(idx, num + 1);
				}
				this.selectionStart = 0;
				this.selectionEnd = this.value.length;
				e.preventDefault();
			}
			else if (e.keyCode == keys.DOWN_ARROW)
			{
				num = parseInt(text) || 0;
				if (num == 0)
				{
					self._updateValue(idx, val);
				}
				else
				{
					self._updateValue(idx, num - 1);
				}
				this.selectionStart = 0;
				this.selectionEnd = this.value.length;
				e.preventDefault();
			}
		}
	},

// ********************* Exported functions ******************************************************
	getValue: function()
	{
		var ret = [];
		for (var i = this._inputFields.length - 1; i >= 0 ; i--)
		{
			var val = this._inputFields[i].value;
			ret.push(val);
		}
		return ret;
	},

// ******************** Helper functions ***********************************************************
	_updateValue: function(idx, val, force)
	{
		val = val.toString();
		if (this._hasElder(idx) || force)
		{
			var max = this.inputs[idx].toString().length;
			val = '000000000000000000000000000000000000000000000'.substr(0, max - val.length) + val;
		}
		if (val.length)
		{
			this._updateLowers(idx);
		}
		this._inputFields[idx].value = val;
	},

	_hasElder: function(idx)
	{
		if (idx == 0)
		{
			return false;
		}
		return this._inputFields[idx - 1].value != '';
	},

	// Set numbers on the fields that are lower the the editing one
	_updateLowers: function(idx)
	{
		if (idx < this._inputFields.length - 1)
		{
			for (var i = idx + 1; i < this._inputFields.length; i++)
			{
				this._updateValue(i, this._inputFields[i].value, true);
			}
		}
	},

	_setValueAttr: function(value)
	{

	}
});
});