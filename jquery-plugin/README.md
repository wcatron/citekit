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

Then within the body of the page.

**Example Link**

    <a href="urn:cts:greekLit:tlg0012.tlg001.msA:2.1-2.25" 
        class="cite-text”>urn:cts:greekLit:tlg0012.tlg001.msA:2.1-2.25</a>

**Example Blockquote**

    <blockquote class="cite-text source-name"
        cite="urn:cts:greekLit:tlg0012.tlg001.msA:2.1-2.25">
            urn:cts:greekLit:tlg0012.tlg001.msA:2.1-2.25 (named service)</blockquote>

## Functions

**$.ckLoad**

Properly assigns IDs to the block quotes, fixes the links, and loads the
data inside of a selector.

**$.ckDisplayServiceInfo**

Displays information about the services/sources available for loading.

**$.ckLoadBlockquote**

Loads the data trying to be retrieved into the blockquote element. This
can be used for instance after loading specific data onto the page.

### Parameters

Located in the jquery plugin file the defaults can be changed to use
your own cts, classes, and more technical things.

-   *source* - default source for urns

-   *sources* - array of different sources

    -   *cite-img* - image url
    -   *cite-text* - texts url
    -   *cite-collection* - collections url

For complete list look at the jquery plugin file.

### Changes from Original CiteKit

**Services vs Sources**

The distinction between services and sources was unclear. They have now
been changed to sources which are defined in the plugins default
settings instead of imported from a div. This change conforms better
with the jQuery plugin model which supports standalone functionality and
the use of defaults.

**Default Sources**

It appeared from the original CiteKit code that there was the ability to
assign default sources for each type of citekit element (cts,citeimg,
cite) however that added a layer of complexity, and many if statements,
and seemed more reasonable to simplify the process. Now set one default
source (which contains a url for each type of element) and then diverge
from that source as needed by citing the source name instead of a
setting individual defaults.

    // Example
    "sources":{
        "my-default-cts":{
            "cite-img":"http://folio.furman.edu/citeservlet/images", 
            "cite-text":"http://folio.furman.edu/citeservlet/texts", 
            "cite-collection":"http://folio.furman.edu/citeservlet/collections"
        },
        // Used for specific texts I want to grab.
        "my-divergent-cts":{
                "cite-text":"http://beta.hpcc.uh.edu/tomcat/hmtcite/texts"
        }
    }


