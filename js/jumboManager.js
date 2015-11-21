/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManager = (function($){

	var ID = "Id",
	JUMBOS = "jumbos",
	JUMBO = "jumbo",
	IMAGE_CONTAINER = "image-container",
	PREVIEW_IMAGE_CONTAINER = "preview-image-container",
	CANVAS_IMAGE_CONTAINER = "canvas-image-container",
	settings = {},
	ui = {},
	jumbos = [],
	defaultOptions = {
		canvasId: "jumbomanager-canvas",
		previewsId: "jumbomanager-previews",
		controlsId: "jumbomanager-controls",
		mainCanvasId: "jumbomanager-main-canvas",
		gridToggleId: "jumbomanager-grid-toggle",
		gridVGapId: "jumbomanager-grid-vgap",
		gridHGapId: "jumbomanager-grid-hgap"
	},

	Jumbo = {
		getImageUrl: function(jumbo){
			return jumbo.image;
		}
	},
	
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

	validateJumbos = function() {
		return jumbos && !!jumbos.length;
	},

	renderImage = function(imageUrl, $parent, className, clickListener) {
		$parent
			.append($("<div></div>")
				.addClass(IMAGE_CONTAINER)
				.addClass(!!className ? className : "")
				.append($("<img></img>")
					.prop("src", imageUrl)
				)
				.off("click")
				.on("click probe", clickListener)
			)
		;	
	},

	getImageContainer = function(imageUrl) {
		return $("<div></div>")
			.addClass(IMAGE_CONTAINER)
			.append($("<img></img>")
				.prop("src", imageUrl)
			)
	},

	renderPreviewImages = function() {

		var imageClickListener = function(event) {
			event.stopPropagation();
			event.preventDefault();
			var imageUrl = $(this).find("img").prop("src");
			renderCanvasImage(imageUrl);
		};
			
		$.each(jumbos, function(idx, j){
			var imageUrl = Jumbo.getImageUrl(j);
			ui.$previews.append(
				getImageContainer(imageUrl)
					.addClass(PREVIEW_IMAGE_CONTAINER)
					.data(JUMBO, j)
					.on("click probe", imageClickListener)
			);
		});
	},

	renderCanvasImage = function(imageUrl) {
		// Remove existing image
		ui.$canvas.find("."+IMAGE_CONTAINER).remove();
		renderImage(imageUrl, ui.$canvas, CANVAS_IMAGE_CONTAINER);
	},

	loadJumbos = function() {
		var dfd = $.Deferred();

		$.when(jumboManagerREST.ajaxFetchJumbos()).done(function(data){
			jumbos = data;
			dfd.resolve();
		});

		return dfd;
	};

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
			initSettings(options);
			globalDisableSelection();
			if(validateUi()) {

				initMainCanvas();
				initControls();

				//log loading images sources
				$.when(loadJumbos()).done(function(){
					if(validateJumbos) {
						//unlog loading images sources
						//log render images
						renderPreviewImages();
					} else {
						//log jumbo error
						alert("Jumbo error")
					}
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