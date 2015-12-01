/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManagerREST = window.jumboManagerREST || (function($){

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
							mobileWidth: 700,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "black",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "black",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/Bridal-D.jpg",
							bgColor: "#aa7777",
							mobileWidth: 400,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: false,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/Clearance-D.jpg",
							bgColor: "rgba(0,0,0,0.8)",
							mobileWidth: 500,
							tabletWidth: 700
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/Holiday-Nov-10-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/LG-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/Pandora-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/Pre-Black-Nov-19-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/invalidurl.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/8.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/10.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							url: "img/7.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "left",
							vAlign: "middle", 
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#ffffff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
				]
			}

			setTimeout(function(){
				dfd.resolve(jumbos.jumbos);
			}, delay);

			return dfd;
		},

		ajaxUploadImage: function(file) {
			// var dfd = $.Deferred();

			// var response

			// setTimeout(function(){
			// 	dfd.resolve(response.);
			// }, delay);

			// return dfd;
		}
	}
})(jQuery);