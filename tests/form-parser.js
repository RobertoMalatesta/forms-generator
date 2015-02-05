
var path = require('path');
var util = require('util');
var vows = require("vows");
var assert = require("assert");
var fg = require(path.join(__dirname, '../lib/forms-generator.js'));


vows.describe("Form definitions parser")
  .addBatch({
    "Input field" : {
      topic: function() {
        return new fg.Form("TForm", null ,null,
                           [ "field" , "text" ]);
      },
      "id" : function (form) {
        assert.strictEqual(form.skel.id, "TForm");
      },
      "attributes" : function (form) {
        assert.strictEqual(form.skel.attrs.target, "TFormIframe");
        assert.strictEqual(form.skel.attrs.action, "TFormSend");
        assert.strictEqual(form.skel.attrs.enctype, "multipart/form-data");
        assert.strictEqual(form.skel.attrs.method, "post");
        assert.strictEqual(form.skel.attrs.name, "TForm");
      },
      "validators" : function (form) {
        assert.isNull(form.validators.fields["field"]);
        assert.isNull(form.globalValidator);
      },
      "fields" : function (form) {
        assert.isArray(form.skel.fields);
        assert.lengthOf(form.skel.fields, 1);
      },
      "field id" : function (form) {
        assert.strictEqual(form.skel.fields[0].id, "TForm-field");
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "text");
      },
      "field attributes" : function (form) {
        assert.strictEqual(form.skel.fields[0].attrs.type, "text");
        assert.strictEqual(form.skel.fields[0].attrs.name, "field");
      },
      "field label type" : function (form) {
        assert.isFunction(form.skel.fields[0].label);
      },
      "field label value" : function (form) {
        assert.strictEqual(form.skel.fields[0].label().toString(), "TForm-field");
      },
      "expected fields" : function (form) {
        assert.isTrue(form.hasField("field"));
      }
    },
    "Input field attributes" : {
      topic: function() {
        return new fg.Form("TForm", null, { "class" : "class1"},
                           [ "field" , "text",  { "class" : "class2"} ]);
      },
      "attributes" : function (form) {
        assert.strictEqual(form.skel.attrs["class"], "class1");
      },
      "field attributes" : function (form) {
        assert.strictEqual(form.skel.fields[0]["class"], "class2");
        assert.isUndefined(form.skel.fields[0].attrs["class"]);
      }
    },
    "Select field" : {
      topic: function() {
        return new fg.Form("TForm", null, null,
                           [ "field" , "select", null, "sel1", "sel2" ]);
      },
      "fields" : function (form) {
        assert.isArray(form.skel.fields);
        assert.lengthOf(form.skel.fields, 1);
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "select");
      },
      "entries" : function (form) {
        assert.isArray(form.skel.fields[0].entrydata);
        assert.lengthOf(form.skel.fields[0].entrydata, 2);
      },
      "entries ids" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].id, "TForm-field-sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].id, "TForm-field-sel2");
      },
      "entries attributes" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].attrs.value, "sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].attrs.value, "sel2");
      },
      "entries content type" :  function (form) {
        assert.isFunction(form.skel.fields[0].entrydata[0].content);
        assert.isFunction(form.skel.fields[0].entrydata[1].content);
      },
      "entries content value" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].content().toString(), "TForm-field-sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].content().toString(), "TForm-field-sel2");
      },
      "expected values" : function (form) {
        assert.deepEqual(form.getExpectedValues("field"), ["sel1", "sel2"]);
      }
    },
    "Select field groups" : {
      topic: function() {
        return new fg.Form("TForm", null, null,
                           [ "field" , "select", null, "sel1", "sel2",
                             [ "grp1", null, "sel3", "sel4" ]]);
      },
      "entries" :  function (form) {
        assert.lengthOf(form.skel.fields[0].entrydata, 3);
        assert.lengthOf(form.skel.fields[0].entrydata[2].entrydata, 2);
      },
      "entries ids" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].id, "TForm-field-sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].id, "TForm-field-sel2");
        assert.strictEqual(form.skel.fields[0].entrydata[2].id, "TForm-field-grp1");
        assert.strictEqual(form.skel.fields[0].entrydata[2].entrydata[0].id, "TForm-field-sel3");
        assert.strictEqual(form.skel.fields[0].entrydata[2].entrydata[1].id, "TForm-field-sel4");
      },
      "entries attributes" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].attrs.value, "sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].attrs.value, "sel2");
        assert.strictEqual(form.skel.fields[0].entrydata[2].entrydata[0].attrs.value, "sel3");
        assert.strictEqual(form.skel.fields[0].entrydata[2].entrydata[1].attrs.value, "sel4");
      },
      "expected values" : function (form) {
        assert.deepEqual(form.getExpectedValues("field"), ["sel1", "sel2", "sel3", "sel4"]);
      }
    },
    "Select field attributes" : {
      topic: function() {
        return new fg.Form("TForm", null, null,
                           [ "field" , "select", null,
                             "sel1", {id: "sel2", "class": "specialSelect"}, "sel3"] );
      },
      "entries" : function (form) {
        assert.isArray(form.skel.fields[0].entrydata);
        assert.lengthOf(form.skel.fields[0].entrydata, 3);
      },
      "entries attributes" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].attrs.value, "sel1");
        assert.strictEqual(form.skel.fields[0].entrydata[1].attrs.value, "sel2");
        assert.strictEqual(form.skel.fields[0].entrydata[1].attrs["class"], "specialSelect");
        assert.strictEqual(form.skel.fields[0].entrydata[2].attrs.value, "sel3");
      }
    },
    "Single checkbox field" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "checkbox"]);
      },
      "field" : function (form) {
        assert.strictEqual(form.skel.fields[0].id, "TForm-field");
        assert.strictEqual(form.skel.fields[0].type, "checkbox");
        assert.isFunction(form.skel.fields[0].label);
        assert.isTrue(form.skel.fields[0].singleEntry);
      },
      "attributes" : function (form) {
        assert.strictEqual(form.skel.fields[0].attrs.type, "checkbox");
        assert.strictEqual(form.skel.fields[0].attrs.name, "field");
        assert.strictEqual(form.skel.fields[0].attrs.value, "field");
      },
      "expected values" : function (form) {
        assert.deepEqual(form.getExpectedValues("field"), ["field"]);
      },
      "entries" : function (form) {
        assert.isUndefined(form.skel.fields[0].entries);
      }
    },
    "Multi-checkbox field" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "checkbox", null, "flag1", "flag2" ]);
      },
      "field" : function (form) {
        assert.isUndefined(form.skel.fields[0].singleEntry);
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "checkbox");
      },
      "entries attributes" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].attrs.type, "checkbox");
      },
      "expected values" : function (form) {
        assert.deepEqual(form.getExpectedValues("field"), ["flag1", "flag2"]);
      }
    },
    "Radio buttons field" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "radio", null, "flag1", "flag2" ]);
      },
      "field" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "radio");
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "radio");
      },
      "entries" : function (form) {
        assert.lengthOf(form.skel.fields[0].entrydata, 2);
      },
      "entries attributes" :  function (form) {
        assert.strictEqual(form.skel.fields[0].entrydata[0].attrs.type, "radio");
      },
      "expected values" : function (form) {
        assert.deepEqual(form.getExpectedValues("field"), ["flag1", "flag2"]);
      }
    },
    "Textarea field" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "textarea" ]);
      },
      "field" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "textarea");
        assert.isUndefined(form.skel.fields[0].attrs.type);
      }
    },
    "Hidden field" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "hidden" ]);
      },
      "field" : function (form) {
        assert.isNull(form.skel.fields[0].label);
      }
    },
    "Button" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "field" , "button"]);
      },
      "field" : function (form) {
        assert.isNull(form.skel.fields[0].label);
      }
    },
    "Field set" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "set" , "fieldset", null,
                                                  [ "field1" , "text" ],
                                                  [ "field2" , "text" ]
                                                ]);
      },
      "field" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "fieldset");
      },
      "fields" : function (form) {
        assert.isArray(form.skel.fields[0].fields);
        assert.lengthOf(form.skel.fields[0].fields, 2);
        assert.strictEqual(form.skel.fields[0].fields[0].id, "TForm-field1");
        assert.strictEqual(form.skel.fields[0].fields[1].id, "TForm-field2");
      }
    },
    "Empty div" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ "set" , "div"]);
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "div");
      },
      "fields length" : function (form) {
        assert.isArray(form.skel.fields[0].fields);
        assert.lengthOf(form.skel.fields[0].fields, 0);
      }
    },
    "No id div" : {
      topic: function() {
        return new fg.Form("TForm", null, null, [ null , "div"]);
      },
      "field type" : function (form) {
        assert.strictEqual(form.skel.fields[0].type, "div");
      },
      "fields length" : function (form) {
        assert.isArray(form.skel.fields[0].fields);
        assert.lengthOf(form.skel.fields[0].fields, 0);
      }
    },
    "Nested form" : {
      topic: function() {
        return new fg.Form("TForm", null, null,
                           [ "field1", "text" ],
                           [ "field2", "text" ],
                           [ "set", "fieldset", null,
                             [ "field3", "text" ],
                             [ "field4", "text" ] ],
                           [ "field5", "text" ],
                           [ "field6", "text" ] );
      },
      "fields length" :  function (form) {
        assert.lengthOf(form.skel.fields, 5);
        assert.lengthOf(form.skel.fields[2].fields, 2);
      },
      "fields ids" : function (form) {
        assert.strictEqual(form.skel.fields[0].id, "TForm-field1");
        assert.strictEqual(form.skel.fields[1].id, "TForm-field2");
        assert.strictEqual(form.skel.fields[2].id, "TForm-set");
        assert.strictEqual(form.skel.fields[2].fields[0].id, "TForm-field3");
        assert.strictEqual(form.skel.fields[2].fields[1].id, "TForm-field4");
        assert.strictEqual(form.skel.fields[3].id, "TForm-field5");
        assert.strictEqual(form.skel.fields[4].id, "TForm-field6");
      }
    },
    "Global translation IDs" : {
      topic: function() {
        return new fg.Form("TForm", { noPrefix : true }, null,
                           [ "field1", "text" ],
                           [ "set", "fieldset", null,
                             [ "field2", "text" ],
                             [ "field3", "text" ] ],
                           [ "field4", "text" ] );
      },
      "fields length" : function (form) {
        assert.lengthOf(form.skel.fields, 3);
        assert.lengthOf(form.skel.fields[1].fields, 2);
      },
      "fields ids" : function (form) {
        assert.strictEqual(form.skel.fields[0].label().toString(), "field1");
        assert.strictEqual(form.skel.fields[1].label().toString(), "set");
        assert.strictEqual(form.skel.fields[1].fields[0].label().toString(), "field2");
        assert.strictEqual(form.skel.fields[1].fields[1].label().toString(), "field3");
        assert.strictEqual(form.skel.fields[2].label().toString(), "field4");
      }
    },
    "Translation IDs escaping" : {
      topic: function() {
        return new fg.Form("TForm", null ,null,
                           [ fg.nTP("field") , "text" ]);
      },
      "field label" : function (form) {
        assert.isFunction(form.skel.fields[0].label);
      },
      "field label translation ID" : function (form) {
        assert.strictEqual(form.skel.fields[0].label().toString(), "field");
      }
    },
    "From errors checking" : {
      "duplicate ids" : function() {
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "field1", "text" ],
                                               [ "field1", "text" ]);
                                 },
                      Error);
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "field1", "radio", null, "s1", "s1" ]);
                                 },
                      Error);
      },
      "non-string ids" : function() {
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ 1, "text" ]);
                                 },
                      Error);
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "field1", "select", null, 1 ]);
                                 },
                      Error);
      },
      "wrong attributes type" : function() {
        assert.throws(function() { new fg.Form("TForm", null, "text",
                                               [ "field1", "text" ]);
                                 },
                      Error);
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "field1", "text", "text"]);
                                 },
                      Error);
      },
      "wrong field type" : function() {
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "test", null,
                                                 [ "field1", "text"]]);
                                 },
                      Error);
        assert.throws(function() { new fg.Form("TForm", null, null,
                                               [ "field1", "test"]);
                                 },
                      Error);
      },
      "select sub optgroups" : function() {
        assert.throws(function() { new fg.Form("TForm", null, "text",
                                               [ "field1", "select", null,
                                                 [ "grp1", null, "s1" [ "grp2", null, "s2" ] ] ]);
                                 },
                      Error);
      }
    },
  })
  .export(module);