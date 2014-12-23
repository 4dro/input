define([
    'dojo/_base/declare',
    './ValueInput'
], function(declare, NumberInput){
return declare([NumberInput], {

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
    }
});
});