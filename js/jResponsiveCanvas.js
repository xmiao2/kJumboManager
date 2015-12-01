/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

(function($){

	var RESIZE_LISTENER = "responsive-canvas-resize-listener",
	settings = {},
	defaults = {

		// Actions, values of these don't matter
		resize: true,
		redrawGrid: true,

		// Settings
		showGrid: true,
		gridHGap: 20,
		gridVGap: 20,

		// Event listeners
		onResize: $.noop
	},

	_resize = function($canvas, $parent) {
		$canvas.prop("width", $parent.innerWidth());
		$canvas.prop("height", $parent.innerHeight());
	},

	_showGrid = function($canvas) {
		// var cw = $canvas.prop("width");		// Canvas Width
		// var ch = $canvas.prop("height");	// Canvas Height
		var gapH = settings.gridHGap;		// Horizontal gap
		var gapV = settings.gridVGap;		// Horizontal gap
		var canvas = $canvas.get(0);

		(function drawGrid(canvas, gapH, gapV, lineColor, originLineColor, bgRgba){

			var ctx = canvas.getContext("2d"),
			cw = canvas.width,
			ch = canvas.height;

			// Set an overlay to make contrast for the line
			ctx.fillStyle = "rgba(" + bgRgba + ")";
			ctx.fillRect(0, 0, cw, ch);

			ctx.beginPath();

			// Vertical grid lines
			for (var x = gapH; x <= cw / 2; x += gapH) {
				ctx.moveTo(cw/2 - x, 0);
				ctx.lineTo(cw/2 - x, ch);
				ctx.moveTo(cw/2 + x, 0);
				ctx.lineTo(cw/2 + x, ch);
			}

			// Horizontal grid lines
			for (var y = gapV; y <= ch / 2; y += gapV) {
				ctx.moveTo(0, ch/2 - y);
				ctx.lineTo(cw, ch/2 - y);
				ctx.moveTo(0, ch/2 + y);
				ctx.lineTo(cw, ch/2 + y);
			}

			ctx.strokeStyle = lineColor;
			ctx.stroke();
			ctx.closePath();

			// Draw origin lines
			ctx.beginPath();

			ctx.moveTo(cw/2, 0);
			ctx.lineTo(cw/2, ch);

			ctx.moveTo(0, ch/2);
			ctx.lineTo(cw, ch/2);

			ctx.strokeStyle = originLineColor;
			ctx.stroke();
			ctx.closePath();

		})(canvas, gapH, gapV, "white", "red", "0,0,0,0.2");
	},

	_hideGrid = function($canvas) {
		_clearCanvas($canvas);
	},

	_redrawGrid = function($canvas) {
		if(settings.showGrid) {
			_clearCanvas($canvas);
			_showGrid($canvas);
		}
	},

	_clearCanvas = function($canvas) {
		var canvas = $canvas.get(0);
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);
	},

	_onResize = function(event) {
		var $canvas = event.data.$canvas;
		var $parent = event.data.$parent;
		var onResize = event.data.onResize;

		_resize($canvas, $parent);
		_redrawGrid($canvas);
		onResize(event);
	};

	$.fn.responsiveCanvas = function(options) {

		var $canvas = $(this),
		$parent = $canvas.parent();
		settings = $.extend({}, defaults, settings, options);

		// Resize canvas on command
		if(options) {
			if(!!options.resize) {
				_resize($canvas, $parent);
			}

			if(!!options.redrawGrid) {
				_redrawGrid($canvas);
			}

			// Show grid on command
			if(typeof options.showGrid === "boolean") {
				if(options.showGrid) {
					_showGrid($canvas);
				} else {
					_hideGrid($canvas);
				}
			}
		}

		// Reize on reload
		if(!this.data(RESIZE_LISTENER)) {
			_resize($canvas, $parent);
			var windowResizeListener = $(window).resize({
				$canvas: $canvas,
				$parent: $parent, 
				onResize: settings.onResize
			}, _onResize);
			this.data(RESIZE_LISTENER, windowResizeListener);
		}

		return this;
	}

	$.responsiveCanvasDefaults = defaults;

})(jQuery);