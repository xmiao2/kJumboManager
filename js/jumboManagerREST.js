/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManagerREST = (function($){

	var delay = 250;	// Simulate how good the latency is

	return {
		// callback param: json array of image path
		ajaxFetchJumbos: function() {
			var dfd = $.Deferred();
			var jumbos = {
				jumbos: [
					{
						image: "img/1.jpg",
						/*
						image: {
							url: "asdf",
							width: 0;
							height: 0;
						}
						*/
						buttons: [
							{
								x: 0,
								y: 0,
								width: 0,
								height: 0,
								text: "Test",
								url: "#"
							}
						]
					},
					{
						image: "img/2.jpg"
					},
					{
						image: "img/3.jpg"
					},
					{
						image: "img/4.jpg"
					},
					{
						image: "img/5.jpg"
					},
					{
						image: "img/6.jpg"
					},
					{
						image: "img/7.jpg"
					},
					{
						image: "img/8.jpg"
					},
					{
						image: "img/9.jpg"
					},
					{
						image: "img/10.jpg"
					},
					{
						image: "img/3.jpg"
					},
					{
						image: "img/4.jpg"
					},
					{
						image: "img/5.jpg"
					},
					{
						image: "img/6.jpg"
					},
				]
			}

			setTimeout(function(){
				dfd.resolve(jumbos.jumbos);
			}, delay);

			return dfd;
		}
	}
})(jQuery);