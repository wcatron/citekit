(function( $ ) {
	
	var js_url = ''; //Default public JS folder
 
    $.fn.ckLoad = function(options) {
 	   	var opts = $.extend( {}, $.fn.ckLoad.defaults, options );
        
		$.fn.ckLoad.assignIDs();
 	   	$.fn.ckLoad.fixLinks();
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
	
	$.fn.ckLoad.loadXSLT = function (ctsResponse, xsl, elemId, xsltParams) {
		var myURL = xsl;
	
		var xslhttp = new XMLHttpRequest();  
		xslhttp.open("GET", xsl, true);
		xslhttp.send('');  
	
		xslhttp.onreadystatechange = function() {  
			if(xslhttp.readyState == 4) {
			  xsltData = xslhttp.responseXML;   		
			  citekit_processXML(ctsResponse, xsltData, elemId, xsltParams);
	  		}	
		}; 
	};
	
	$.fn.ckLoad.assignIDs = function () {
		var classNames = $.fn.ckLoad.defaults.classNames;
		for ( whichClass in classNames){
			var className = classNames[whichClass];
			$('blockquote.' + className).each(function(index){
				$(this).attr("id",className + index + "blockquote");
			});
			$('img.' + className).each(function(index){
				$(this).attr("id",className + index + "img");
			});
			$('a.' + className).each(function(index){
				$(this).attr("id",className + index + "link");
			});
		}
	};
	$.fn.ckLoad.fixLinks = function () {
		//citekit_log( "Fixing links..." );
		var classNames = $.fn.ckLoad.defaults.classNames;
		for (whichClass in classNames){
			var className = classNames[whichClass];
			var jqString = "a." + className;
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
	
	// Plugin defaults
	$.fn.ckLoad.defaults = {
		"source":"svc-folio-cts", //Defualt source to use out of the sources
		"sources":{
			"svc-folio-cts":{//Folio Server at Furman: citeservlet
				"cite-img":"http://folio.furman.edu/citeservlet/images",
				"cite-text":"http://folio.furman.edu/citeservlet/texts",
				"cite-collection":"http://folio.furman.edu/citeservlet/collections"
			},
			"svc-beta-cts":{//Beta Server in Houston: citeservlet 
				"cite-text":"http://beta.hpcc.uh.edu/tomcat/hmtcite/texts",
				"cite-img":"http://beta.hpcc.uh.edu/tomcat/hmtcite/images",
				"cite-collection":"http://beta.hpcc.uh.edu/tomcat/hmtcite/collections"
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
		"getBinaryImage":"?request=GetBinaryImage&urn="
	};
 
}( jQuery ));


function citekit_getUrlString( elementId ){
		
}
