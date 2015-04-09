define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-class',
	'dojo/on',
	'dojo/keys',
	'dijit/_FocusMixin'
], function(declare, _WidgetBase, domClass, on, keys, _FocusMixin){
return declare([_WidgetBase, _FocusMixin], {
	// public properties
	inputs: null,
	separators: null,
	fractionFields: 1,
	needFill: false,
	fillLeft: true,

	_disabled: false,

	// internal properties
	_inputFields: null,
	_sepFields: null,
	focusedField: 0,
	_values: null,

	constructor: function()
	{
		this.inputs = [999, 999, 99];
		this.separators = [' ', '.'];
		this._values = [];
	},

	postMixInProperties: function()
	{
		this.inherited(arguments);
		if (this.separators.length != this.inputs.length - 1)
		{
			throw new Error('Input initialization error: wrong parameters.');
		}
		for (var i = 0; i < this.inputs.length; i++)
		{
			if (this.needFill)
			{
				this._values.push(this._constructText(i, '0'));
			}
			else
			{
				this._values.push('');
			}
		}
	},

// ********************* Construction *********************************************************
	buildRendering: function()
	{
		this.domNode = this.ownerDocument.createElement("div");
		this.inherited(arguments);
		domClass.add(this.domNode, 'droInput');
		if (!this.domNode.getAttribute('tabindex'))
		{
			this.domNode.setAttribute('tabindex', '0');
		}
		var self = this;
		this.own(on(this.domNode, 'focus', function(e){
			//console.log('get focus', e.relatedTarget);
			if (e.relatedTarget && e.relatedTarget.parentNode == self.domNode)  // shift + tab
			{
				console.log('shift + tab');
				// TODO: dispatch a shift + tab event
			}
			else
			{
				self._inputFields[self.focusedField].focus();
			}
		}));
		this.own(on(this.domNode, 'paste', function(e){
			console.log('paste');
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
			inp.setAttribute('value', this._values[i]);
			domClass.add(inp, 'dro' + valSize + 'char');
			this._inputFields.push(inp);
			this.domNode.appendChild(inp);
			this.own(on(inp, 'focus', function(e){
				self.focusedField = parseInt(this.getAttribute('data-idx'));
				e.target.selectionStart = 0;
				e.target.selectionEnd = this.value.length;
			}));
			this.own(on(inp, 'keydown', function(e){
				if (e.keyCode == keys.TAB && e.shiftKey)
				{
					//console.log('keydown key' + e.keyCode, e);
					e.preventDefault();
					var shiftTab = new KeyboardEvent("keydown", {
						bubbles : true,
						cancelable : true,
						charCode : 0,
						shiftKey : true,
						keyCode : 9
					});
					self.domNode.focus();
					self.domNode.dispatchEvent(shiftTab);
				}
				//console.log('keydown key' + e.keyCode, e);
				self._onInpKeydown(e, this, parseInt(this.getAttribute('data-idx')));
			}));
			this.own(on(inp, 'keypress', function(e){
				//console.log('keypress ' + e);
				self._onInpKeypress(e, this);
			}));
			this.own(on(inp, 'keyup', function(e){	// The change goes here
				//console.log('keyup key ' + e.keyCode, e);
				var idx = parseInt(this.getAttribute('data-idx'));
				if (this.value != self._values[idx])
				{
					self._values[idx] = this.value;
					self.onUserChange();
				}
			}));
			if (this.separators.length > i)
			{
				var sep = document.createElement('span');
				valSize = this.separators[i].length;
				sep.textContent = this.separators[i];
				this._sepFields.push(sep);
				domClass.add(sep, 'dro' + valSize + 'char');
				this.domNode.appendChild(sep);
			}
		}
		this.focusedField = this._inputFields.length - 1 - this.fractionFields;
	},

	startup: function()
	{
		this.inherited(arguments);
	},

// ******************** Event handling ***********************************************************
	_onInpKeydown: function(e, input, idx)
	{
		var text = input.value;
		if (e.keyCode == keys.LEFT_ARROW)
		{
			if (input.selectionStart == 0 || input.selectionEnd == 0)
			{
				if (idx > 0)
				{
					this._fieldEditEnd(idx, input.value);
					this._inputFields[idx - 1].focus();
					e.preventDefault();
				}
			}
		}
		else if (e.keyCode == keys.RIGHT_ARROW)
		{
			if (input.selectionStart == text.length || input.selectionEnd == text.length)
			{
				if (idx < this._inputFields.length - 1)
				{
					this._fieldEditEnd(idx, input.value);
					this._inputFields[idx + 1].focus();
					e.preventDefault();
				}
			}
		}
		else if (e.keyCode == keys.UP_ARROW)
		{
			var num = parseInt(text) || 0;
			num = (num == this.inputs[idx]) ? 0 : num + 1;	// max number
			input.value = (this._hasElder(idx) || this.needFill) ? this._constructText(idx, num) : num;
			this._updateLowers(idx);
			// select the whole text
			input.selectionStart = 0;
			input.selectionEnd = input.value.length;
			e.preventDefault();
		}
		else if (e.keyCode == keys.DOWN_ARROW)
		{
			num = parseInt(text) || 0;
			num = (num == 0) ? this.inputs[idx] : num - 1;	// maximum number
			input.value = (this._hasElder(idx) || this.needFill) ? this._constructText(idx, num) : num;
			this._updateLowers(idx);
			// select the whole text
			input.selectionStart = 0;
			input.selectionEnd = input.value.length;
			e.preventDefault();
		}
	},

	_onInpKeypress: function(e, input)
	{
		if (e.charCode < 0x30 || e.charCode > 0x39)
		{
			e.preventDefault();
			return;
		}
		var num = String.fromCharCode(e.charCode);
		var idx = parseInt(input.getAttribute('data-idx'));
		if (input.value.length == this.inputs[idx].toString().length)	// the input is filled up
		{
			if (input.selectionStart == input.selectionEnd && input.selectionEnd == input.value.length)
			{
				// we should switch to another field
				if (this.fillLeft && idx > 0)
				{
					this._inputFields[idx - 1].focus();
					this._inputFields[idx - 1].value = num;
				}
				else if (!this.fillLeft && idx < this._inputFields.length - 1)
				{
					this._inputFields[idx + 1].focus();
					this._inputFields[idx + 1].value = num;
				}
			}
		}
		this._updateLowers(idx);
	},

	_onFocus: function(e)
	{
		domClass.add(this.domNode, 'droFocus');
	},

	_onBlur: function(e)
	{
		domClass.remove(this.domNode, 'droFocus');
	},

	onChange: function()
	{
	},

// ********************* Exported functions ******************************************************
	// Returns an array of text values for each input
	getValue: function()
	{
		return this._values.slice();
	},

	onUserChange: function()
	{
		console.log('change');
	},

	_setDisabledAttr: function(value)
	{
		if (typeof value == 'string')
		{
			value = true;
		}
		if (value)
		{
			this.domNode.removeAttribute('tabindex');
			domClass.add(this.domNode, 'droDisabled');
			for (var i = 0; i < this._inputFields.length; i++)
			{
				this._inputFields[i].disabled = true;
			}
		}
		else
		{
			this.domNode.setAttribute('tabindex', '0');
			domClass.remove(this.domNode, 'droDisabled');
			for (i = 0; i < this._inputFields.length; i++)
			{
				this._inputFields[i].disabled = false;
			}
		}
	},

// ******************** Helper functions ***********************************************************
	// The user has left the input field
	_fieldEditEnd: function(idx, value)
	{
		if (this.needFill || this._hasElder(idx))
		{
			this._inputFields[idx].value = this._constructText(idx, value);
		}
	},

	// Pad the input text with '0's
	_constructText: function(idx, val)
	{
		val = val.toString();
		var max = this.inputs[idx].toString().length;	// the length of the field
		val = '000000000000000000000000000000000000000000000'.substr(0, max - val.length) + val;
		return val;
	},

	_hasElder: function(idx)
	{
		if (idx == 0)
		{
			return false;
		}
		return this._values[idx - 1] != '';
	},

	// Set numbers on the fields that are lower than the editing one
	_updateLowers: function(idx)
	{
		if (idx < this._inputFields.length - 1)
		{
			for (var i = idx + 1; i < this._inputFields.length; i++)
			{
				this._inputFields[i].value = this._constructText(i, this._values[i]);
			}
		}
	},

	_setValueAttr: function(value)
	{

	}
});
});