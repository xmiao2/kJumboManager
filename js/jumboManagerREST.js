/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManagerREST = window.jumboManagerREST || (function($){

	var delay = 0;	// Simulate how good the latency is

	return {
		// callback param: json array of image path
		ajaxFetchJumbos: function() {
			var dfd = $.Deferred();
			var jumbos = {
				jumbos: [
					{
						image: {
							desktopUrl: "img/Ani-Nov-10-D.jpg",
							tabletUrl: "img/Ani-Nov-10-T.jpg",
							mobileUrl: "img/Ani-Nov-10-T.jpg",
							bgColor: "#ffffff",
							mobileWidth: 700,
							tabletWidth: 900
						},
						button: {
							hAlign: "78.6%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
							minWidth: "17%",
							buttons: [
								{
									visible: true,
									text: "Silver",
									url: "#",
									color: "black",
									bgColor: "rgba(127, 140, 234, 0.19)"
								},
								{
									visible: true,
									text: "Gold",
									url: "#",
									color: "black",
									bgColor: "rgba(231, 231, 156, 0.39)"
								}
							]
						}
					},
					{
						image: {
							desktopUrl: "img/Bridal-D.jpg",
							tabletUrl: "img/Bridal-T.jpg",
							mobileUrl: "img/Bridal-T.jpg",
							bgColor: "#aa7777",
							mobileWidth: 400,
							tabletWidth: 900
						},
						button: {
							hAlign: "91.3%",
							vAlign: "50%", 
							vGap: "1rem",
							fontSize: "2.4rem",
							minWidth: "26.3%",
							buttons: [
								{
									visible: true,
									text: "Click here to shop",
									url: "#",
									color: "#ffffff",
									bgColor: "#bc7a7a"
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
							desktopUrl: "img/Clearance-D.jpg",
							bgColor: "rgba(0,0,0,0.8)",
							mobileWidth: 500,
							tabletWidth: 700
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/Holiday-Nov-10-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/LG-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/Pandora-Nov-10-D.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/Pre-Black-Nov-19-D.jpg",
							bgColor: "#791516",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/invalidurl.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/9.jpg",
							bgColor: "lightblue",
							mobileWidth: 600,
							tabletWidth: 900
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							fontSize: "1rem",
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
							desktopUrl: "img/10.jpg",
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
							desktopUrl: "img/7.jpg",
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
							desktopUrl: "img/7.jpg",
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
							desktopUrl: "img/8.jpg",
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
							desktopUrl: "img/9.jpg",
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
							desktopUrl: "img/10.jpg",
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
							desktopUrl: "img/7.jpg",
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
							desktopUrl: "img/7.jpg",
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
							desktopUrl: "img/8.jpg",
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
							desktopUrl: "img/9.jpg",
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
							desktopUrl: "img/10.jpg",
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
							desktopUrl: "img/7.jpg",
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