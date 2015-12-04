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
		imageClass: "image",
		imageNotFoundUrl: "img/image_not_found.jpg",
		slickDefaults: {
			autoplay: false,
			autoplaySpeed: 30000
		}
	},

	desktopJumbotron = {},
	tabletJumbotron = {},
	mobileJumbotron ={},

	TYPE_DESKTOP = "desktop",
	TYPE_TABLET = "tablet",
	TYPE_MOBILE = "mobile",

	getImage = function(imageUrl) {
		var dfd = $.Deferred(),
		image = $("<img></img>")
			.addClass(settings.imageClass)
			.prop("src", imageUrl)	//temp
			.attr("data-src", imageUrl)
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

	getImageContainer = function(image, type) {
		var imageUrl, height;

		switch(type) {
			case TYPE_DESKTOP:
				imageUrl = image.desktopUrl;
				height = json.desktopMaxHeight;
				break;

			case TYPE_TABLET:
				imageUrl = image.tabletUrl || image.desktopUrl;
				height = json.tabletMaxHeight;
				break;

			case TYPE_MOBILE:
				imageUrl = image.mobileUrl || image.tabletUrl || image.desktopUrl;
				height = json.mobileMaxHeight;
				break;
		}

		var imageContainer = $("<div></div>")
			.addClass(settings.slideContainerClass)
			.css({
				position: "relative",
				maxHeight: height,
				height: "auto",
				backgroundColor: image.bgColor
			})
		;

		// Once image is loaded, append image and overlay
		$.when(getImage(imageUrl)).done(function(imageElement){
			imageContainer.append(imageElement);

			var width = imageElement.width(),
			height = imageElement.height(),
			overlay = $("<a></a>")
				.prop("href", "#")
				.append($("<div></div>")
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
				)
			;

			imageContainer.append(overlay);
		});

		return imageContainer;
	},

	getImageContainers = function(jumbos, type) {
		var imageContainers = [];
		$.each(jumbos, function(idx, jumbo){
			imageContainers.push(getImageContainer(jumbo.image, type));
		});
		return imageContainers;
	},

	getJumbotronContainer = function(json, type) {

		var slickOptions = {};

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

		return $("<div></div>")
			.addClass(settings.jumbotronClass)
			.addClass(type + "-" + settings.jumbotronClass)
			.append(getImageContainers(json.jumbos, type))
			.slick($.extend({}, settings.slickDefaults, slickOptions))
			.on("afterChange", function(event, slick, i){

			})
		;

	},

	renderJumbotrons = function(width) {

		desktopJumbotron.hide();
		tabletJumbotron.hide();
		mobileJumbotron.hide();

		if(width > json.tabletWidth) {
			desktopJumbotron.show();
		} else if(width > json.mobileWidth) {
			tabletJumbotron.show();
		} else {
			mobileJumbotron.show();
		}

		//TODO: Overlay
	},

	onResize = function(event) {
		renderJumbotrons(this.width());
	};

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