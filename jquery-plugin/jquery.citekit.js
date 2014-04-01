(function( $ ) {
	
	var js_url = ''; //Default public JS folder
 
    $.fn.ckLoad = function(options) {
 	   	var opts = $.extend( {}, $.fn.ckLoad.defaults, options );
        
		$.fn.ckLoad.assignIDs(this);
 	   	$.fn.ckLoad.fixLinks(this);
		$.fn.ckLoad.fixImages(this);
		
		$.fn.ckLoad.loadBlockquotes(this);
    };
	
	$.fn.ckDisplayServiceInfo = function () {
		
		var dataOk = true;
		
		// TO-DO validation that data really is okay.
		
		// Log current data to console
		var defaults = $.fn.ckLoad.defaults;
		var message = "<strong>Services</strong><br/>";
		for (i in defaults.sources){
			message = message + i + " : " + JSON.stringify(defaults.sources[i]);
			message = message + "<br/>";
		}
		
		for (i in defaults.sources){
				message = message + "Collection-service " + i + " uses Image-service " + defaults.sources[i]["cite-img"] + "<br/>";
		}
		for (i in defaults.sources){
				message = message + "Collection-service " + i + " links to Collection-service " + defaults.sources[i]["cite-collection"] + "<br/>";
		}

		message = message + "<strong>Default Source: " + defaults.source + "</strong><br/>";
		
		$(this).html(message);
		//citekit_log("Data loaded: " + dataOk);
		return dataOk;
	};
	
	$.fn.ckLoadBlockquote = function () {
		var classNames = $.fn.ckLoad.defaults.classNames;
		var xsltParams = {};
		$(this).addClass("citekit-waiting");
		// prepare params for xslt, if any
		if ( $(this).hasClass( classNames["cite"])){ 
			xsltParams = getCollectionParams(this);
		}
		if ( $(this).hasClass( classNames["citeimg"])){ 
			//console.log("Getting params for id: " + $(this).attr("id"));
			xsltParams = getImageParams(this);
		}
		thisURLString = $(this).ckGetURLString();
		if (thisURLString.substring(0,7) == "http://"){
			pathToXSLT = getXSLTString(this);
			loadXMLDoc( thisURLString, pathToXSLT, this, xsltParams);
		} else {
			$(this).append(" (service not found for this URN)");
			$(this).removeClass("citekit-waiting");
		}
	}
	
	$.fn.ckGetURLString = function () {
		var thisURN = "";
		var thisType = "";
		var thisService = "";
		var thisString = "";
		
		var classNames = $.fn.ckLoad.defaults.classNames;
		
		// identify the type of link
	    for ( whichClass in classNames ){
			if (this.hasClass(classNames[whichClass])) {
				thisType = whichClass;
			}
		}

		// Get the plain URN from the attribute
		if (this.attr("src")) {
			thisURN = this.attr("src");
		} else if ( this.attr("cite")) {
			thisURN = this.attr("cite");
		} else if ( this.attr("href")) {
			thisURN = this.attr("href");
		}
		
		var sources = $.fn.ckLoad.defaults.sources;
		
		//If a service is specified, grab that URL-string
		for (whichService in sources){
			if (this.hasClass(whichService) ){
				switch (thisType) {
					case "cts":
						thisString = sources[whichService]["cite-text"] + $.fn.ckLoad.defaults.getPassagePlus;
						break;
					case "citeimg":
						thisString = sources[whichService]["cite-img"] + $.fn.ckLoad.defaults.getImagePlus;
						break;
					case "cite":
						thisString = sources[whichService]["cite-collection"] + $.fn.ckLoad.defaults.getObjectPlus;
						break;
				}
			}
		}

		//Otherwise, grab the default URL-string
		if ( thisString == ""){ 
			switch (thisType) {
				case "cts":
					thisString = sources[$.fn.ckLoad.defaults.source]["cite-text"] + $.fn.ckLoad.defaults.getPassagePlus;
					break;
				case "citeimg":
					thisString = sources[$.fn.ckLoad.defaults.source]["cite-img"] + $.fn.ckLoad.defaults.getImagePlus;
					break;
				case "cite":
					thisString = sources[$.fn.ckLoad.defaults.source]["cite-collection"] + $.fn.ckLoad.defaults.getObjectPlus;
					break;
			}
		}

		//Assemble and return
		return thisString + thisURN;
	}
	
	$.fn.ckLoad.loadBlockquotes = function (elm) {
		var classNames = $.fn.ckLoad.defaults.classNames;
		
		for (whichClass in classNames) {
			var thisURLString = "";
			var className = classNames[whichClass];
			var jqString = elm.selector + " blockquote." + className;
			var xsltParams = {};	

			$( jqString ).each(function(index){
				$(this).ckLoadBlockquote();
				/*$(this).addClass("citekit-waiting");
				// prepare params for xslt, if any
				if ( $(this).hasClass( classNames["cite"])){ 
					xsltParams = getCollectionParams(this);
				}
				if ( $(this).hasClass( classNames["citeimg"])){ 
					//console.log("Getting params for id: " + $(this).attr("id"));
					xsltParams = getImageParams(this);
				}
				thisURLString = $(this).ckGetURLString();
				if (thisURLString.substring(0,7) == "http://"){
					pathToXSLT = getXSLTString(this);
					loadXMLDoc( thisURLString, pathToXSLT, this, xsltParams);
				} else {
					$(this).append(" (service not found for this URN)");
					$(this).removeClass("citekit-waiting");
				}*/
			});
		}
	}
	
	function loadXMLDoc (url, xsl, elm, xsltParams) {
		var ctsResponse;
		var xmlhttp = new XMLHttpRequest();  
		xmlhttp.timeout = 120000;
		xmlhttp.open("GET", url, true);
		xmlhttp.onreadystatechange = function() {  
			if(xmlhttp.readyState == 4) {
			  if (xmlhttp.status == 200){
					  ctsResponse = xmlhttp.responseXML; 
					  loadXSLT(ctsResponse, xsl, elm, xsltParams);
			  } else {
					 blockquoteError(elm,url);
			  }
			}
		}; 	
		xmlhttp.send(null);  
	}
	
	function loadXSLT (ctsResponse, xsl, elm, xsltParams) {
		var myURL = xsl;
	
		var xslhttp = new XMLHttpRequest();  
		xslhttp.open("GET", xsl, true);
		xslhttp.send('');  
	
		xslhttp.onreadystatechange = function() {  
			if(xslhttp.readyState == 4) {
			  xsltData = xslhttp.responseXML;   		
			  processXML(ctsResponse, xsltData,elm, xsltParams);
	  		}	
		}; 
	}
	
	function processXML (ctsResponse, xsltData, elm, xsltParams) {
		var processor = null;
		var tempData = null;
		var tempHTML = "";

		var temp_gbi = xsltParams["imageService"] + $.fn.ckLoad.defaults.getBinaryImage;
		var temp_gip = xsltParams["imageService"] + $.fn.ckLoad.defaults.getImagePlus;
		var temp_gpp = xsltParams["ctsService"] + $.fn.ckLoad.defaults.getPassagePlus;
		var temp_gop = xsltParams["collectionService"] + $.fn.ckLoad.defaults.getObjectPlus;
		var temp_ict = xsltParams["ict"];

		processor = new XSLTProcessor();

		if ( (xsltParams["imageService"] != undefined) && (xsltParams["imageService"] != "" )) {
			processor.setParameter(null,'ImageServiceGIP',temp_gip);
		}
		if ( (xsltParams["imageService"] != undefined) && (xsltParams["imageService"] != "" )) {
			processor.setParameter(null,'ImageServiceThumb',temp_gbi);
		}
		if ( (xsltParams["image-w"] != undefined) && (xsltParams["image-w"] != "" )) {
			//console.log("Setting image-w param " + xsltParams["image-w"] );
			processor.setParameter(null,'image-w',xsltParams["image-w"]);
		}
		if ( (xsltParams["ctsService"] != undefined) && (xsltParams["ctsService"] != "" )) {
			processor.setParameter(null,'TextServiceGPP',temp_gpp);
		}
		if ( (xsltParams["collectionService"] != undefined) && (xsltParams["collectionService"] != "" )) {
			processor.setParameter(null,'CollectionServiceGOP',temp_gop);
		}
		if ( (xsltParams["ict"] != undefined) && (xsltParams["ict"] != "" )) {
			processor.setParameter(null,'ict-url',temp_ict);
		}

		processor.importStylesheet(xsltData);
		tempData = processor.transformToDocument(ctsResponse);
		tempHTML = new XMLSerializer().serializeToString(tempData);	
		putTextOntoPage(tempHTML,elm);
		
	}
	
	function putTextOntoPage (htmlText,elm) {
		$(elm).html(htmlText);
		$(elm).removeClass("citekit-waiting");
		// Catch any Markdown fields
		//citekit_processMarkdown(elemId); TO-DO coming back to this
		$(elm).addClass("citekit-complete");
	}
	
	function blockquoteError (elm, url) {
		var message = "";
		message += "<span class='citekit-error'>Error loading ";
		message += $(elm).attr("cite") + " from URL <code>";
		message += url + "</code>.</span>";
		$(elm).html(message);
		$(elm).removeClass("citekit-waiting");
	}
	
	$.fn.ckLoad.assignIDs = function (elm) {
		var classNames = $.fn.ckLoad.defaults.classNames;
		for ( whichClass in classNames){
			var className = classNames[whichClass];
			$(elm.selector+' blockquote.' + className).each(function(index){
				$(this).attr("id",className + index + "blockquote");
			});
			$(elm.selector+' img.' + className).each(function(index){
				$(this).attr("id",className + index + "img");
			});
			$(elm.selector+' a.' + className).each(function(index){
				$(this).attr("id",className + index + "link");
			});
		}
	};
	$.fn.ckLoad.fixLinks = function (elm) {
		//citekit_log( "Fixing links..." );
		var classNames = $.fn.ckLoad.defaults.classNames;
		for (whichClass in classNames){
			var className = classNames[whichClass];
			var jqString = elm.selector+" a." + className;
			$( jqString ).each(function(index){
				if ( $(this).attr("href").substring(0,7) != "http://" ){
					var thisURLString = $(this).ckGetURLString();
					if (thisURLString.substring(0,7) != "http://"){
						$(this).append(" (service not found for this URN)");
					} else {
						$(this).attr("href", thisURLString);
					}
				}
			});
		}
	};
	$.fn.ckLoad.fixImages = function (elm) {
		jqString = elm.selector+" img." + $.fn.ckLoad.defaults.classNames.citeimg;
		$( jqString ).each(function(index){
			//citekit_log( $(this).attr("src"));
			var urnString = $(this).attr("src");
			var classString = $(this).attr("class");
			var idString = $(this).attr("id");
			var altString = $(this).attr("alt");
			$(this).replaceWith("<blockquote class='" + classString + "' cite='" + urnString + "' id='" + idString + "' alt='" + altString + "'>" + urnString + "</blockquote>");
		});
	};
	
	function getImageParams (obj) {
		var thisSource = $.fn.ckLoad.defaults.source; //starts with default
		var thisPath = "";
		var thisICT = "";
		var returnValue = {};
		//If a service is specified, grab that URL-string
		var sources = $.fn.ckLoad.defaults.sources;
		
		for (whichSource in sources){
			if ($(obj).hasClass(whichSource) ){
				thisSource = whichSource;
			}
		}
		
		//Strip off "image" from image-service URL"
		thisPath = sources[thisSource]['cite-img'].substr(0, sources[thisSource]['cite-img'].indexOf('/image')); //this isn't very portable
		thisICT = thisPath + "/" +  $.fn.ckLoad.defaults.citekit_var_qs_ICT;
		returnValue["ict"] = thisICT;
		
		returnValue["image-w"] = sources[$.fn.ckLoad.defaults.source]['image-w'];
		console.log( $(obj) + " :: source=" + thisSource + " :: citekit_image_w=" + returnValue['image-w']);
		//console.log ("Returning width = " + returnValue["image-w"]);
		
		return returnValue;
	}
	
	function getCollectionParams(obj) {
		var thisSource = $.fn.ckLoad.defaults.source;
		var thisImgSvc = "";
		var thisCollSvc = "";
		var thisCtsSvc = "";
		var returnValue = {};

		// Get service ID
		//If a service is specified, grab that URL-string
		var sources = $.fn.ckLoad.defaults.sources;
		for (whichSource in sources){
			if ($(obj).hasClass(whichSource) ){
				thisSource = whichSource;
			}
		}
		/*
		 * functionality removed. Select image services based on sources. 
		 * Create specific sources for specific image services. If this
		 * is not the proper way please create an issue. Seems redundant.
		
		//Get any assigned image service
		for (whichImgService in citekit_var_services){
			if ( $("#" + whichImgService).hasClass( citekit_var_classNames["citeimg"])){
				if ( $("#" + thisService).hasClass(whichImgService)  ){
					thisImgSvc = whichImgService;
				}
			}
		}

		//Get any assigned text service
		for (whichCtsService in citekit_var_services){
			if ( $("#" + whichCtsService).hasClass( citekit_var_classNames["cts"])){
				if ( $("#" + thisService).hasClass(whichCtsService)  ){
					thisCtsSvc = whichCtsService;
				}
			}
		}

		//Get any assigned collection service
		for (whichCollService in citekit_var_services){
			if ( $("#" + whichCollService).hasClass( citekit_var_classNames["cite"])){
				if ( $("#" + thisService).hasClass(whichCollService)  ){
					thisCollSvc = whichCollService;
				}
			}
		}
		
		if (thisImgSvc == ""){ thisImgSvc = citekit_var_default_img; }
		if (thisCtsSvc == ""){ thisCtsSvc = citekit_var_default_cts; }
		if (thisCollSvc == ""){ thisCollSvc = citekit_var_default_coll; }
		
		*/
		
	    returnValue["image-w"] = sources[thisSource]['image-w'];
        returnValue["imageService"] = thisSource;
		returnValue["collectionService"] = thisSource;
		returnValue["ctsService"] = thisSource;
		return returnValue;
	}
	
	function getXSLTString(obj) {
		var thisType = "";
		var thisString = "";
		// identify the type of link
		var classNames = $.fn.ckLoad.defaults.classNames;
	    for ( whichClass in classNames){
			if ($(obj).hasClass(classNames[whichClass])) {
				thisType = whichClass;
			}
		}
		switch (thisType){
			case "cts":
				thisString = $.fn.ckLoad.defaults.pathTextXslt;
				break;
			case "citeimg":
				thisString = $.fn.ckLoad.defaults.pathImgXslt;
				break;
			case "cite":
				thisString = $.fn.ckLoad.defaults.pathCollXslt;
				break;
		}
		return thisString;
	}
	
	// Plugin defaults
	$.fn.ckLoad.defaults = {
		"source":"svc-folio-cts", //Defualt source to use out of the sources
		"sources":{
			"svc-folio-cts":{//Folio Server at Furman: citeservlet
				"cite-img":"http://folio.furman.edu/citeservlet/images",
				"cite-text":"http://folio.furman.edu/citeservlet/texts",
				"cite-collection":"http://folio.furman.edu/citeservlet/collections",
				"image-w":"500"
			},
			"svc-beta-cts":{//Beta Server in Houston: citeservlet 
				"cite-text":"http://beta.hpcc.uh.edu/tomcat/hmtcite/texts",
				"cite-img":"http://beta.hpcc.uh.edu/tomcat/hmtcite/images",
				"cite-collection":"http://beta.hpcc.uh.edu/tomcat/hmtcite/collections",
				"image-w":"400"
			}
		},	
		"classNames":{
			"cts":"cite-text",
			"citeimg":"cite-image",
			"cite":"cite-collection"
		},
		"getPassagePlus":"?request=GetPassagePlus&urn=",
		"getObjectPlus":"?request=GetObjectPlus&urn=",
		"getImagePlus":"?request=GetImagePlus&urn=",
		"getBinaryImage":"?request=GetBinaryImage&urn=",
		"qsICT":"ict.html?urn=",
		"pathTextXslt":"http://folio.dyndns-web.com/citekit/xslt/citekit-gp.xsl",
		"pathImgXslt":"http://folio.dyndns-web.com/citekit/xslt/citekit-gip.xsl",
		"pathCollXslt":"http://folio.dyndns-web.com/citekit/xslt/xslt/citekit-coll.xsl"
	};
 
}( jQuery ));