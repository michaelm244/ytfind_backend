var vid;
var args = require('system').args;
args.forEach(function(arg, i) {
	if(i == 1)
		vid = arg;
});

var page = require('webpage').create();

page.open("http://www.youtube.com/watch?v="+vid, function(status) {
	if(status != 'success') {
		console.log("shit there was an error breh");
	}
	else {
		var result = page.evaluate(function() {
			var url;

			if(document.getElementsByClassName("html5-main-video").length == 0 && document.getElementById('movie_player').getAttribute('flashvars').split('signature%3D').length > 1) {
				var flashVideo = document.getElementById('movie_player').getAttribute('flashvars');
		        var signature = flashVideo.split('signature%3D')[1];
		        var sig = "";
		        var still = true;
		        for(var i = 0; i < signature.length && still; i++) {
		            if(signature.substring(i,i+3) != "%26") {
		                sig += signature.charAt(i);
		            }
		            else  {
		                still = false;
		            }
		        }
		        sig = decodeURIComponent(sig);
		        console.log("sig: "+sig);

		        var expire = flashVideo.split('expire%3D');
		        expire = expire[1];
		        expire = expire.substring(0,10);
		        expire = decodeURIComponent(expire);
		        console.log("expire: "+expire);

		        var key = flashVideo.split('key%3D')[1];
		        var the_key = "";
		        going = true;
		        for(var i = 0; i < key.length && going; i++) {
		            if(key.substring(i,i+3) != "%26") {
		                the_key += key.charAt(i);
		            }
		            else  {
		                going = false;
		            }
		        }
		        the_key = decodeURIComponent(the_key);
		        console.log("key: "+the_key);

		        var asr_langs = flashVideo.split('asr_langs%3D')[1];
		        var langs = "";
		        var going = true;
		        for(var i = 0; i < asr_langs.length && going; i++) {
		            if(asr_langs.substring(i,i+3) != "%26") {
		                langs += asr_langs.charAt(i);
		            }
		            else  {
		                going = false;
		            }
		        }
		        langs = decodeURIComponent(langs);
		        console.log("langs: "+langs);

		        url = "http://www.youtube.com/api/timedtext?asr_langs="+langs+"&caps=asr&format=1&name=&expire="+expire+"&hl=en-US&fmts=1&signature="+sig+"&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&type=track&v="+document.location.href.split("=")[1]+"&kind=asr&lang=en&key="+the_key;
	    		return url;
	    	}

	    	else if(document.getElementsByClassName("html5-main-video").length == 1) {
	    		return yt.config_.TTS_URL+"format=1&name=&fmts=1&kind=asr&lang=en";
	    	}

	    	else {
	    		return "not found";
	    	}
		});
		console.log(result);
	}
	phantom.exit();
});