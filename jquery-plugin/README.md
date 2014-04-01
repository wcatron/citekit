## CiteKit jQuery Plugin

To add to your site download the *jquery.citekit.js* file and include it
like below.

    <link rel="stylesheet" href="http://folio.dyndns-web.com/citekit/css/cite-elements.css" type="text/css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" ></script>
    <script type="text/javascript" src="jquery.citekit.js"> </script>
    <script>
        $(function() {
            $(document).ckLoad();
            $("#citekit-sources").ckDisplayServiceInfo();
        });
    </script>

## Functions

**\$.ckLoad**

Properly assigns IDs to the block quotes, fixes the links, and loads the
data inside of a selector.

**\$.ckDisplayServiceInfo**

Displays information about the services/sources available for loading.

**\$.ckLoadBlockquote**

### Parameters

Located in the jquery plugin file the defaults can be changed to use
your own cts, classes, and more technical things.

-   *source* - default source for urns

-   *sources* - array of different sources

    -   *cite-img* - image url

    -   *cite-text* - texts url

    -   *cite-collection* - collections url

For complete list look at the jquery plugin file.
