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
	CANVAS_IMAGE_CONTAINER = "canvas-image-container",
	CURRENT_JUMBO = "current-jumbo",
	CURRENT_VISIBLE_PREVIEW = "current_visible_preview",

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
		backgroundId: "jumbomanager-background",
		gridToggleId: "jumbomanager-grid-toggle",
		gridVGapId: "jumbomanager-grid-vgap",
		gridHGapId: "jumbomanager-grid-hgap",
		slideBgColorId: "jumbomanager-slide-bg-color",
		bgMaxHeightId: "jumbomanager-bg-max-height",
		maxPreviewCount: 10,	// This values should be a even number, or else be reduced to a even number
		minPreviewContainerWidth: 70,
		maxBgHeight: 400
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

		initRenderBackgroundImage = function() {
			_objects[INIT_RENDER_IDX].renderFocusImage();
		},

		renderPreviewImages = function() {				
			$.each(_objects, function(idx, jumbo){
				jumbo.renderPreviewImage.apply(jumbo, null);
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
						initRenderBackgroundImage();
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
		var _ui = {},
		_currentJumbo = {};
		return {
			create: function(jumboJson) {
				var imageUrl = jumboJson.image.url,	//replace this after finalizing json structure
				
				bgColor = jumboJson.image.bgColor,

				_setAsCurrentJumbo = function() {
					_currentJumbo = this;
				},

				_focusPreviewImage = function() {
					$("."+CURRENT_JUMBO).removeClass(CURRENT_JUMBO);
					$dom.addClass(CURRENT_JUMBO);
				},

				_renderBackgroundImage = function() {
					_ui.$background
						.html(
							getImageContainer(imageUrl)
								.addClass(CANVAS_IMAGE_CONTAINER)
						)
						.find("img")
							.css("maxHeight",settings.maxBgHeight)
					;
				},

				_renderFocusImage = function() {
					_renderBackgroundImage();
					_renderControls();
					_focusPreviewImage();
					_setAsCurrentJumbo.apply(this, arguments);
				},

				_renderControls = function() {
					_ui.$slideBgColor
						.spectrum({
							color: bgColor,
							showAlpha: true,
							showInput: true,
							allowEmpty:true,
							showPalette: true,
							preferredFormat: "hex",
							move: function(color) {
								_ui.$background.find("."+IMAGE_CONTAINER)
									.css("background-color", color.toRgbString())
								;
							}
						})
					;
				},

				$dom = getImageContainer(imageUrl);
				return {
					getImageUrl: function() {
						return imageUrl;
					},

					renderFocusImage: function() {
						return _renderFocusImage.apply(this, arguments);
					},
					
					renderBackgroundImage: function() {
						return _renderBackgroundImage.apply(this, arguments);
					},

					renderPreviewImage: function() {
						var self = this;
						_ui.$previews
							.append(
								$dom
									.off("click")
									.on("click", function(){
										event.stopPropagation();
										event.preventDefault();
										self.renderFocusImage();
									})
							)
						;
					}
				}
			},

			getCurrentJumbo: function() {
				return _currentJumbo;
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

	initControls = function(options) {
		(function initGeneralControls(options){
			ui.$bgMaxHeight.slider({
				min: 50,
				max: 600,
				step: 50,
				value: options.initBgMaxHeight,
				slide: function(event, _ui) {
					var bgMaxHeight = _ui.value;
					//TODO get current jumbo and update its max height
					settings.maxBgHeight = bgMaxHeight;
					Jumbo.getCurrentJumbo().renderFocusImage();
				}
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
			
		})({
			initBgMaxHeight: options.initBgMaxHeight
		});

		(function initGridControls(options) {
			ui.$mainCanvas.responsiveCanvas({
				showGrid: options.initShowGrid,
				gridHGap: options.initGridHGap,
				gridVGap: options.initGridVGap
			});

			ui.$gridToggle
				.on("change", function(){
					var showGrid = $(this).prop("checked");
					ui.$mainCanvas.responsiveCanvas({showGrid: showGrid});
				})
				.prop("checked", options.initShowGrid)
			;

			ui.$gridHGap.slider({
				min: 5,
				max: 70,
				step: 5,
				value: options.initGridHGap,
				slide: function(event, _ui) {
					var gridHGap = _ui.value;
					ui.$mainCanvas.responsiveCanvas({gridHGap: gridHGap, redrawGrid: true});
				}
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
			
			ui.$gridVGap.slider({
				min: 5,
				max: 70,
				step: 5,
				value: options.initGridVGap,
				slide: function(event, _ui) {
					var gridVGap = _ui.value;
					ui.$mainCanvas.responsiveCanvas({gridVGap: gridVGap, redrawGrid: true});
				}
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
		
		})({
			initShowGrid: options.initShowGrid,
			initGridHGap: options.initGridHGap || $.responsiveCanvasDefaults.gridHGap,
			initGridVGap: options.initGridVGap || $.responsiveCanvasDefaults.gridVGap
		});
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

	initPreviewPagination = function() {

		var initResponsivePreview = function() {
			var previewsContainerWidth = ui.$previews.width(),
			previewCount = settings.maxPreviewCount % 2 === 0 ?
				settings.maxPreviewCount : settings.maxPreviewCount - 1,	// Reduce to even
			previewContainerWidth = (100 / previewCount) + "%";
			while(previewsContainerWidth / previewCount < settings.minPreviewContainerWidth) {
				previewCount -= 1;
				previewContainerWidth = (100 / previewCount) + "%";
			}

			ui.$previews.children("."+IMAGE_CONTAINER)
				.width(previewContainerWidth)
				.removeClass(CURRENT_VISIBLE_PREVIEW)
				.slice(0, previewCount)
					.addClass(CURRENT_VISIBLE_PREVIEW)
			;
		};

		initResponsivePreview();
		$(window).on("resize", initResponsivePreview);

		// Temps
		ui.$previews.sortable({
			tolerance: "pointer",
			opacity: 0.5,
			containment: "parent",
			delay: 150,
			start: function(event, ui) {
				ui.placeholder.width(ui.helper.width());
			}
		});	
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
				initControls({
					initShowGrid: true,
					initGridHGap: 50,
					initGridVGap: 50,
					initBgMaxHeight: settings.maxBgHeight
				});

				$.when(Jumbos.init(ui), Jumbo.init(ui)).done(function(){
					initPreviewPagination();
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