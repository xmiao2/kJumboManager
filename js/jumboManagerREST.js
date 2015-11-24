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
						image: {
							url: "img/1.jpg",
							bgColor: "lightblue"
						},
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
						image: {
							url: "img/2.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/3.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/4.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/5.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/6.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue"
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue"
						}
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