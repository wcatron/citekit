(function( $ ) {
	
	var js_url = ''; //Default public JS folder
 
    $.fn.ckLoad = function() {
 	   	var opts = $.extend( {}, $.fn.ckLoad.defaults, options );
        return this.filter( "blockquote" ).each(function() {
            $( this ).append( " (" + $( this ).attr( "href" ) + ")" );
        });
 
    };
	
	$.fn.displayServiceInfo = function () {
		
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
	}
 
	// Plugin defaults
	$.fn.ckLoad.defaults = {
		"source":"svc-folio-cts",
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
  	  	
	};
 
}( jQuery ));