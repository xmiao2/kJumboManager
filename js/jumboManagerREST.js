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
							url: "img/Ani-Nov-10-D.jpg",
							bgColor: "#ffffff",
							mobileWidth: 600,
							tabletWidth: 900
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
							url: "img/Bridal-D.jpg",
							bgColor: "#aa7777",
							mobileWidth: 400,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/Clearance-D.jpg",
							bgColor: "rgba(0,0,0,0.8)",
							mobileWidth: 500,
							tabletWidth: 700
						}
					},
					{
						image: {
							url: "img/Holiday-Nov-10-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/LG-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/Pandora-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/Pre-Black-Nov-19-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
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