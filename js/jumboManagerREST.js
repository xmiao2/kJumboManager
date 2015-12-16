/**
 * @author: James Miao (xmiao2@ncsu.edu)
 */
"use strict";

window.jumboManagerREST = window.jumboManagerREST || (function($){

	var delay = 0;	// Simulate how good the latency is

	var imageNewUrl = "img/image_new.jpg";
	var PREVIEW_KEY = "jumbomanager-preview";

	return {
		// callback param: json array of image path
		ajaxFetchJumbos: function() {
			var dfd = $.Deferred();
			var jumbos = {
				desktopMaxHeight: 440,
				tabletMaxHeight: 800,
				mobileMaxHeight: 800,
				autoplaySpeed: 0,
				tabletWidth: 900,
				mobileWidth: 600,
				jumbos: [
					{
						image: {
							desktopUrl: "img/Ani-Nov-10-D.jpg",
							tabletUrl: "img/Ani-Nov-10-T.jpg",
							mobileUrl: "img/Ani-Nov-10-T.jpg",
							slideUrl: "http://google.com",
							bgColor: "#ffffff"
						},
						button: {
							hAlign: "78.6%",
							vAlign: "70%", 
							vGap: "1rem",
							hGap: "1rem",
							fontSize: "1rem",
							minWidth: "17%",
							orientation: "horizontal",
							buttons: [
								{
									visible: true,
									text: "Silver",
									url: "/",
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
							bgColor: "#aa7777"
						},
						button: {
							hAlign: "91.3%",
							vAlign: "50%", 
							vGap: "1rem",
							hGap: "1rem",
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
							tabletUrl: "img/Clearance-T.jpg",
							mobileUrl: "img/Clearance-T.jpg",
							bgColor: "rgba(0,0,0,0.8)"
						},
						button: {
							hAlign: "50%",
							vAlign: "89%", 
							vGap: "1rem",
							hGap: "1rem",
							fontSize: "1rem",
							minWidth: "50%",
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
							tabletUrl: "img/Holiday-Nov-10-T.jpg",
							mobileUrl: "img/Holiday-Nov-10-T.jpg",
							bgColor: "#791516"
						},
						button: {
							hAlign: "21%",
							vAlign: "75%", 
							vGap: "1rem",
							hGap: "1rem",
							fontSize: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#d43085",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#d43085",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							desktopUrl: "img/LG-Nov-10-D.jpg",
							tabletUrl: "img/LG-Nov-10-T.jpg",
							mobileUrl: "img/LG-Nov-10-T.jpg",
							bgColor: "lightblue"
						},
						button: {
							hAlign: "75%",
							vAlign: "77%", 
							vGap: "1rem",
							hGap: "1rem",
							fontSize: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: true,
									text: "primary",
									url: "#",
									color: "#fff",
									bgColor: "rgba(0,0,0,0)"
								},
								{
									visible: true,
									text: "secondary",
									url: "#",
									color: "#fff",
									bgColor: "rgba(0,0,0,0)"
								}
							]
						}
					},
					{
						image: {
							desktopUrl: "img/Pandora-Nov-10-D.jpg",
							tabletUrl: "img/Pandora-Nov-10-T.jpg",
							mobileUrl: "img/Pandora-Nov-10-T.jpg",
							bgColor: "lightblue"
						},
						button: {
							hAlign: "76%",
							vAlign: "62%", 
							vGap: "3rem",
							fontSize: "2rem",
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
							tabletUrl: "img/Pre-Black-Nov-19-T.jpg",
							mobileUrl: "img/Pre-Black-Nov-19-T.jpg",
							bgColor: "#791516"
						},
						button: {
							hAlign: "75%",
							vAlign: "70%", 
							vGap: "1rem",
							hGap: "1rem",
							fontSize: "1rem",
							minWidth: "15%",
							buttons: [
								{
									visible: false,
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
				]
			}

			setTimeout(function(){
				dfd.resolve(jumbos);
			}, delay);

			return dfd.promise();
		},

		ajaxFetchDefaultJumbo: function() {
			var DEFAULT_JUMBO_JSON = {
				image: {
					desktopUrl: imageNewUrl,
					tabletUrl: imageNewUrl,
					mobileUrl: imageNewUrl,
					bgColor: "#ffffff"
				},
				button: {
					hAlign: "78.6%",
					vAlign: "70%", 
					vGap: "1rem",
					fontSize: "1rem",
					minWidth: "17%",
					buttons: [
						{
							visible: false,
							text: "Silver",
							url: "#",
							color: "black",
							bgColor: "rgba(127, 140, 234, 0.19)"
						},
						{
							visible: false,
							text: "Gold",
							url: "#",
							color: "black",
							bgColor: "rgba(231, 231, 156, 0.39)"
						}
					]
				}
			};
			return DEFAULT_JUMBO_JSON;
		},

		ajaxSaveCanvas: function(json) {
			var dfd = $.Deferred();
			setTimeout(function(){
				window.localStorage.setItem(PREVIEW_KEY, JSON.stringify(json));
				dfd.resolve("Canvas Saved");
			}, delay);
			return dfd.promise();
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