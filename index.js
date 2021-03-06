var Draggy = require('draggy'),
	extend = require('extend'),
	classes = require('classes'),
	events = require('events'),
	Emitter = require('emitter'),
	template = require('./templates/template.html');

module.exports = UIInputSlider;

var doc = document;
var defaults = {
	min: 0,
	max: 100,
	handle: '.ui-input-slider-handle',
	sliderArea: '.ui-input-slider-area',
	input: '.ui-input-slider-input',
	fill: '.ui-input-slider-fill',
	theme: '',
	draggy: {
		restrictY: true,
		bindTo: '.ui-input-slider-area'
	}
};


/**
 * @class UIInputSlider
 * Input slider
 *
 * @constructor
 * Creates a new Input Slider instance.
 * @param {HTMLElement} [el] The input HTML element.
 * @param {Object} [opts] Configuration object.
 */
function UIInputSlider(el, opts) {
	var self = this;
	this.el = el;
	this.opts = extend({}, defaults, opts);
	this.opts.draggy = extend({}, defaults.draggy, opts && opts.draggy || {});

	this.opts.draggy.onChange = function(x, y) { self.onChange(x, y) };

	this.init();
}


var fn = UIInputSlider.prototype;
Emitter(fn);

fn.init = function() {
	var val;

	this.handle = this.el.querySelector(this.opts.handle);
	this.area = this.el.querySelector(this.opts.sliderArea);
	this.input = this.el.querySelector(this.opts.input);
	this.fill = this.el.querySelector(this.opts.fill);

	if (!this.handle || !this.area) {
		// throw new Error('handle or sliderArea are required');
		return this;
	}

	this.handleWidth = parseInt(this.handle.offsetWidth, 10);

	classes(this.el).add('ui-theme-' + this.opts.theme);
	this.draggy = new Draggy(this.handle, this.opts.draggy);
	this.prevLimitX = this.draggy.ele.limitsX[1];

	this.events();

	if ((val = this.val()) > 0) {
		this.val(val);
	}

	return this;
};

fn.events = function() {
	this.windowEvents = events(window, this);
	this.windowEvents.bind('resize', 'onResize');

	this.inputEvents = events(this.input, this);
	this.inputEvents.bind('keyup', 'onInputChange');

	return this;
};

fn.unbind = function() {
	this.windowEvents.unbind('resize', 'onResize');
	this.inputEvents.unbind('keyup', 'onInputChange');
	return this;
};

fn.onResize = function(e) {
	this.draggy.bind(this.draggy.bindTo);
	this.reposition();
	this.emit('resize', this);
};

fn.onChange = function(x, y) {
	this.percent = this.getPercent(x);
	this.setFillTo(x, y);
	this.setInputVal(this.percent);
	this.emit('change', x, y, this.percent);
};

fn.getPercent = function(x, y) {
	var d = (parseInt(this.area.offsetWidth, 10) - this.handleWidth) / this.opts.max;
    return parseFloat(x / d, 2);
};

fn.setInputVal = function(value) {
	this.input.value = Math.round(value);
	return this;
};

fn.val = function(val) {
	if (typeof val === 'undefined') {
		val = Math.max(this.opts.min, Math.min(parseFloat(this.input.value), this.opts.max));
		return val;
	}

	val = Math.max(0, Math.min(val, this.opts.max));
	var posX = (parseInt(this.area.offsetWidth - this.handleWidth, 10) * val) / this.opts.max;
	this.draggy.moveTo(posX, 0);
	this.onChange(posX, 0);
	return this;
};

fn.reposition = function() {
	var limitX = this.draggy.ele.limitsX[1];
	var posX = (limitX * this.draggy.position[0]) / this.prevLimitX;
	this.draggy.setTo(posX, 0);

	this.prevLimitX = limitX;
	return this;
};

fn.setFillTo = function(x, y) {
	var d = this.opts.max / 100;
	this.fill.style.width = (this.percent / d) + '%';
	return this;
};

fn.onInputChange = function(e) {
	this.val(this.val());
};

fn.destroy = fn.unbind;
