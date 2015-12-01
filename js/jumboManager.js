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
	OVERLAY_BUTTON = "overlay-button",
	OVERLAY_BUTTON_PRIMARY = "overlay-button-primary",

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
		previewId: "jumbomanager-preview",
		gridToggleId: "jumbomanager-grid-toggle",
		gridVGapId: "jumbomanager-grid-vgap",
		gridHGapId: "jumbomanager-grid-hgap",
		slideBgColorId: "jumbomanager-slide-bg-color",
		bgMaxHeightId: "jumbomanager-bg-max-height",
		prevSlideId: "jumbomanager-prevSlide",
		nextSlideId: "jumbomanager-nextSlide",
		responsiveWidthsId: "jumbomanager-responsive-widths",
		applyAllWidthId: "jumbomanager-apply-all-responsive-widths",
		desktopImageSrcId: "jumbomanager-desktop-image-src",
		tabletImageSrcId: "jumbomanager-tablet-image-src",
		mobileImageSrcId: "jumbomanager-mobile-image-src",
		desktopImageUploadId: "jumbomanager-desktop-image-upload",
		tabletImageUploadId: "jumbomanager-tablet-image-upload",
		mobileImageUploadId: "jumbomanager-mobile-image-upload",

		responsiveSliderId: "jumbomanager-responsive-slider",
		overlayId: "jumbomanager-overlay",

		buttonsId: "jumbomanager-buttons",
		buttonContentId: "jumbomanager-button-content",
		buttonDHAlignId: "jumbomanager-button-d-halign",
		buttonDVAlignId: "jumbomanager-button-d-valign",
		buttonDVGapId: "jumbomanager-button-d-vgap",
		buttonDMinWidthId: "jumbomanager-button-d-minWidth",
		buttonDFontSizeId: "jumbomanager-button-d-fontsize",

		buttonPrimaryTextId: "jumbomanager-button-primary-text",
		buttonPrimaryUrlId: "jumbomanager-button-primary-url",
		buttonPrimaryColorId: "jumbomanager-button-primary-color",
		buttonPrimaryBgColorId: "jumbomanager-button-primary-bgcolor",
		buttonSecondaryTextId: "jumbomanager-button-secondary-text",
		buttonSecondaryUrlId: "jumbomanager-button-secondary-url",
		buttonSecondaryColorId: "jumbomanager-button-secondary-color",
		buttonSecondaryBgColorId: "jumbomanager-button-secondary-bgcolor",

		labelsId: "jumbomanager-labels",

		imageNotFoundUrl: "img/image_not_found.jpg",
		maxPreviewCount: 10,	// This values should be a even number, or else be reduced to a even number
		minPreviewContainerWidth: 70,
		maxBgHeight: 400,
		buttonVPadding: "0.5rem"
	},

	MOBILE_VALUE_INDEX = 0,
	TABLET_VALUE_INDEX = 1,

	PRIMARY_BUTTON_INDEX = 0,
	SECONDARY_BUTTON_INDEX = 1,

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

		_applyAllWidths = function(widths) {
			var mobileWidth = widths[MOBILE_VALUE_INDEX],
			tabletWidth = widths[TABLET_VALUE_INDEX];

			$.each(_objects, function(idx, jumbo){
				jumbo.setMobileWidth(mobileWidth);
				jumbo.setTabletWidth(tabletWidth);
			});
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

			applyAllWidths: function(widths) {
				return _applyAllWidths(widths);
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
				var desktopImageUrl = jumboJson.image.desktopUrl || imageNotFoundUrl,	//replace this after finalizing json structure
				tabletImageUrl = jumboJson.image.tabletUrl || desktopImageUrl,	// tablet inherits desktop
				mobileImageUrl = jumboJson.image.mobileUrl || tabletImageUrl,	// mobile inherits tablet
				bgColor = jumboJson.image.bgColor,
				mobileWidth = jumboJson.image.mobileWidth,
				tabletWidth = jumboJson.image.tabletWidth,
				hAlign = jumboJson.button.hAlign,
				vAlign = jumboJson.button.vAlign,
				buttons = jumboJson.button.buttons,
				vGap = jumboJson.button.vGap,
				minWidth = jumboJson.button.minWidth,
				fontSize = jumboJson.button.fontSize,

				_focusPreviewImage = function() {
					$("."+CURRENT_JUMBO).removeClass(CURRENT_JUMBO);
					$dom.addClass(CURRENT_JUMBO);
				},

				_renderBackgroundImage = function() {

					var responsiveImageUrl,
					responsiveWidth = _ui.$background.width();

					if(responsiveWidth > tabletWidth) {
						responsiveImageUrl = desktopImageUrl;
					} else if(responsiveWidth > mobileWidth) {
						responsiveImageUrl = tabletImageUrl;
					} else {
						responsiveImageUrl = mobileImageUrl;
					}

					_ui.$background
						.html(
							getImageContainer(responsiveImageUrl, _renderOverlay)
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
					_renderButtons();
					_ui.$mainCanvas.responsiveCanvas({redrawGrid: true, resize: true});
				},

				_renderButtons = function() {

					_ui.$buttons
						.empty()
						.css({
							display: "inline-block",
							position: "absolute",
							left: hAlign,
							top: vAlign,
							transform: "translate(-" + hAlign + ", -" + vAlign + ")",
							minWidth: minWidth
						});

					$.each(buttons, function(idx, button){
						if(button.visible){
							_ui.$buttons
								.append($("<div></div>")
									.addClass(OVERLAY_BUTTON)
									.html(button.text)
									.css({
										"background-color": button.bgColor,
										"border-color": button.color,
										"color": button.color,
										"margin-top": vGap,
										"font-size": fontSize,
										"padding": settings.buttonVPadding + " 0"
									})
								)
							;

							if(idx === 0) {
								_ui.$buttons.find("."+OVERLAY_BUTTON)
									.addClass(OVERLAY_BUTTON_PRIMARY)
									.css({
										"margin-top": 0
									})
								;
							}
						}
					});
				},

				_renderOverlay = function() {
					_ui.$overlay.css({
						margin: "auto",
						width: _ui.$background.find("img").width()
					});
				},

				_renderButtonControls = function() {
					// Populate Button Content
					$(".display-for-primary, .display-for-all").hide();
					if(buttons[PRIMARY_BUTTON_INDEX].visible && buttons[SECONDARY_BUTTON_INDEX].visible) {
						_ui.$buttonContent.selectpicker("val", "all");
						$(".display-for-primary, .display-for-all").show();
					} else if(buttons[PRIMARY_BUTTON_INDEX].visible) {
						_ui.$buttonContent.selectpicker("val", "primary");
						$(".display-for-primary").show();
					} else {
						_ui.$buttonContent.selectpicker("val", "none");
					}

					// Populate desktop horizontal alignment
					_ui.$buttonDHAlign.slider({
						value: parseFloat(hAlign)
					});

					// Populate desktop vertical alignment
					_ui.$buttonDVAlign.slider({
						value: parseFloat(vAlign)
					});

					// Populate desktop vertical gap
					_ui.$buttonDVGap.slider({
						value: parseFloat(vGap)
					});

					// Populate desktop width
					_ui.$buttonDMinWidth.slider({
						value: parseFloat(minWidth)
					});

					// Populate desktop fontsize
					_ui.$buttonDFontSize.slider({
						value: parseFloat(fontSize)
					});

					_ui.$buttonPrimaryText.val(buttons[PRIMARY_BUTTON_INDEX].text);
					_ui.$buttonSecondaryText.val(buttons[SECONDARY_BUTTON_INDEX].text);
					_ui.$buttonPrimaryUrl.val(buttons[PRIMARY_BUTTON_INDEX].url);
					_ui.$buttonSecondaryUrl.val(buttons[SECONDARY_BUTTON_INDEX].url);

					// Populate color and background color
					var
					buttonSpectrumDefaults = {
						showAlpha: true,
						showInput: true,
						allowEmpty: true,
						showPalette: true,
						preferredFormat: "hex"
					},

					updateButtonBgColor = function(idx, color) {
						buttons[idx].bgColor = color.toRgbString();
					},

					updateButtonColor = function(idx, color) {
						buttons[idx].color = color.toRgbString();
					};

					_ui.$buttonPrimaryColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: buttons[PRIMARY_BUTTON_INDEX].color,
							move: function(color) {
								updateButtonColor(PRIMARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
					_ui.$buttonSecondaryColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: buttons[SECONDARY_BUTTON_INDEX].color,
							move: function(color) {
								updateButtonColor(SECONDARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
					_ui.$buttonPrimaryBgColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: buttons[PRIMARY_BUTTON_INDEX].bgColor,
							move: function(color) {
								updateButtonBgColor(PRIMARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
					_ui.$buttonSecondaryBgColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: buttons[SECONDARY_BUTTON_INDEX].bgColor,
							move: function(color) {
								updateButtonBgColor(SECONDARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
				},

				_renderControls = function() {

					// Populate background color picker value
					_ui.$slideBgColor
						.spectrum({
							color: bgColor,
							showAlpha: true,
							showInput: true,
							allowEmpty: true,
							showPalette: true,
							preferredFormat: "hex",
							move: function(color) {
								ui.$background.find("."+IMAGE_CONTAINER)
									.css("background-color", color.toRgbString())
								;
								Jumbos.getCurrentJumbo().setBgColor(color.toRgbString());
							}
						})
					;

					// Populate Responsive Widths slider values
					_ui.$responsiveWidths
						.slider({
							values: [mobileWidth, tabletWidth]
						})
					;

					// Populate Desktop Image Location
					_ui.$desktopImageSrc
						.val(desktopImageUrl)
					;

					// Populate Tablet Image Location
					_ui.$tabletImageSrc
						.val(tabletImageUrl)
					;

					// Populate Mobile Image Location
					_ui.$mobileImageSrc
						.val(mobileImageUrl)
					;

					_renderButtonControls();
				},

				_renderPreviewImage = function() {
					var self = this;
					_ui.$previews
						.append(
							$dom
								.off("click")
								.on("click", function(){
									_ui.$previews.focus();
									self.renderFocusImage();
								})
						)
					;
				},

				$dom = getImageContainer(desktopImageUrl);
				return {
					getImageUrl: function() {
						return desktopImageUrl;
					},

					getBgColor: function() {
						return bgColor;
					},

					setBgColor: function(rgba) {
						bgColor = rgba;
					},

					getMobileWidth: function() {
						return mobileWidth;
					},

					setMobileWidth: function(_mobileWidth) {
						mobileWidth = _mobileWidth;
					},

					getTabletWidth: function() {
						return tabletWidth;
					},

					setTabletWidth: function(_tabletWidth) {
						tabletWidth = _tabletWidth;
					},

					setButtonVisibility: function(idx, visible) {
						buttons[idx].visible = visible;
					},

					setButtonText: function(idx, text) {
						buttons[idx].text = text;
					},

					setButtonUrl: function(idx, url) {
						buttons[idx].url = url;
					},

					setButtonDHAlign: function(_DHAlign, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						hAlign = _DHAlign + unit;
					},

					setButtonDVAlign: function(_DVAlign, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						vAlign = _DVAlign + unit;
					},

					setButtonDVGap: function(_DVGap, unit) {
						unit = typeof unit !== 'undefined' ? unit : 'rem';
						vGap = _DVGap + unit;
					},

					setButtonDMinWidth: function(_DMinWidth, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						minWidth = _DMinWidth + unit;
					},

					setButtonDFontSize: function(_DFontSize, unit) {
						unit = typeof unit !== 'undefined' ? unit : 'rem';
						fontSize = _DFontSize + unit;
					},

					renderFocusImage: function() {
						return _renderFocusImage.apply(this, arguments);
					},

					renderButtons: function() {
						return _renderButtons.apply(this, arguments);
					},

					renderOverlay: function() {
						return _renderOverlay.apply(this, arguments);
					},

					renderButtonControls: function() {
						return _renderButtonControls.apply(this, arguments);
					},
					
					renderBackgroundImage: function() {
						return _renderBackgroundImage.apply(this, arguments);
					},

					renderPreviewImage: function() {
						return _renderPreviewImage.apply(this, arguments);
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

		$(window).resize(function(){
			Jumbos.getCurrentJumbo().renderFocusImage();
			initReponsiveSlider();
		});
	},

	initReponsiveSlider = function() {
		$(".letterbox").width(0);
		ui.$preview.width("100%");
		var canvasWidth = ui.$responsiveSlider.parent()[0].clientWidth;
		ui.$responsiveSlider.slider({
			min: 300,
			max: canvasWidth,
			step: 1,	// Setting this to 2 would resolve the jittering effect, which is caused by rounding
			value: canvasWidth,
			slide: function(event, _ui) {
				ui.$preview.width(_ui.value);
				$(".letterbox").width((canvasWidth - _ui.value) / 2);
				Jumbos.getCurrentJumbo().renderFocusImage();
			}
		}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
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
			
			//TODO tablet max height
			//TODO mobile max height
		})({
			initBgMaxHeight: options.initBgMaxHeight
		});

		(function initSlideControls(options) {

			var bindSlideKeys = function(event) {

				switch(event.which) {
					case 37: // left key
						Jumbos.renderPrevJumbo();
						break;
					case 39: // right key
						Jumbos.renderNextJumbo();
						break;
					default:
						return;
				}

				event.preventDefault();
			};

			ui.$canvas
				.prop("tabindex", "-1")
				.keydown(bindSlideKeys)
			;

			ui.$previews
				.prop("tabindex", "-1")
				.keydown(bindSlideKeys)
			;

			ui.$prevSlide.on("click", function(){
				Jumbos.renderPrevJumbo();
			});

			ui.$nextSlide.on("click", function(){
				Jumbos.renderNextJumbo();
			});
		})();

		(function initCurrentSlideControls(options) {

			// Background color
			// spectrum overrides existing options when re-initialized,
			// so the entire option rendering have to be done in Jumbo object's render method
			// Leaving this here without options so it doesn't display an un-rendered textbox
			// while page is waiting to fetch ajax response
			ui.$slideBgColor.spectrum();

			var
			// Responsive width private methods
			updateCustomRange = function(slider){
				// Update second slider range background
				var $mobileHandle = $(slider).children(".ui-slider-handle").eq(MOBILE_VALUE_INDEX),
				$tabletHandle = $(slider).children(".ui-slider-handle").eq(TABLET_VALUE_INDEX),
				left = $mobileHandle.css("left"),
				right = $tabletHandle.css("left");

				$(slider).find("."+MOBILE_RANGE_BACKGROUND)
					.css("width", left)
				;

				$(slider).find("."+DESKTOP_RANGE_BACKGROUND)
					.css("left", right)
				;
			},

			updateJumboWidthsBySlider = function(values) {
				Jumbos.getCurrentJumbo().setMobileWidth(values[MOBILE_VALUE_INDEX]);
				Jumbos.getCurrentJumbo().setTabletWidth(values[TABLET_VALUE_INDEX]);
			},

			setCustomRange = function(slider) {
				var $mobileHandle = $(slider).children(".ui-slider-handle").eq(MOBILE_VALUE_INDEX),
				$tabletHandle = $(slider).children(".ui-slider-handle").eq(TABLET_VALUE_INDEX),
				left = $mobileHandle.css("left"),
				right = $tabletHandle.css("left"),
				_tooltipPosition = {
					my: "center bottom-10",
					at: "center top"
				};

				// Create two backgrounds besides jQuery UI's existing range background
				$(slider).children(".ui-slider-range")
					.addClass(TABLET_RANGE_BACKGROUND)
					.prop("title","tablet")
					.tooltip({position: _tooltipPosition})
				;

				$(slider)
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
			};

			//Responsive Widths
			ui.$responsiveWidths
				.slider({
					range: true,
					step: 100,
					min: 300,
					max: 1200,
					values: [options.initMobileWidth, options.initTabletWidth],
					create: function(event, ui) {
						setCustomRange(this);
					},
					slide: function(event, ui) {
						// Setting timeout because jquery ui renders range background
						// AFTER the slide event. This is an easy but hacky way to handle
						// API limitation, but I'll let it.. slide (see what I did there? :D)
						// since it's purely aesthetic. If anything goes wrong in this tick,
						// (ex: jQuery UI hanged and couldn't set ui-slider-range's width
						// in 10 milliseconds), it will adjust itself in the change event below
						setTimeout(function(){
							updateCustomRange(this);
							Jumbos.getCurrentJumbo().renderFocusImage();
						}.bind(this), 10);
						updateJumboWidthsBySlider(ui.values);
					},
					change: function(event, ui) {
						updateCustomRange(this);
						updateJumboWidthsBySlider(ui.values);
					}
				})
				.slider("pips", {rest: "label"});
				// .slider("float", {suffix: "px"});
			;

			// Responsive Width responding to window resize
			$(window).resize(function(){
				updateCustomRange(ui.$responsiveWidths);
			});

			// Button that applies responsive width settings to all slides
			ui.$applyAllWidth.on("click", function(event){

				Jumbos.applyAllWidths([
					Jumbos.getCurrentJumbo().getMobileWidth(),
					Jumbos.getCurrentJumbo().getTabletWidth()
				]);

				xmBootstrapAlert.alert({
					fade: true,
					content: "Settings applied to all slides",
					showClose: false
				})
			});

			ui.$desktopImageUpload.on("change", function(event){
				debugger;
			});
		})({
			initBgColor: options.initBgColor,
			initMobileWidth: options.initMobileWidth,
			initTabletWidth: options.initTabletWidth
		});

		(function initComponentControls(options){
			ui.$buttonContent.selectpicker({
				style: "btn-info"
			}).on("change", function(event){
				switch($(this).val()) {
					case 'none':
						Jumbos.getCurrentJumbo().setButtonVisibility(PRIMARY_BUTTON_INDEX, false);
						Jumbos.getCurrentJumbo().setButtonVisibility(SECONDARY_BUTTON_INDEX, false);
						break;
					case 'primary':
						Jumbos.getCurrentJumbo().setButtonVisibility(PRIMARY_BUTTON_INDEX, true);
						Jumbos.getCurrentJumbo().setButtonVisibility(SECONDARY_BUTTON_INDEX, false);
						break;
					case 'all':
						Jumbos.getCurrentJumbo().setButtonVisibility(PRIMARY_BUTTON_INDEX, true);
						Jumbos.getCurrentJumbo().setButtonVisibility(SECONDARY_BUTTON_INDEX, true);
						break;
				}
				Jumbos.getCurrentJumbo().renderButtonControls();
				Jumbos.getCurrentJumbo().renderButtons();
			});

			var updateDHAlign = function(event, _ui) {
				Jumbos.getCurrentJumbo().setButtonDHAlign(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDHAlign.slider({
				min: 0,
				max: 100,
				step: 0.1,
				value: options.initDHAlign,
				slide: updateDHAlign,
				change: updateDHAlign
			}).slider('pips', {rest: 'label', suffix: '%'}).slider('float', {suffix: '%'});


			var updateDVAlign = function(event, _ui) {
				Jumbos.getCurrentJumbo().setButtonDVAlign(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDVAlign.slider({
				min: 0,
				max: 100,
				step: 0.1,
				value: options.initDVAlign,
				slide: updateDVAlign,
				change: updateDVAlign
			}).slider('pips', {rest: 'label', suffix: '%'}).slider('float', {suffix: '%'});

			var updateDVGap = function(event, _ui) {
				Jumbos.getCurrentJumbo().setButtonDVGap(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDVGap.slider({
				min: 0,
				max: 20,
				step: 0.5,
				value: options.initDVGap,
				slide: updateDVGap,
				change: updateDVGap
			}).slider('pips', {suffix: 'rem'}).slider('float', {suffix: 'rem'});

			var updateDMinWidth = function(event, _ui) {
				Jumbos.getCurrentJumbo().setButtonDMinWidth(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDMinWidth.slider({
				min: 0,
				max: 100,
				step: 0.1,
				value: options.initDMinWidth,
				slide: updateDMinWidth,
				change: updateDMinWidth
			}).slider('pips', {rest: 'label', suffix: '%'}).slider('float', {suffix: '%'});

			var updateDFontSize = function(event, _ui) {
				Jumbos.getCurrentJumbo().setButtonDFontSize(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDFontSize.slider({
				min: 1,
				max: 4,
				step: 0.1,
				value: options.initDFontSize,
				slide: updateDFontSize,
				change: updateDFontSize
			}).slider('pips', {suffix: 'rem'}).slider('float', {suffix: 'rem'});

			ui.$buttonPrimaryText.on("keyup change", function(event) {
				Jumbos.getCurrentJumbo().setButtonText(PRIMARY_BUTTON_INDEX, $(this).val());
				Jumbos.getCurrentJumbo().renderButtons();
			});

			ui.$buttonSecondaryText.on("keyup change", function(event) {
				Jumbos.getCurrentJumbo().setButtonText(SECONDARY_BUTTON_INDEX, $(this).val());
				Jumbos.getCurrentJumbo().renderButtons();
			});

			ui.$buttonPrimaryUrl.on("change", function(event) {
				Jumbos.getCurrentJumbo().setButtonUrl(PRIMARY_BUTTON_INDEX, $(this).val());
			});

			ui.$buttonSecondaryUrl.on("change", function(event) {
				Jumbos.getCurrentJumbo().setButtonUrl(SECONDARY_BUTTON_INDEX, $(this).val());
			});

			ui.$buttonPrimaryColor.spectrum();
			ui.$buttonSecondaryColor.spectrum();
			ui.$buttonPrimaryBgColor.spectrum();
			ui.$buttonSecondaryBgColor.spectrum();

		})({
			initDHAlign: options.initDHAlign || 50,		//%
			initDVAlign: options.initDVAlign || 50,		//%
			initDVGap: options.initDVGap || 1,			//rem
			initDFontSize: options.initDFontSize || 1,	//rem
			initDMinWidth: options.initDMinWidth || 10 	//%
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

			var updateGridHGap = function(event, _ui) {
				var gridHGap = _ui.value;
				ui.$mainCanvas.responsiveCanvas({gridHGap: gridHGap, redrawGrid: true});
			};

			ui.$gridHGap.slider({
				min: 10,
				max: 80,
				step: 10,
				value: options.initGridHGap,
				slide: updateGridHGap,
				change: updateGridHGap
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
			
			var updateGridVGap = function(event, _ui) {
				var gridVGap = _ui.value;
				ui.$mainCanvas.responsiveCanvas({gridVGap: gridVGap, redrawGrid: true});
			};

			ui.$gridVGap.slider({
				min: 10,
				max: 80,
				step: 10,
				value: options.initGridVGap,
				slide: updateGridVGap,
				change: updateGridVGap
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
		$(window).resize(initResponsivePreview);

		// Temps
		ui.$previews.sortable({
			tolerance: "pointer",
			opacity: 0.5,
			containment: "parent",
			delay: 150,
			start: function(event, ui) {
				ui.placeholder.width(ui.helper.width());
			},
			stop: function(event, ui) {
				debugger;
			}
		});	
	},

	getImageContainer = function(imageUrl, loadCallback) {
		return $("<div></div>")
			.addClass(IMAGE_CONTAINER)
			.append($("<img></img>")
				.prop("src", imageUrl)
				.on("load", loadCallback)
				.error(function(){
					// Replace image source if 404'd
					$(this).prop("src", settings.imageNotFoundUrl);
				})
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
					initBgMaxHeight: settings.maxBgHeight,
					initBgColor: "red",
					initMobileWidth: 600,
					initTabletWidth: 900
				});

				$.when(Jumbos.init(ui), Jumbo.init(ui)).done(function(){
					initReponsiveSlider();
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