## CiteKit jQuery Plugin

To add to your site download the *jquery.citekit.js* file and include it
like below.
`````````````````````
<link rel="stylesheet" href="http://folio.dyndns-web.com/citekit/css/cite-elements.css" type="text/css">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" ></script>
	<script type="text/javascript" src="jquery.citekit.js"> </script>
	<script>
	$(function() {
		$(document).ckLoad();
		$("#citekit-sources").ckDisplayServiceInfo();
	});
	</script>

``````````````````````
