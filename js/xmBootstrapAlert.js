/**
 * Draws a bootstrap alert box
 * @author: Xiaohang Miao (xmiao2@ncsu.edu)
 */

"use strict";

window.xmBootstrapAlert = window.xmBootstrapAlert || (function($){

	var UID = "xmiaoBootstrapAlert",
	settings = {},
	_defaults = {
		mode: "success",	// success, warning, info, danger
		prependTo: "body",
		className: "",
		content: "Alert message will appear here",
		showClose: true,
		closeText: "&times;",
		fade: false,
		fadeTime: 2000,
		disablePromise: {}
	},

	_render = function(options) {

		settings = $.extend({}, _defaults, options);

		// Remove existing alertBox if there is any
		$("#"+UID).remove();

		// Render the alert box
		var alertBox = $("<div></div>")
			.prop("id", UID)
			.addClass("alert")
			.addClass("alert-" + settings.mode)
			.addClass(settings.className)
			.html(settings.content)
			.css({
				"position": "absolute",
				"z-index": "999",
				"left": "50%",
				"transform": "translateX(-50%)"
			})
			.prependTo(settings.prependTo)
		;

		// Render the close button
		if(settings.showClose) {
			alertBox
				.prepend($("<a></a>")
					.prop("href", "javascript:void(0)")
					.addClass("close")
					.attr("data-dismiss", "alert")
					.attr("aria-label", "close")
					.html(settings.closeText)
				)
			;
		}

		return alertBox;
	};

	return {
		alert: function(options) {
			var alert = _render(options);

			$.when(settings.disablePromise).done(function() {
				if(settings.fade) {
					setTimeout(function(){
						alert.fadeOut();
					}, settings.fadeTime)
				}
			});
		}
	}

})(jQuery);