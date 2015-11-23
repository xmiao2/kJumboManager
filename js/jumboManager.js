/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManager = (function($){

	var
	// JSON keys
	ID = "Id",
	JUMBOS = "jumbos",
	JUMBO = "jumbo",

	// Class names
	IMAGE_CONTAINER = "image-container",
	PREVIEW_IMAGE_CONTAINER = "preview-image-container",
	CANVAS_IMAGE_CONTAINER = "canvas-image-container",
	CURRENT_JUMBO = "current-jumbo",

	// Instance variables
	settings = {},
	ui = {},
	jumbos = [],

	// Defaults
	defaultOptions = {
		canvasId: "jumbomanager-canvas",
		previewsId: "jumbomanager-previews",
		controlsId: "jumbomanager-controls",
		mainCanvasId: "jumbomanager-main-canvas",
		gridToggleId: "jumbomanager-grid-toggle",
		gridVGapId: "jumbomanager-grid-vgap",
		gridHGapId: "jumbomanager-grid-hgap"
	},

	// Inner classes
	Jumbos = (function() {

		var INIT_RENDER_IDX = 0,
		_ui = {},
		_objects = [],
		_current = {},

		validate = function() {
			return _objects && !!_objects.length;
		},

		loadJumbos = function() {
			var dfd = $.Deferred();

			$.when(jumboManagerREST.ajaxFetchJumbos()).done(function(data){
				$.each(data, function(idx, jumboJson){
					_objects.push(Jumbo.create(jumboJson));
				});
				dfd.resolve();
			}).fail(function(){
				dfd.reject("Jumbos fetching ajax failed");
			});

			return dfd.promise();
		},

		initRenderCanvasImage = function() {
			_objects[INIT_RENDER_IDX].renderFocusImage();
		},

		renderPreviewImages = function() {				
			$.each(_objects, function(idx, jumbo){
				jumbo.renderPreviewImage();
			});
		};
		
		return {
			getJumbos: function() {
				return _objects;
			},

			setJumbos: function(jumbos) {
				_objects = jumbos;
			},

			init: function(ui) {
				_ui = ui;

				var dfd = $.Deferred(),
				promises = [
					loadJumbos()
				];

				$.when.apply(this, promises).done(function(){
					if(validate()) {
						renderPreviewImages();
						initRenderCanvasImage();
						dfd.resolve();
					} else {
						dfd.reject("Failed to validate jumbos");
					}
				}).fail(function(msg){
					dfd.reject(msg);
				});

				return dfd.promise();
			}
		}
	})(),

	Jumbo = (function() {
		var _ui = {};
		return {
			create: function(jumboJson) {
				var imageUrl = jumboJson.image,	//replace this after finalizing json structure
				
				_focusPreviewImage = function() {
					$("."+CURRENT_JUMBO).removeClass(CURRENT_JUMBO);
					$dom.addClass(CURRENT_JUMBO);
				},

				_renderCanvasImage = function() {
					// Remove existing image
					_ui.$canvas.find("."+IMAGE_CONTAINER).remove();
					_ui.$canvas
						.append(
							getImageContainer(imageUrl)
								.addClass(CANVAS_IMAGE_CONTAINER)
						)
					;
				},

				_renderFocusImage = function() {
					_renderCanvasImage();
					_focusPreviewImage();
				},

				$dom = getImageContainer(imageUrl)
					.addClass(PREVIEW_IMAGE_CONTAINER)
					// .data(JUMBO, jumbo)
					.on("click probe", function(event){
						event.stopPropagation();
						event.preventDefault();
						_renderFocusImage();
					})
				;
				return {
					getImageUrl: function() {
						return imageUrl;
					},

					renderFocusImage: function() {
						return _renderFocusImage();
					},
					
					renderPreviewImage: function() {
						_ui.$previews.append($dom);
					}
				}
			},
			init: function(ui) {
				_ui = ui;
				return $.Deferred().resolve().promise();
			}
		}
	})(),
	
	// Private Methods	
	initSettings = function(options) {

		settings = $.extend({}, defaultOptions, options);

		(function initUi() {
			/* Convert Id to jQuery Elements */
			for(var key in settings) {
				if(key.endsWith(ID)) {
					var id = settings[key];
					var el = key.slice(0, key.indexOf(ID));
					ui["$"+el] = $("#"+id);
				}
			}
		})();
	},

	initMainCanvas = function() {
		ui.$mainCanvas.responsiveCanvas({
			showGrid: false
		});
	},

	initControls = function() {
		ui.$gridToggle
			.on("change", function(){
				var showGrid = $(this).prop("checked");
				ui.$mainCanvas.responsiveCanvas({showGrid: showGrid});
			})
		;

		ui.$gridHGap.slider({
			min: 5,
			max: 70,
			step: 5,
			value: $.responsiveCanvasDefaults.gridHGap,
			slide: function(event, _ui) {
				var gridHGap = _ui.value;
				ui.$mainCanvas.responsiveCanvas({gridHGap: gridHGap, redrawGrid: true});
			}
		}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
		ui.$gridVGap.slider({
			min: 5,
			max: 70,
			step: 5,
			value: $.responsiveCanvasDefaults.gridVGap,
			slide: function(event, _ui) {
				var gridVGap = _ui.value;
				ui.$mainCanvas.responsiveCanvas({gridVGap: gridVGap, redrawGrid: true});
			}
		}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
	},

	validateUi = function() {
		if (!ui || $.isEmptyObject(ui)) {
			return false;
		}
		for(var key in ui) {
			var $el = ui[key];
			if(!$el || $el.length === 0) {
				console.log("jQuery failed to load " + key);
				return false;
			}
		}
		return true;
	},

	getImageContainer = function(imageUrl) {
		return $("<div></div>")
			.addClass(IMAGE_CONTAINER)
			.append($("<img></img>")
				.prop("src", imageUrl)
			)
	};

	// Public scope
	return {
		getSettings: function() {
			return settings;
		},
		getUi: function() {
			return ui;
		},
		getJumbos: function() {
			return jumbos;
		},
		init: function(options) {
			globalDisableSelection();
			initSettings(options);
			if(validateUi()) {

				initMainCanvas();
				initControls();

				$.when(Jumbos.init(ui), Jumbo.init(ui)).done(function(){
					
				}).fail(function(msg){
					alert("Failed because: " + msg);
				});

			} else {
				//log ui initialization error
				alert("Ui Error");
			}
		}
	}
})(jQuery);

$(function(){
	//TODO Log set popup
	jumboManager.init();
});