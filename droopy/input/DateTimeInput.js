define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dojo/text!./DateTimeInput.html',
	'dijit/_WidgetsInTemplateMixin',

	'./DateInput',
	'./TimeInput',
	'./ValueInput'
], function (declare, _WidgetBase, TemplatedMixin, template, WidgetsInTemplateMixin)
{
return declare([_WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
	templateString: template,
	useMicros: false,	// whether to show microseconds control

	// template controls
	microsInput: null,

	buildRendering: function ()
	{
		this.inherited(arguments);
		if (!this.useMicros)
		{
			this.microsInput.domNode.style.display = 'none';
		}
	},

	postCreate: function ()
	{
		this.inherited(arguments);
	},

	startup: function ()
	{
		this.inherited(arguments);
	},

// ************************ Exported functions ***********************************************
	getTimestamp: function()
	{

	}

});
});
