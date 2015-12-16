/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";
(function($){

	var
	json = {},
	settings = {},
	defaults = {
		jumbotronClass: "jumbotron",
		slideContainerClass: "slide-container",
		buttonContainerClass: "button-container",
		buttonClass: "button",
		primaryButtonClass: "button-primary",
		imageClass: "image",
		overlayClass: "overlay",
		imageNotFoundUrl: "img/image_not_found.jpg",
		blankImageUrl: "img/blank.gif",
		buttonVPadding: "0.5rem",
		slickDefaults: {
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true
		}
	},

	desktopJumbotron = {},
	tabletJumbotron = {},
	mobileJumbotron ={},

	TYPE_DESKTOP = "desktop",
	TYPE_TABLET = "tablet",
	TYPE_MOBILE = "mobile",
	DATA_SRC = "data-src",

	getImage = function(imageUrl) {
		var dfd = $.Deferred(),
		image = $("<img></img>")
			.addClass(settings.imageClass)
			.prop("src", settings.blankImageUrl)	// For lazy loading
			.attr(DATA_SRC, imageUrl)
			.css({
				maxHeight: "100%",
				margin: "0 auto",
				maxWidth: "100%",
				zIndex: -1
			})
			.load(function(){
				dfd.resolve(image);
			})
			.error(function(){
				// Replace image source if 404'd
				$(this).prop("src", settings.imageNotFoundUrl);
			})
		;
		return dfd.promise();
	},

	getButtonContainer = function(buttonJson) {
		var dfd = $.Deferred(),
		isPrimaryOnly = !buttonJson.buttons[1].visible,
		isHorizontal = buttonJson.orientation && buttonJson.orientation === "horizontal",
		buttonContainer = $("<div></div>")
			.addClass(settings.buttonContainerClass)
			.css({
				display: "inline-block",
				position: "absolute",
				left: buttonJson.hAlign,
				top: buttonJson.vAlign,
				transform: "translate(-" + buttonJson.hAlign + ", -" + buttonJson.vAlign + ")",
				minWidth: buttonJson.minWidth
			});
		;

		$.each(buttonJson.buttons, function(idx, button){
			if(button.visible){
				var buttonElement = $("<a></a>")
					.addClass(settings.buttonClass)
					.prop("href", button.url)
					.html(button.text)
					.css({
						"background-color": button.bgColor,
						"border": "1px solid " + button.color,
						"color": button.color,
						"margin-top": !isHorizontal ? buttonJson.vGap : 0,
						"margin-left": isHorizontal ? buttonJson.hGap : 0,
						"font-size": buttonJson.fontSize,
						"padding": settings.buttonVPadding + " 0",
						"text-align": "center",
						"display": "inline-block",
						"width": !isPrimaryOnly && isHorizontal ? "calc(50% - " + buttonJson.hGap + ")" : "100%",
					})
				;

				if(idx === 0) {
					buttonElement
						.addClass(settings.primaryButtonClass)
						.css({
							"margin-top": 0,
							"margin-left": 0,
							"margin-right": !isPrimaryOnly && isHorizontal ? buttonJson.hGap : 0
						})
					;
				}

				buttonContainer.append(buttonElement);
			}
		});

		return buttonContainer;

		dfd.resolve();
		return dfd.promise();
	},

	getSlideContainer = function(jumbo, type) {
		var dfd = $.Deferred();
		var image = jumbo.image;
		var buttonJson;
		var imageUrl, height;
		switch(type) {
			case TYPE_DESKTOP:
				imageUrl = image.desktopUrl;
				height = json.desktopMaxHeight;
				buttonJson = jumbo.button;		// Duplicated in case we are moving button settings to responsive
				break;

			case TYPE_TABLET:
				imageUrl = image.tabletUrl || image.desktopUrl;
				height = json.tabletMaxHeight;
				buttonJson = jumbo.button;		// Duplicated in case we are moving button settings to responsive
				buttonJson.hAlign = "50%";
				buttonJson.vAlign = "90%";
				buttonJson.minWidth = "50%";
				buttonJson.orientation = "horizontal";
				break;

			case TYPE_MOBILE:
				imageUrl = image.mobileUrl || image.tabletUrl || image.desktopUrl;
				height = json.mobileMaxHeight;
				buttonJson = jumbo.button;		// Duplicated in case we are moving button settings to responsive
				buttonJson.hAlign = "50%";
				buttonJson.vAlign = "90%";
				buttonJson.minWidth = "50%";
				buttonJson.orientation = "horizontal";
				buttonJson.buttons[1].visible = false;
				break;
		}

		var slideContainer = $("<div></div>")
			.addClass(settings.slideContainerClass)
			.css({
				position: "relative",
				maxHeight: height,
				height: "auto",
				backgroundColor: image.bgColor
			})
		;

		// Once image is loaded, append image and overlay
		$.when(getImage(imageUrl), getButtonContainer(buttonJson)).done(function(imageElement, buttonContainerElement){
			slideContainer.append(imageElement);
			var width = imageElement.width(),
			height = slideContainer.height(),
			overlay = $("<a></a>")
				.prop("href", image.slideUrl)	// Url for each slide
				.append($("<div></div>")
					.addClass(settings.overlayClass)
					.css({
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						margin: "0 auto",
						width: width,
						height: height
					})
					.append(buttonContainerElement)
				)
			;

			slideContainer.append(overlay);
			dfd.resolve(slideContainer);
		});

		return dfd.promise();
	},

	getSlideContainers = function(jumbos, type) {
		var dfd = $.Deferred();
		var slideContainers = [];
		var slideContainersPromises = [];
		$.each(jumbos, function(idx, jumbo){
			slideContainersPromises.push(getSlideContainer(jumbo, type));
		});
		$.when.apply($, slideContainersPromises).done(function(){
			$.each(arguments, function(idx, container) {
				slideContainers.push(container);
			});
			dfd.resolve(slideContainers);
		});
		// return slideContainers;
		return dfd.promise();
	},

	getJumbotronContainer = function(json, type) {

		var slickOptions = {
			autoplay: json.autoplaySpeed > 0,
			autoplaySpeed: json.autoplaySpeed > 0 ? json.autoplaySpeed : 0
		};

		switch(type) {
			case TYPE_DESKTOP:
				slickOptions.asNavFor = [
					"." + TYPE_TABLET + "-" + settings.jumbotronClass,
					"." + TYPE_MOBILE + "-" + settings.jumbotronClass
				]
				break;

			case TYPE_TABLET:
				slickOptions.asNavFor = [
					"." + TYPE_DESKTOP + "-" + settings.jumbotronClass,
					"." + TYPE_MOBILE + "-" + settings.jumbotronClass
				]
				break;

			case TYPE_MOBILE:
				slickOptions.asNavFor = [
					"." + TYPE_TABLET + "-" + settings.jumbotronClass,
					"." + TYPE_DESKTOP + "-" + settings.jumbotronClass
				]
				break;
		}

		var lazyloadImage = function(event, slick, i){
			// lazyload
			i = typeof i !== "undefined" ? i : 0;
			var image = $(slick.$slides[i]).children("."+settings.imageClass),
			src = image.attr(DATA_SRC);
			if(!!src) {
				image.prop("src", src);
				image.removeAttr(DATA_SRC);
				renderJumbotrons();
			}
		};

		var jumbotronContainer = $("<div></div>")
			.addClass(settings.jumbotronClass)
			.addClass(type + "-" + settings.jumbotronClass)
		;

		$.when(getSlideContainers(json.jumbos, type)).done(function(slideContainers){
			jumbotronContainer
				.append(slideContainers)
				.on("init", function(event, slick){
					lazyloadImage(event, slick, 0);
					// TODO: set theme color
				})
				.slick($.extend({}, settings.slickDefaults, slickOptions))
				.on("afterChange", function(event, slick, i){
					lazyloadImage(event, slick, i);
					// TODO: set theme color
				})
		});

		return jumbotronContainer;

	},

	renderJumbotrons = function(width, height) {

		width = typeof width !== "undefined" ? width : $(window).width();
		height = typeof height !== "undefined" ? height: $(window).height();

		desktopJumbotron.hide();
		tabletJumbotron.hide();
		mobileJumbotron.hide();
		// var currentOverlay, currentImage;

		if(width > json.tabletWidth) {
			desktopJumbotron.show();
			// currentOverlay = desktopJumbotron.find(".slick-current ." + settings.overlayClass);
			// currentImage = desktopJumbotron.find(".slick-current ." + settings.imageClass);
		} else if(width > json.mobileWidth) {
			tabletJumbotron.show();
			// currentOverlay = tabletJumbotron.find(".slick-current ." + settings.overlayClass);
			// currentImage = tabletJumbotron.find(".slick-current ." + settings.imageClass);
		} else {
			mobileJumbotron.show();
			// currentOverlay = mobileJumbotron.find(".slick-current ." + settings.overlayClass);
			// currentImage = mobileJumbotron.find(".slick-current ." + settings.imageClass);
		}

		// currentOverlay
		// 	.width(currentImage.width())
		// 	.height(currentImage.height())
		// ;

		setTimeout(function(){
			$.each($("."+settings.overlayClass), function(idx, el) {
				var slideElement = $(this).closest("."+settings.slideContainerClass);
				var imageElement = slideElement.children("img");
				$(this).width(imageElement.width());
				$(this).height(slideElement.height());
			});
		}, 100);	// Setting timeout here to accomodate the throttle in slick slider's resize
	},

	onResize = function(event) {
		renderJumbotrons();
	};

	window.throttle = window.throttle || function(fn, threshhold, scope) {
		threshhold || (threshhold = 250);

		var last,
			deferTimer;

		return function () {
			var context = scope || this;

			var now = +new Date,
				args = arguments;

			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}

	$.fn.generateJumbo = function(_json, options) {

		settings = $.extend({}, defaults, options);

		// $(this).append(JSON.stringify(json));
		json = _json;

		desktopJumbotron = getJumbotronContainer(json, TYPE_DESKTOP);
		tabletJumbotron = getJumbotronContainer(json, TYPE_TABLET);
		mobileJumbotron = getJumbotronContainer(json, TYPE_MOBILE);

		$(this)
			.append(desktopJumbotron)
			.append(tabletJumbotron)
			.append(mobileJumbotron)	
		;

		onResize.apply(this);
		// $(window).resize(throttle(onResize.bind(this),60));
		$(window).resize(onResize.bind(this));
		// $("head").append($("<style></style>")
		// 	.text("\
		// 		.desktop-jumbotron {\
		// 			display: none;\
		// 		}\
		// 		.tablet-jumbotron {\
		// 			display: none;\
		// 		}\
		// 		.mobile-jumbotron {\
		// 			display: none;\
		// 		}\
		// 		@media screen and (max-width:600px) {\
		// 			.mobile-jumbotron {\
		// 				display: block;\
		// 			}\
		// 		}\
		// 		@media screen and (min-width: 601px) {\
		// 			.tablet-jumbotron {\
		// 				display: block;\
		// 			}\
		// 		}\
		// 		@media screen and (min-width: 901px) {\
		// 			.desktop-jumbotron {\
		// 				display: block;\
		// 			}\
		// 		}\
		// 	")
		// );
	}

})(jQuery);