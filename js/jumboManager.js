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
	BUTTON_HORIZONTAL = "horizontal",
	BUTTON_VERTICAL = "vertical",

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
	IMAGE_REMOVE = "image-remove",

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
		slideUrlId: "jumbomanager-slide-url",
		clearSlideUrlId: "jumbomanager-clear-slide-url",
		desktopMaxHeightId: "jumbomanager-desktop-max-height",
		tabletMaxHeightId: "jumbomanager-tablet-max-height",
		mobileMaxHeightId: "jumbomanager-mobile-max-height",
		prevSlideId: "jumbomanager-prevSlide",
		nextSlideId: "jumbomanager-nextSlide",
		responsiveWidthsId: "jumbomanager-responsive-widths",
		desktopImageSrcId: "jumbomanager-desktop-image-src",
		tabletImageSrcId: "jumbomanager-tablet-image-src",
		mobileImageSrcId: "jumbomanager-mobile-image-src",
		desktopImageUploadId: "jumbomanager-desktop-image-upload",
		tabletImageUploadId: "jumbomanager-tablet-image-upload",
		mobileImageUploadId: "jumbomanager-mobile-image-upload",
		autoplaySpeedId: "jumbomanager-autoplay-speed",

		responsiveSliderId: "jumbomanager-responsive-slider",
		overlayId: "jumbomanager-overlay",

		buttonsId: "jumbomanager-buttons",
		buttonContentId: "jumbomanager-button-content",
		buttonOrientationId: "jumbomanager-button-orientation",
		buttonDHAlignId: "jumbomanager-button-d-halign",
		buttonDVAlignId: "jumbomanager-button-d-valign",
		buttonDVGapId: "jumbomanager-button-d-vgap",
		buttonDHGapId: "jumbomanager-button-d-hgap",
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

		addImageId: "jumbomanager-add-image",
		saveCanvasId: "jumbomanager-save-canvas",
		savePreviewCanvasId: "jumbomanager-save-preview-canvas",

		//TODO add labels
		labelsId: "jumbomanager-labels",

		imageNotFoundUrl: "img/image_not_found.jpg",
		previewUrl: "./JumbotronPreview.html",
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

		var
		DEFAULT_JUMBO_JSON,
		INIT_RENDER_IDX = 0,
		_ui = {},
		_objects = [],
		_currentJumbo = {},

		json = {},

		validate = function() {
			return _objects && !!_objects.length;
		},

		loadJumbos = function() {
			var dfd = $.Deferred();

			$.when(jumboManagerREST.ajaxFetchJumbos()).done(function(data){
				//load global settings
				json = data,

				//load jumbos
				$.each(data.jumbos, function(idx, jumboJson){
					_objects.push(Jumbo.create(jumboJson));
				});
				dfd.resolve();
			}).fail(function(){
				dfd.reject("Jumbos fetching ajax failed");
			});

			return dfd.promise();
		},

		loadDefaultJumbo = function() {
			var dfd = $.Deferred();

			$.when(jumboManagerREST.ajaxFetchDefaultJumbo()).done(function(data){
				DEFAULT_JUMBO_JSON = data;
				dfd.resolve();
			}).fail(function(){
				dfd.reject("Default jumbo fetching ajax failed");
			});

			return dfd.promise();
		},

		_addNewJumbo = function() {
			var newJumbo = Jumbo.create(DEFAULT_JUMBO_JSON);
			newJumbo.renderPreviewImage.apply(newJumbo, null);
			_objects.push(newJumbo);
			initPreviewPagination();
			return newJumbo;
		},

		_serialize = function() {
			// reset jumbos array
			json.jumbos = [];

			// serialize each object
			$.each(_objects, function(idx, jumbo){
				json.jumbos.push(jumbo.serialize());
			});
			return json;
		},

		_save = function() {
			return jumboManagerREST.ajaxSaveCanvas(_serialize());
		},

		_reorder = function(oldIndex, newIndex) {
			if(oldIndex < 0 || oldIndex >= _objects.length ||
				newIndex < 0 || newIndex >= _objects.length) {
				console.log("Invalid operation: index is out of bound")
				return;
			}

			_objects.move(oldIndex, newIndex);
		},

		_remove = function(index) {

			if(index < 0 || index >= _objects.length) {
				console.log("Invalid operation: index is out of bound")
				return;
			}

			var jumboToRemove = _objects[index],
			isRemovingCurrent = (index === _getCurrentJumboIndex());
			_objects.remove(index);

			// Create a new jumbo if last jumbo is removed
			if(_objects.length === 0) {
				Jumbos.addNewJumbo().renderFocusImage();
				return;
			}

			// removing the current jumbo
			if(isRemovingCurrent) {
				if(index >= _objects.length) {
					index -= 1;
				}
				_objects[index].renderFocusImage();
			}
		},

		_removeJumbo = function(jumbo) {
			var index = _objects.indexOf(jumbo);
			_remove(index);
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

		_renderControls = function() {
			ui.$desktopMaxHeight.slider({
				value: json.desktopMaxHeight
			});

			ui.$tabletMaxHeight.slider({
				value: json.tabletMaxHeight
			});

			ui.$mobileMaxHeight.slider({
				value: json.mobileMaxHeight
			});

			// Populate Responsive Widths slider values
			_ui.$responsiveWidths
				.slider({
					values: [json.mobileWidth, json.tabletWidth]
				})
			;
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

			getAutoplaySpeed: function() {
				return json.autoplaySpeed;
			},

			setAutoplaySpeed: function(speed) {
				json.autoplaySpeed = speed;
			},

			getDesktopMaxHeight: function() {
				return json.desktopMaxHeight;
			},

			getTabletMaxHeight: function() {
				return json.tabletMaxHeight;
			},

			getMobileMaxHeight: function() {
				return json.mobileMaxHeight;
			},

			setDesktopMaxHeight: function(_desktopMaxHeight) {
				json.desktopMaxHeight = _desktopMaxHeight;
			},

			setTabletMaxHeight: function(_tabletMaxHeight) {
				json.tabletMaxHeight = _tabletMaxHeight;
			},

			setMobileMaxHeight: function(_mobileMaxHeight) {
				json.mobileMaxHeight = _mobileMaxHeight;
			},

			getMobileWidth: function() {
				return json.mobileWidth;
			},

			setMobileWidth: function(_mobileWidth) {
				json.mobileWidth = _mobileWidth;
			},

			getTabletWidth: function() {
				return json.tabletWidth;
			},

			setTabletWidth: function(_tabletWidth) {
				json.tabletWidth = _tabletWidth;
			},

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

			save: function() {
				return _save();
			},

			serialize: function() {
				return _serialize();
			},

			reorder: function(oldIndex, newIndex) {
				return _reorder(oldIndex, newIndex);
			},

			addNewJumbo: function() {
				return _addNewJumbo();
			},

			removeJumbo: function(jumbo) {
				return _removeJumbo(jumbo);
			},

			init: function(ui) {
				_ui = ui;

				var dfd = $.Deferred(),
				promises = [
					loadJumbos(),
					loadDefaultJumbo()
				];

				$.when.apply(this, promises).done(function(){
					if(validate()) {
						initRenderPreviewImages();
						initRenderBackgroundImage();
						_renderControls();
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
				var
				json = jumboJson,

				$dom = {},

				_serialize = function() {
					return json;
				},

				_remove = function() {
					Jumbos.removeJumbo(this);
					$dom.remove();
				},

				_focusPreviewImage = function() {
					$("."+CURRENT_JUMBO).removeClass(CURRENT_JUMBO);
					$dom.addClass(CURRENT_JUMBO);
				},

				_renderBackgroundImage = function() {

					var responsiveImageUrl,
					maxHeight,
					responsiveWidth = _ui.$background.width();

					if(responsiveWidth > Jumbos.getTabletWidth()) {
						responsiveImageUrl = json.image.desktopUrl;
						maxHeight = Jumbos.getDesktopMaxHeight();
					} else if(responsiveWidth > Jumbos.getMobileWidth()) {
						responsiveImageUrl = json.image.tabletUrl || json.image.desktopUrl;
						maxHeight = Jumbos.getTabletMaxHeight();
					} else {
						responsiveImageUrl = json.image.mobileUrl || json.image.tabletUrl || json.image.desktopUrl;
						maxHeight = Jumbos.getMobileMaxHeight();
					}

					_ui.$background
						.html(
							getImageContainer(responsiveImageUrl, _renderOverlay)
								.addClass(CANVAS_IMAGE_CONTAINER)
								.css({
									backgroundColor: json.image.bgColor,
									maxHeight: maxHeight
								})
						)
					;
				},

				_renderFocusImage = function() {
					Jumbos.setCurrentJumbo(this);
					_renderBackgroundImage();
					_renderControls();
					_focusPreviewImage();
					_renderOverlay();
					_renderButtons();
					_ui.$mainCanvas.responsiveCanvas({redrawGrid: true, resize: true});
				},

				_renderButtons = function() {

					// responsive button
					var responsiveWidth = _ui.$background.width(),
					buttonJson = {};

					if(responsiveWidth > Jumbos.getTabletWidth()) {			// Desktop
						buttonJson = $.extend(true,{},json.button);
					} else if(responsiveWidth > Jumbos.getMobileWidth()) {	// Tablet
						buttonJson = $.extend(true,{},json.button);
						buttonJson.hAlign = "50%";
						buttonJson.vAlign = "90%";
						buttonJson.minWidth = "50%";
					} else {												// Mobile
						buttonJson = $.extend(true,{},json.button);
						buttonJson.hAlign = "50%";
						buttonJson.vAlign = "90%";
						buttonJson.minWidth = "50%";
						buttonJson.buttons[SECONDARY_BUTTON_INDEX].visible = false;
					}

					// orientation
					if(buttonJson.orientation === BUTTON_HORIZONTAL) {
						buttonJson.vGap = 0;
					} else {
						buttonJson.hGap = 0;
					}
					var isPrimaryOnly = !buttonJson.buttons[SECONDARY_BUTTON_INDEX].visible,
					isHorizontal = buttonJson.orientation && buttonJson.orientation === "horizontal";

					_ui.$buttons
						.empty()
						.css({
							display: "inline-block",
							position: "absolute",
							left: buttonJson.hAlign,
							top: buttonJson.vAlign,
							transform: "translate(-" + buttonJson.hAlign + ", -" + buttonJson.vAlign + ")",
							minWidth: buttonJson.minWidth
						})
					;

					$.each(buttonJson.buttons, function(idx, button){
						if(button.visible){
							_ui.$buttons
								.append($("<div></div>")
									.addClass(OVERLAY_BUTTON)
									.html(button.text)
									.css({
										"background-color": button.bgColor,
										"border-color": button.color,
										"color": button.color,
										"margin-top": buttonJson.vGap,
										"margin-left": buttonJson.hGap,
										"font-size": buttonJson.fontSize,
										"padding": settings.buttonVPadding + " 0",
										"width": !isPrimaryOnly && isHorizontal ? "calc(50% - " + buttonJson.hGap + ")" : "100%"
									})
								)
							;

							if(idx === 0) {
								_ui.$buttons.find("."+OVERLAY_BUTTON)
									.addClass(OVERLAY_BUTTON_PRIMARY)
									.css({
										"margin-top": 0,
										"margin-left": 0,
										"margin-right": !isPrimaryOnly && isHorizontal ? buttonJson.hGap : 0
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
					if(json.button.buttons[PRIMARY_BUTTON_INDEX].visible && json.button.buttons[SECONDARY_BUTTON_INDEX].visible) {
						_ui.$buttonContent.selectpicker("val", "all");
						$(".display-for-primary, .display-for-all").show();
					} else if(json.button.buttons[PRIMARY_BUTTON_INDEX].visible) {
						_ui.$buttonContent.selectpicker("val", "primary");
						$(".display-for-primary").show();
					} else {
						_ui.$buttonContent.selectpicker("val", "none");
					}

					// Populate button orientation
					$(".display-for-horizontal, .display-for-vertical").hide();
					if(json.button.orientation === BUTTON_HORIZONTAL) {
						_ui.$buttonOrientation.selectpicker("val", BUTTON_HORIZONTAL);
						$(".display-for-horizontal").show();
					} else {	// Button orientation is vertical OR undefined
						_ui.$buttonOrientation.selectpicker("val", BUTTON_VERTICAL);
						$(".display-for-vertical").show();
					}

					// Populate desktop horizontal alignment
					_ui.$buttonDHAlign.slider({
						value: parseFloat(json.button.hAlign)
					});

					// Populate desktop vertical alignment
					_ui.$buttonDVAlign.slider({
						value: parseFloat(json.button.vAlign)
					});

					// Populate desktop vertical gap
					_ui.$buttonDVGap.slider({
						value: parseFloat(json.button.vGap)
					});

					// Populate desktop width
					_ui.$buttonDMinWidth.slider({
						value: parseFloat(json.button.minWidth)
					});

					// Populate desktop fontsize
					_ui.$buttonDFontSize.slider({
						value: parseFloat(json.button.fontSize)
					});

					_ui.$buttonPrimaryText.val(json.button.buttons[PRIMARY_BUTTON_INDEX].text);
					_ui.$buttonSecondaryText.val(json.button.buttons[SECONDARY_BUTTON_INDEX].text);
					_ui.$buttonPrimaryUrl.val(json.button.buttons[PRIMARY_BUTTON_INDEX].url);
					_ui.$buttonSecondaryUrl.val(json.button.buttons[SECONDARY_BUTTON_INDEX].url);

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
						json.button.buttons[idx].bgColor = color.toRgbString();
					},

					updateButtonColor = function(idx, color) {
						json.button.buttons[idx].color = color.toRgbString();
					};

					_ui.$buttonPrimaryColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: json.button.buttons[PRIMARY_BUTTON_INDEX].color,
							move: function(color) {
								updateButtonColor(PRIMARY_BUTTON_INDEX, color);
								_renderButtons();
							},
							change: function(color) {
								debugger;
							}
						}))
					;
					_ui.$buttonSecondaryColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: json.button.buttons[SECONDARY_BUTTON_INDEX].color,
							move: function(color) {
								updateButtonColor(SECONDARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
					_ui.$buttonPrimaryBgColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: json.button.buttons[PRIMARY_BUTTON_INDEX].bgColor,
							move: function(color) {
								updateButtonBgColor(PRIMARY_BUTTON_INDEX, color);
								_renderButtons();
							}
						}))
					;
					_ui.$buttonSecondaryBgColor
						.spectrum($.extend({}, buttonSpectrumDefaults, {
							color: json.button.buttons[SECONDARY_BUTTON_INDEX].bgColor,
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
							color: json.image.bgColor,
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

					// Populate slide url
					_ui.$slideUrl
						.val(json.image.slideUrl)
					;

					// Populate Desktop Image Location
					_ui.$desktopImageSrc
						.val(json.image.desktopUrl)
					;

					// Populate Tablet Image Location
					_ui.$tabletImageSrc
						.val(json.image.tabletUrl)
					;

					// Populate Mobile Image Location
					_ui.$mobileImageSrc
						.val(json.image.mobileUrl)
					;

					_renderButtonControls();
				},

				_renderPreviewImage = function() {
					var self = this;

					$dom = getImageContainer(json.image.desktopUrl)
						.css("position", "relative")
						.append($("<div></div>")	// Remove button
							.addClass(IMAGE_REMOVE)
							.append($("<span></span>")
								.addClass("fa fa-times-circle fa-2x")
							)
							.on("click", function(event){
								_remove.apply(self, arguments);

								xmBootstrapAlert.alert({
									content: "Image removed",
									fade: true,
									showClose: false
								});

							})
						)
					;

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
				};
				return {
					setBgColor: function(rgba) {
						json.image.bgColor = rgba;
					},

					setButtonVisibility: function(idx, visible) {
						json.button.buttons[idx].visible = visible;
					},

					setButtonOrientation: function(orientation) {
						json.button.orientation = orientation;
					},

					setButtonText: function(idx, text) {
						json.button.buttons[idx].text = text;
					},

					setButtonUrl: function(idx, url) {
						json.button.buttons[idx].url = url;
					},

					setButtonDHAlign: function(_DHAlign, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						json.button.hAlign = _DHAlign + unit;
					},

					setButtonDVAlign: function(_DVAlign, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						json.button.vAlign = _DVAlign + unit;
					},

					setButtonDVGap: function(_DVGap, unit) {
						unit = typeof unit !== 'undefined' ? unit : 'rem';
						json.button.vGap = _DVGap + unit;
					},

					setButtonDHGap: function(_DHGap, unit) {
						unit = typeof unit !== 'undefined' ? unit : 'rem';
						json.button.hGap = _DHGap + unit;
					},

					setButtonDMinWidth: function(_DMinWidth, unit) {
						unit = typeof unit !== 'undefined' ? unit : '%';
						json.button.minWidth = _DMinWidth + unit;
					},

					setButtonDFontSize: function(_DFontSize, unit) {
						unit = typeof unit !== 'undefined' ? unit : 'rem';
						json.button.fontSize = _DFontSize + unit;
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
					},

					serialize: function() {
						return _serialize.apply(this, arguments);
					},

					remove: function() {
						return _remove.apply(this, arguments);
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

	updateSliderRangeColor = function(width) {
		// Get value of current responsive slider, if it has been initialized
		width = width || ui.$responsiveSlider.data("uiSlider") && ui.$responsiveSlider.slider("value");
		var $range = ui.$responsiveSlider.children(".ui-slider-range"),
		getCurrentResponsiveClass = function(width){
			if(width < Jumbos.getMobileWidth()) {
				xmBootstrapAlert.alert({
					mode: "danger",
					content: "Mobile View",
					showClose: false,
					fade: true,
					fadeTime: 500
				});
				return MOBILE_RANGE_BACKGROUND;
			} else if(width < Jumbos.getTabletWidth()) {
				xmBootstrapAlert.alert({
					mode: "warning",
					content: "Tablet View",
					showClose: false,
					fade: true,
					fadeTime: 500
				});
				return TABLET_RANGE_BACKGROUND;
			} else {
				xmBootstrapAlert.alert({
					mode: "success",
					content: "Desktop View",
					showClose: false,
					fade: true,
					fadeTime: 500
				});
				return DESKTOP_RANGE_BACKGROUND;
			}
		};

		if(!$range) {
			return;
		}
		$range
			.removeClass(MOBILE_RANGE_BACKGROUND)
			.removeClass(TABLET_RANGE_BACKGROUND)
			.removeClass(DESKTOP_RANGE_BACKGROUND)
			.addClass(getCurrentResponsiveClass(width));
	},

	initReponsiveSlider = function() {
		$(".letterbox").width(0);
		ui.$preview.width("100%");

		var canvasWidth = ui.$responsiveSlider.parent()[0].clientWidth;

		updateSliderRangeColor(canvasWidth);

		var updateResponsiveWidth = function(event, _ui) {
			ui.$preview.width(_ui.value);
			$(".letterbox").width((canvasWidth - _ui.value) / 2);
			Jumbos.getCurrentJumbo().renderFocusImage();

			// Set color
			updateSliderRangeColor(_ui.value);
		};

		ui.$responsiveSlider.slider({
			range: "min",
			min: 300,
			max: canvasWidth,
			step: 2,	// Setting this from 1 to 2 would resolve the jittering effect, which is caused by rounding
			value: canvasWidth,
			create: function(event, _ui) {
				updateSliderRangeColor(_ui.value);
			},
			slide: updateResponsiveWidth,
			change: updateResponsiveWidth
		}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
	},

	initControls = function(options) {

		(function initToolbarControls(options){
			ui.$addImage.on("click", function(){
				Jumbos.addNewJumbo().renderFocusImage();

				xmBootstrapAlert.alert({
					content: "Image added",
					fade: true,
					showClose: false
				});
			});
			ui.$saveCanvas.on("click", function(){
				$.when(Jumbos.save()).done(function(message){
					xmBootstrapAlert.alert({
						content: message,
						fade: true,
						showClose: false
					});
				}).fail(function(message){
					xmBootstrapAlert.alert({
						mode: "danger",
						content: message,
						fade: true,
						showClose: false
					});
				});
			});
			ui.$savePreviewCanvas.on("click", function(){
				ui.$saveCanvas.trigger("click");
				window.open(settings.previewUrl, '_blank');
			});
		})({

		});

		(function initGeneralControls(options){
			// desktop max height
			var updateDesktopMaxHeight = function(event, _ui) {
				Jumbos.setDesktopMaxHeight(_ui.value);
				Jumbos.getCurrentJumbo().renderFocusImage();
			};
			ui.$desktopMaxHeight.slider({
				min: 50,
				max: 800,
				step: 10,
				value: options.initDesktopMaxHeight,
				slide: updateDesktopMaxHeight,
				change: updateDesktopMaxHeight
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
			
			// tablet max height
			var updateTabletMaxHeight = function(event, _ui) {
				Jumbos.setTabletMaxHeight(_ui.value);
				Jumbos.getCurrentJumbo().renderFocusImage();
			};
			ui.$tabletMaxHeight.slider({
				min: 50,
				max: 800,
				step: 10,
				value: options.initTabletMaxHeight,
				slide: updateTabletMaxHeight,
				change: updateTabletMaxHeight
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});

			// mobile max height
			var updateMobileMaxHeight = function(event, _ui) {
				Jumbos.setMobileMaxHeight(_ui.value);
				Jumbos.getCurrentJumbo().renderFocusImage();
			};
			ui.$mobileMaxHeight.slider({
				min: 50,
				max: 800,
				step: 10,
				value: options.initMobileMaxHeight,
				slide: updateMobileMaxHeight,
				change: updateMobileMaxHeight
			}).slider("pips", {suffix: "px"}).slider("float", {suffix: "px"});
		})({
			initDesktopMaxHeight: options.initDesktopMaxHeight,
			initTabletMaxHeight: options.initTabletMaxHeight,
			initMobileMaxHeight: options.initMobileMaxHeight
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
				Jumbos.setMobileWidth(values[MOBILE_VALUE_INDEX]);
				Jumbos.setTabletWidth(values[TABLET_VALUE_INDEX]);
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
						updateSliderRangeColor();
					},
					change: function(event, ui) {
						updateCustomRange(this);
						updateJumboWidthsBySlider(ui.values);
						updateSliderRangeColor();
					}
				})
				.slider("pips", {rest: "label"});
				// .slider("float", {suffix: "px"});
			;

			// Responsive Width responding to window resize
			$(window).resize(function(){
				updateCustomRange(ui.$responsiveWidths);
			});

			// TODO autoplay

			var updateAutoplaySpeed = function(event, ui) {
				Jumbos.setAutoplaySpeed(ui.value * 1000);	// Convert to ms
			};

			ui.$autoplaySpeed
				.slider({
					step: 0.5,
					min: 0,
					max: 10,
					value: options.initAutoplaySpeed / 1000,
					change: updateAutoplaySpeed
				})
				.slider("pips", {labels:{first: "OFF", last:"10s"}})
				.slider("float", {suffix: "s"})
			;

			ui.$desktopImageUpload.on("change", function(event){
				//TODO upload images
				debugger;
			});

			ui.$tabletImageUpload.on("change", function(event){
				//TODO upload images
				debugger;
			});

			ui.$mobileImageUpload.on("change", function(event){
				//TODO upload images
				debugger;
			});

			// Clear slide url
			ui.$clearSlideUrl
				.on("click", function(event){
					xmBootstrapAlert.alert({
						content: "Cleared",
						fade: true,
						fadeTime: 500,
						showClose: false
					});
					ui.$slideUrl.val("");
				})
			;
		})({
			initBgColor: options.initBgColor,
			initMobileWidth: options.initMobileWidth,
			initTabletWidth: options.initTabletWidth,
			initAutoplaySpeed: options.initAutoplaySpeed
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

			ui.$buttonOrientation.selectpicker({
				style: "btn-warning"
			}).on("change", function(event){
				var input = $(this).val(),
				orientation = (input === BUTTON_HORIZONTAL || input === BUTTON_VERTICAL) ? input : BUTTON_VERTICAL;
				Jumbos.getCurrentJumbo().setButtonOrientation(orientation);
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

			var updateDHGap = function(event, _ui) {
				//TODO DH
				Jumbos.getCurrentJumbo().setButtonDHGap(_ui.value);
				Jumbos.getCurrentJumbo().renderButtons();
			};

			ui.$buttonDHGap.slider({
				min: 0,
				max: 20,
				step: 0.5,
				value: options.initDHGap,
				slide: updateDHGap,
				change: updateDHGap
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
			initDHGap: options.initDHGap || 1,			//rem
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
				$(this).attr('data-previndex', ui.item.index());
			},
			deactivate: function(event, ui) {
				// reorder Jumbos _objects
				var newIndex = ui.item.index();
				var oldIndex = parseInt($(this).attr("data-previndex"));
				$(this).removeAttr("data-previndex");
				Jumbos.reorder(oldIndex, newIndex);
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
		;
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
					initDesktopMaxHeight: 400,
					initTabletMaxHeight: 800,
					initMobileMaxHeight: 800,
					initBgColor: "red",
					initMobileWidth: 600,
					initTabletWidth: 900,
					initAutoplaySpeed: 5000,
				});

				$.when(Jumbos.init(ui), Jumbo.init(ui)).done(function(){
					initReponsiveSlider();
					initPreviewPagination();
				}).fail(function(msg){
					// alert("Failed because: " + msg);
					xmBootstrapAlert.alert({
						mode: "danger",
						content: msg
					})
				});

			} else {
				//log ui initialization error
				// alert("Ui Error");
				xmBootstrapAlert.alert({
					mode: "danger",
					content: "UI Error",
					showClose: false
				})
			}
		}
	}
})(jQuery);

$(function(){
	//TODO Log set popup
	jumboManager.init();
});