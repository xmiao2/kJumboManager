/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";
window.globalDisableSelection = window.globalDisableSelection || (function($){
	return function() {
		$("body").disableSelection();

		$("body").delegate('input[type=text],textarea', "focus", function () {
			$("body").enableSelection();
		});

		$("body").delegate("input[type=text],textarea", "blur", function () {
			$("body").disableSelection();
		});
	}
})(jQuery);