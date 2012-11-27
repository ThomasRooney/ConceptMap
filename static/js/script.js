window.onload = function() {
    window.history.forward(1); // stop backspace from sending the user back in history
    var canvas = document.getElementById("container");
    document.addEventListener("textInput", keyHandler, false);
    document.onkeydown = keyHandler;
    var stage = new Kinetic.Stage({
        container: "container",
        width: window.screen.width - 100,
        height: window.screen.height - 100
    });
    var layer = new Kinetic.Layer();
	var deletionIDs = [];
    var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    // Toolbar
    var keyCaptureEdit;
    var savedEventListeners = [];
    function ajoinArrow(object1, object2)
    {

    }
	function contains(a, obj) {
		var i = a.length;
		while (i--) {
		   if (a[i] === obj) {
			   return true;
		   }
		}
		return false;
	}
	
	function doHandShake() { 
	// Idea 1: Primitive
		// SEND ( <update>, (Changes), </update> ) 
		// RECIEVE (<update> (Changes), </update> )
		// doHandShake()
	// Idea 2: HashCode Implementation
		// Take all IDs, x/y positions, and text
		// Hash them together
		// Send to server
		// Recieve either a full update (if needed)
		// OR an 'OKAY' message
	// putting the two together
	// Let Hashcode.length = 8 bytes
	// division = (int)(numObjectsSent / 8)
	// if say 5 objts per byte
	// then = All important data * together
	// all % MAX(BYTE) = aall % 256
	// prob = text...collisions = quite likely when text length is great
	// for (i = 0 ; i < SyncObjects.length; i++)
	// 	 Let Hashcode_byte[i] = (obj[i]._id  * SyncObjects[i].x * obj[i]y)
	// Hash Collision Chawnce = 1/ 256 ^ 8 = 18446744073709551616 ^ -1
	// Pretty low..
	
	}
	    var xmlHttpReq = false;
        var self = this;
        // Mozilla/Safari/Opera
        if (window.XMLHttpRequest) {
            self.xmlHttpReq = new XMLHttpRequest();
        }
        // IE
        else if (window.ActiveXObject) {
            self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.open('POST', "sync", true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'text/xml');
        self.xmlHttpReq.onreadystatechange = function() {

	}
	
	function removeA(arr){
		var what, a= arguments, L= a.length, ax;
		while(L> 1 && arr.length){
			what= a[--L];
			while((ax= arr.indexOf(what))!= -1){
				arr.splice(ax, 1);
			}
		}
		return arr;
	}
    function xmlRecieve(){};
    function syncTimer(wait)
    {
        // look through the layer,
        var sending = "<?xml version=\"1.0\" encoding=\"cp1252\"?><sync>";
		var i;
        for (i = 0; layer.children[i] != null; i++ ){
            var obj = layer.children[i];
            // if obj has a handler
            if (obj.shapeType == "Text")
            {
                sending+="<object>";
                sending= sending + "<x>" + obj.getPosition().x + "</x>";
                sending= sending + "<y>" + obj.getPosition().y + "</y>";
                sending= sending + "<timestamp>" + obj.attrs.timestamp + "</timestamp>";
                sending= sending + "<stroke>" + obj.getStroke() + "</stroke>";
                sending= sending + "<draggable>" + obj.attrs.draggable + "</draggable>";
                sending= sending + "<strokeWidth>" + obj.attrs.strokeWidth + "</strokeWidth>";
                sending= sending + "<fill>" + obj.attrs.fill + "</fill>";
                sending= sending + "<text>" + obj.attrs.text + "</text>";
                sending= sending + "<fontSize>" + obj.attrs.fontSize + "</fontSize>";
                sending= sending + "<fontFamily>" + obj.attrs.fontFamily + "</fontFamily>";
                sending= sending + "<textFill>" + obj.attrs.textFill + "</textFill>";
                sending= sending + "<textStroke>" + obj.attrs.textStroke + "</textStroke>";
                sending= sending + "<padding>" + obj.attrs.padding + "</padding>";
                sending= sending + "<align>" + obj.attrs.align + "</align>";
                sending= sending + "<verticalAlign>" + obj.attrs.verticalAlign + "</verticalAlign>";
                sending= sending + "<fontStyle>" + obj.attrs.fontStyle + "</fontStyle>";
                sending= sending + "<id>" + obj._id + "</id>";
                sending+="</object>";
            }
        }
		for (i=deletionIDs.length-1; i>=0;i--)
		{
			sending+="<deletion>";
			sending+="<id>"+deletionIDs[i]+"</id>";
			sending+="</deletion>";
		}
        sending+="</sync>";
        var xmlHttpReq = false;
        var self = this;
        // Mozilla/Safari/Opera
        if (window.XMLHttpRequest) {
            self.xmlHttpReq = new XMLHttpRequest();
        }
        // IE
        else if (window.ActiveXObject) {
            self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.open('POST', "sync", true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'text/xml');
        self.xmlHttpReq.onreadystatechange = function() {
            if (self.xmlHttpReq.readyState == 4) {
                                t=setTimeout(syncTimer, 50); // call ourselves again
                var status = self.xmlHttpReq.status;
                var responseHeaders = self.xmlHttpReq.getAllResponseHeaders();
                var responses = {};
                var xml = self.xmlHttpReq.responseXML;

                // Construct response list
                if ( xml && xml.documentElement /* #4958 */ ) {
                    responses.xml = xml;
                }
                responses.text = self.xmlHttpReq.responseText;

                // Firefox throws an exception when accessing
                // statusText for faulty cross-domain requests
                try {
                    statusText = self.xmlHttpReq.statusText;
                } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                }
                if (xml) {
                    // read the parsed script. if we have the same id as one of the children
                    // update our own. If we don't, add a new entity with the specified 
                    // details.
                    var sync = xml.childNodes[0];
                    if (sync && sync.nodeName == "sync") {
						
                        for (var child = sync.firstChild; child != null; child = child.nextSibling) {
							if (child.nodeName == "deletion")
							{
								var id = child.attributes[0].nodeValue;
								for (var i = 0; layer.children[i] != null; i++ ){
									if (layer.children[i]._id == id) {
										layer.remove(layer.children[i]);
										removeA(deletionIDs, id);
									}
								}
								continue;
							}
                            var id = child.attributes[0].nodeValue;
                            var bExists = false;
                            for (var i = 0; layer.children[i] != null; i++ ){
                                var obj = layer.children[i];
                                var timestamp = parseInt(child.getElementsByTagName("timestamp")[0].childNodes[0].data);
                                // if obj has a handler
                                if (obj.shapeType == "Text" && obj._id == parseInt(id))
                                {
                                    bExists = true;
                                    // only update if we're not dragging the object, and the timestamp is different
                                    if (Kinetic.GlobalObject.drag.node != obj && obj.attrs.timestamp < timestamp) { 
                                        var newX = parseInt(child.getElementsByTagName("x")[0].childNodes[0].data);
                                        var newY = parseInt(child.getElementsByTagName("y")[0].childNodes[0].data);
                                        var newText = child.getElementsByTagName("text")[0].childNodes.length>0?child.getElementsByTagName("text")[0].childNodes[0].data:"";
                                        obj.setX(newX);
                                        obj.setY(newY);
                                        obj.setText(newText);
										obj.attrs.timestamp = timestamp;
                                    }
                                }    
                            }
                            if (!bExists && !contains(deletionIDs, parseInt(id)))
                            {
                                var t = child.getElementsByTagName("x")[0];
                                makeText(
                                    parseInt(child.getElementsByTagName("x")[0].childNodes[0].data),
                                    parseInt(child.getElementsByTagName("y")[0].childNodes[0].data),
                                    child.getElementsByTagName("stroke")[0].childNodes[0].data,
                                    child.getElementsByTagName("draggable")[0].childNodes[0].data=="true"?true:false,
                                    parseInt(child.getElementsByTagName("strokeWidth")[0].childNodes[0].data),
                                    child.getElementsByTagName("fill")[0].childNodes[0].data,
                                    child.getElementsByTagName("text")[0].childNodes.length>0?child.getElementsByTagName("text")[0].childNodes[0].data:"",
                                    parseInt(child.getElementsByTagName("fontSize")[0].childNodes[0].data),
                                    child.getElementsByTagName("fontFamily")[0].childNodes[0].data,
                                    child.getElementsByTagName("textFill")[0].childNodes[0].data,
                                    child.getElementsByTagName("textStroke")[0].childNodes[0].data,
                                    parseInt(child.getElementsByTagName("padding")[0].childNodes[0].data),
                                    child.getElementsByTagName("align")[0].childNodes[0].data,
                                    child.getElementsByTagName("verticalAlign")[0].childNodes[0].data,
                                    child.getElementsByTagName("fontStyle")[0].childNodes[0].data, 
                                    parseInt(id));

                            }
                        }
                    
                    }
                    stage.draw();
                }

            }
        }
        self.xmlHttpReq.send(sending);
    };
    setTimeout(syncTimer,100);

    function keyHandler(e)
    {

        var pressedKey;
        if (document.all) { e = window.event;
            pressedKey = e.keyCode; }
        if (e.which) {
            pressedKey = e.which;
        }
        if (pressedKey == 8) {
            e.cancelBubble = true; // cancel goto history[-1] in chrome
            e.returnValue = false;
        }
        if (pressedKey == 27)
        {
            // escape key was pressed
            keyCaptureEdit = null;
        }
        if (pressedKey != null && keyCaptureEdit != null)
        {
            keyCaptureEdit.callback(pressedKey, e.shiftKey);
        }

    }
    function makeText(argX, argY, argStroke, argDraggable, argStrokeWidth, argFill, argText,
                      argFontSize, argFontFamily, argTextFill, argTextStroke, argPadding, argAlign,
                      argVerticalAlign, argFontStyle, id) {
            if (argX == "undefined")
                argX = 200;
            if (argY == "undefined")
                argY = 200;
                
            if (argFill == "undefined")
                argFill = "black";               
            var t = new Kinetic.Text({
            x: argX,
            y: argY,
            stroke: argStroke,
            draggable: argDraggable,
            strokeWidth: argStrokeWidth,
            fill: argFill,
            text: argText,
            fontSize: argFontSize,
            fontFamily: argFontFamily,
            textFill: argTextFill,
            textStroke: argTextStroke,
            padding: argPadding,
            align: argAlign,
            verticalAlign: argVerticalAlign,
            fontStyle: argFontStyle
        });
        t.on("dblclick dbltap", function() {

            t.attrs.timestamp = t.attrs.timestamp + 1;
            t.setTextStroke(colors[Math.ceil( Math.random() * 6)]);
            keyCaptureEdit = t;
            keyCaptureEdit.callback = function (keyCode, shift) {
                var keyCaptured = String.fromCharCode(keyCode);
			    if (shift == false)
				{
					keyCaptured = keyCaptured.toLowerCase();
				}
                if (keyCaptured == "\b" ) { //backspace character
					t.attrs.timestamp = t.attrs.timestamp + 1;
                    t.setText(t.getText().slice(0, -1));
                }
                else if (keyCode == 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90)
                {
					t.attrs.timestamp = t.attrs.timestamp + 1;
                    t.setText(t.getText() + keyCaptured);
                }
                
                layer.draw();
            }
            layer.draw();
        });
        t.on("mouseover", function() {
            document.body.style.cursor = "pointer";
        });
        t.on("mouseout", function() {
            document.body.style.cursor = "default";
        });
        layer.add(t);
        if (id != null) {
            t._id = id;
        }
        layer.draw();
    };
    
    function makeButton(aX, aY, aWidth, aHeight, aLayer, aTogglable, aImage, aImageDown, aName, aCallBack )
    {
        if (aTogglable) {
            var imageDownObj = new Image();
            imageDownObj.src=aImageDown;
        }
        var imageObj = new Image();
        imageObj.src=aImage;
        var button;
        imageObj.onload = function(){
            button = new Kinetic.Image({
                x: aX,
                y: aY,
                stroke: "black",
                strokeWidth: 4,
                draggable: false,
                image: imageObj,
                width: aWidth,
                height: aHeight,
                name: aName
            });
            button.on("mouseover", function() {
                document.body.style.cursor = "pointer";
            });
            button.on("mouseout", function() {
                document.body.style.cursor = "default";
            });

            button.on("click", aCallBack);
            if (aTogglable) { // the reason I hate JavaScript.
                button.on("click", function () {
                    arguments.callee.toggle = arguments.callee.toggle || false;
                    arguments.callee.toggle = !arguments.callee.toggle;
                    if (arguments.callee.toggle) {
                        button.setImage(imageDownObj);
                    }
                    else {
                        button.setImage(imageObj);
                    }
                    layer.draw();
                });
            }
            aLayer.add(button);
            aLayer.draw();
        };
    }
    var buttonOn = false;
    makeButton(0, 50, 50, 50, layer, true, "static/img/Minus.gif", "static/img/MinusDown.gif",
        "negation", function () {
            // change click code of all objects on screen in the array to be removed, but save all the functions
            // so we can click again on this such that the mode is turned off and functions are restored
            if (buttonOn == false)
            {
                buttonOn = true;
                for (var i = 0; layer.children[i] != null; i++ ){
                    var obj = layer.children[i];
                    // if obj has a handler
                    if (obj.eventListeners != undefined && obj.eventListeners['ondblclick'] != undefined) {
                        savedEventListeners[obj._id] = obj.eventListeners['ondblclick'][0].handler;
                        obj.eventListeners['ondblclick'][0].handler = function () {
						    deletionIDs.push(this._id)
                            layer.remove(this);
                            layer.draw();
                        };
                    }
                }
            }
            else
            {
                buttonOn = false;
                for (var i = 0; layer.children[i] != null; i++ ){
                    var obj = layer.children[i];
                    // if obj has a handler
                    if (obj.eventListeners != undefined && savedEventListeners != undefined
                        && savedEventListeners[obj._id] != undefined) {
                        obj.eventListeners.handler = savedEventListeners[obj._id];
                    }
                }
            }
        });

    makeButton(0 ,0, 50, 50, layer, false, "static/img/Add.gif", "", "creation", function(button)
    {
    makeText(200, 200, "black", true, 5, colors[Math.floor(Math.random()*6)], "Love",
             40, "Calibri", "#888", "#444", 15, "center",
             "middle", "italic");
    });
    stage.add(layer);
    stage.draw();
};
