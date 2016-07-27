/*
 *  jquery-rowtool - v0.0.1
 *  jQuery plugin for dynamically adding rows to a table based on a qty input.
 *  http://vonex-labs.github.io/jquery-rowtool
 *
 *  Made by Vonex Telecom (https://www.vonex.com.au)
 *  Under MIT License
 */
/* jshint quotmark: false, unused: false */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "rowTool",
        defaults = {
            qtyInput: null,
            limitQty: null,
            minQty: null,
            maxQty: null,
            hideOnNone: null,
            template: null,
            htmlTemplate: null,
            updateTemplate: null,
            groupName: null,
            inputBoxes: [],
            inputBoxReady: null,
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Make sure that a template has been defined.
            if (this.settings.template === null) {
                $.error('You need to define a template for new rows.');
            }

            // Set up the HTML template
            this.setupHtmlTemplate(this, this.settings.template);

            // Has the plugin been set to limit qty's manually, or will we pull the figures from the qty attr?
            if (this.settings.limitQty === null) {
                this.settings.limitQty = this.willLimitQty(this);
            }

            this.setupQtyLimit(this);
            //this.setupTable( "jQuery Boilerplate" );
        },
        setupHtmlTemplate: function (that, template) {
            if ($(template).length === 1) {
                var $rowTemplate = $($(template).html());
                that.settings.htmlTemplate = $rowTemplate;
            }
        },
        willLimitQty: function (that) {
            // Check if the qty input box has limits (min/max) attributes.
            var minQty = $(that.settings.qtyInput).attr("min");
            var maxQty = $(that.settings.qtyInput).attr("max");

            if (!(minQty === undefined && maxQty === undefined)) {
                that.settings.minQty = minQty;
                that.settings.maxQty = maxQty;

                $(that.element).data("numberOfLines", $(that.element).find("tbody").find("tr").length);

                return true;
            }

            return false;
        },
        setupQtyLimit: function (that) {
            if (that.settings.limitQty === true) {
                $(that.settings.qtyInput).change(function () {
                    var value = parseInt($(this).val());

                    var min = that.settings.minQty;
                    var max = that.settings.maxQty;

                    if (value < min) {
                        value = min;
                        $(this).val(min);
                    } else if (value > max) {
                        value = max;
                        $(this).val(max);
                    }

                    that.updateNumberOfLinesInTable(that, value);
                });
            }
        },
        updateNumberOfLinesInTable: function (that, newQty) {
            var $infoTable = $(that.element);
            var $lines = $infoTable.data("numberOfLines");

            if ($lines < newQty) {
                var $lineTemplate = that.settings.htmlTemplate.clone();

                for (var i = $lines + 1; i < newQty + 1; i++) {
                    var $newLine = that.makeFromTemplate(that, $lineTemplate, i);

                    $infoTable.find("tbody").append($newLine);

                    if (that.settings.updateTemplate !== null) {
                        $newLine = that.settings.updateTemplate.call(that.element, $newLine);
                    }
                }
            } else {
                for (var x = newQty + 1; x < $lines + 1; x++) {
                    $infoTable.find("tbody tr[data-row-number=\"" + x + "\"]").remove();
                }
            }

            $infoTable.data("numberOfLines", newQty);
        },
        makeFromTemplate: function(that, $line, $number) {
            $line = $line.clone();

            if (that.settings.groupName !== null) {
                var selectBoxes = that.settings.inputBoxes;

                $line.attr('class', 'isdn');
                $line.attr("data-row-number", $number);

                var $lineNumber;
                if (($lineNumber = that.settings.qtyRow) !== null) {
                    $line.find($lineNumber).html($number);
                }

                var boxReady = that.settings.inputBoxReady;
                var runBoxReady = (typeof that.settings.inputBoxReady === "object" && that.settings.inputBoxReady !== null);

                selectBoxes.forEach(function (element, index) {
                    var templateName = 'name="' + that.settings.groupName + '[][' + element + ']"';
                    var correctName = that.settings.groupName + '[' + $number + '][' + element + ']';

                    var $input = $line.find('input[' + templateName + ']');
                    $line.find('input[' + templateName + ']').attr('name', correctName);

                    if (runBoxReady) {
                        if (element in boxReady && boxReady[element] instanceof Function) {
                            boxReady[element].call(that.element, $input, $line);
                        }
                    }
                });
            }

            return $line;
        },
        setupTable: function (text) {
            // some logic
            $(this.element).text(text);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
