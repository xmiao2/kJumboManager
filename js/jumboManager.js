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
	CURRENT_VISIBLE_PREVIEW = "current-visible-preview",
	TABLET_RANGE_BACKGROUND = "tablet-range-background",
	MOBILE_RANGE_BACKGROUND = "mobile-range-background",
	DESKTOP_RANGE_BACKGROUND = "desktop-range-background",

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
		prevSlideId: "jumbomanager-prevSlide",
		nextSlideId: "jumbomanager-nextSlide",
		responsiveWidthsId: "jumbomanager-responsive-widths",
		maxPreviewCount: 10,	// This values should be a even number, or else be reduced to a even number
		minPreviewContainerWidth: 70,
		maxBgHeight: 400
	},

	// Inner classes
	Jumbos = (function() {

		var INIT_RENDER_IDX = 0,
		_ui = {},
		_objects = [],
		_currentJumbo = {},

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

		_renderFirstJumbo = function() {
			_objects[INIT_RENDER_IDX].renderFocusImage();
		},

		_getCurrentJumboIndex = function() {
			return _objects.indexOf(_currentJumbo);
		},

		_validateSlideOperation = function() {
			if(_getCurrentJumboIndex() < 0) {
				console.log("Invalid operation: currentJumbo does not exist.");
				return false;
			}
			if(_objects.length <= 1) {
				console.log("Invalid operation: not enough jumbos to traverse");
				return false;
			}
			return true;
		},

		_renderNextJumbo = function() {
			if(!_validateSlideOperation()) {
				return;
			}
			var nextIndex = _getCurrentJumboIndex() + 1;
			if(nextIndex >= _objects.length) {
				nextIndex = 0;
			}
			_objects[nextIndex].renderFocusImage();
		},

		_renderPrevJumbo = function() {
			if(!_validateSlideOperation()) {
				return;
			}
			var prevIndex = _getCurrentJumboIndex() - 1;
			if(prevIndex < 0) {
				prevIndex = _objects.length - 1;
			}
			_objects[prevIndex].renderFocusImage();
		},

		initRenderBackgroundImage = function() {
			_renderFirstJumbo();
		},

		initRenderPreviewImages = function() {				
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

			setCurrentJumbo: function(jumbo) {
				_currentJumbo = jumbo;
			},

			getCurrentJumbo: function(jumbo) {
				return _currentJumbo;
			},

			renderNextJumbo: function() {
				return _renderNextJumbo();
			},

			renderPrevJumbo: function() {
				return _renderPrevJumbo();
			},

			init: function(ui) {
				_ui = ui;

				var dfd = $.Deferred(),
				promises = [
					loadJumbos()
				];

				$.when.apply(this, promises).done(function(){
					if(validate()) {
						initRenderPreviewImages();
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
		var _ui = {};
		return {
			create: function(jumboJson) {
				var imageUrl = jumboJson.image.url,	//replace this after finalizing json structure
				
				bgColor = jumboJson.image.bgColor,

				_focusPreviewImage = function() {
					$("."+CURRENT_JUMBO).removeClass(CURRENT_JUMBO);
					$dom.addClass(CURRENT_JUMBO);
				},

				_renderBackgroundImage = function() {
					_ui.$background
						.html(
							getImageContainer(imageUrl)
								.addClass(CANVAS_IMAGE_CONTAINER)
								.css("background-color", bgColor)
						)
						.find("img")
							.css("maxHeight",settings.maxBgHeight)
					;
				},

				_renderFocusImage = function() {
					Jumbos.setCurrentJumbo(this);
					_renderBackgroundImage();
					_renderControls();
					_focusPreviewImage();
					_ui.$mainCanvas.responsiveCanvas({redrawGrid: true, resize: true});
				},

				_renderControls = function() {
					// Background color
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
								bgColor = color.toRgbString();
							}
						})
					;

					//Responsive Widths
					_ui.$responsiveWidths
						.slider({
							range: true,
							step: 100,
							min: 300,
							max: 1200,
							values: [600, 900],
							create: function(event, ui) {

								var $mobileHandle = $(this).children(".ui-slider-handle").eq(0),
								$tabletHandle = $(this).children(".ui-slider-handle").eq(1),
								left = $mobileHandle.css("left"),
								right = $tabletHandle.css("left"),
								_tooltipPosition = {
									my: "center bottom-10",
									at: "center top"
								};
				
								// Create two backgrounds besides jQuery UI's existing range background
								$(this).children(".ui-slider-range")
									.addClass(TABLET_RANGE_BACKGROUND)
									.prop("title","tablet")
									.tooltip({position: _tooltipPosition})
								;

								$(this)
									.append($("<div></div>")
										.addClass("ui-slider-range")
										.addClass("ui-widget-header")
										.addClass("ui-corner-all")
										.addClass(MOBILE_RANGE_BACKGROUND)
										.prop("title","mobile")
										.tooltip({position: _tooltipPosition})
										.css("left", 0)
										.css("width", left)
									)
									.append($("<div></div>")
										.addClass("ui-slider-range")
										.addClass("ui-widget-header")
										.addClass(DESKTOP_RANGE_BACKGROUND)
										.prop("title","desktop")
										.tooltip({position: _tooltipPosition})
										.addClass("ui-corner-all")
										.css("left", right)
										.css("right", 0)
									)
								;
							},
							slide: function(event, ui) {
								// Setting timeout because jquery ui renders range background
								// AFTER the slide event. This is an easy but hacky way to handle
								// API limitation, but I'll let it.. slide (see what I did there? :D)
								// since it's purely aesthetic. If anything goes wrong in this tick,
								// (ex: jQuery UI hanged and couldn't set ui-slider-range's width
								// in 10 milliseconds), it will re-adjust itself on the next slide
								// event
								setTimeout(function(){
									// Update second slider range background
									var $mobileHandle = $(this).children(".ui-slider-handle").eq(0),
									$tabletHandle = $(this).children(".ui-slider-handle").eq(1),
									left = $mobileHandle.css("left"),
									right = $tabletHandle.css("left");

									$(this).find("."+MOBILE_RANGE_BACKGROUND)
										.css("width", left)
									;

									$(this).find("."+DESKTOP_RANGE_BACKGROUND)
										.css("left", right)
									;
								}.bind(this), 10);
							}
						})
						.slider("pips", {rest: "label"});
						// .slider("float", {suffix: "px"});
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
				max: 700,
				step: 50,
				value: options.initBgMaxHeight,
				slide: function(event, _ui) {
					var bgMaxHeight = _ui.value;
					settings.maxBgHeight = bgMaxHeight;
					Jumbos.getCurrentJumbo().renderFocusImage();
				}
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
			
		})({
			initBgMaxHeight: options.initBgMaxHeight
		});

		(function initSlideControls(options) {
			ui.$prevSlide.on("click", function(){
				Jumbos.renderPrevJumbo();
			});

			ui.$nextSlide.on("click", function(){
				Jumbos.renderNextJumbo();
			});
		})();

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