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
		$canvas.prop("width", $parent.width());
		$canvas.prop("height", $parent.height());
	},

	_showGrid = function($canvas) {
		var cw = $canvas.prop("width");		// Canvas Width
		var ch = $canvas.prop("height");	// Canvas Height
		var gapH = settings.gridHGap;		// Horizontal gap
		var gapV = settings.gridVGap;		// Horizontal gap
		var canvas = $canvas.get(0);

		(function drawGrid(canvas, startX, startY, endX, endY, gapH, gapV, lineColor, bgRgba){

			var ctx = canvas.getContext("2d");

			// Set an overlay to make contrast for the line
			ctx.fillStyle = "rgba(" + bgRgba + ")";
			ctx.fillRect(0,0,canvas.width,canvas.height);

			ctx.beginPath();
			// Draw horizontal lines
			for (var y = 0; y <= ch; y += gapH) {
				ctx.moveTo(0, y);
				ctx.lineTo(cw, y);
			}
			// Draw vertical lines
			for (var x = 0; x <= cw; x += gapV) {
				ctx.moveTo(x, 0);
				ctx.lineTo(x, ch);
			}

			ctx.strokeStyle = "rgba(255,255,255,1)";
			ctx.stroke();
			ctx.closePath();

		})(canvas, 0, 0, cw, ch, gapH, gapV, "#ffffff", "0,0,0,0.2");
	},

	_hideGrid = function($canvas) {
		_clearCanvas($canvas);
	},

	_redrawGrid = function($canvas) {
		_clearCanvas($canvas);
		_showGrid($canvas);
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

			// Only redraw grid if grid is already shown
			if(!!options.redrawGrid && settings.showGrid) {
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