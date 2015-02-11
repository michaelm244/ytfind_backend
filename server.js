var express = require('express');
var app = express();
var request = require('request');
var exec = require('child_process').exec;
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var http = require('http');

app.set('views',__dirname);
app.set('view engine', 'html');
console.log(app.get('views'));
app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/:form/:v', function(req, res) {
	var vid = req.params.v;
	var form = req.params.form;
	if(form != 'xml' && form != 'json') {
		res.send("<b>Error</b><p>Wrong form, must be either xml or json</p>");
	}

	if(vid && vid.length == 11) {
		request('http://video.google.com/timedtext?lang=en&v='+vid, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    if (body) {
		    	// console.log('exists');
		    	var out = "http://video.google.com/timedtext?lang=en&v="+vid;
		    	if(form == 'json') {
					var xml = '';
					http.get(out, function(youtubeRes) {
						youtubeRes.setEncoding('utf8');
						console.log("response code: "+youtubeRes.statusCode);
						var xml = '';
						youtubeRes.on('data', function(data) {
							xml += data;
						});
						youtubeRes.on('end', function() {
							console.log("yay xml should be done now!");
							parseString(xml, function(err, result) {
								if(err)
									console.log(err);
								for(var i = 0; i < result.transcript.text.length; i++) {
									// result.transcript.text[i]._ = result.transcript.text[i]._.replace('\n',' ');
									result.transcript.text[i].line = result.transcript.text[i]._;
									result.transcript.text[i].timing = result.transcript.text[i].$;
									delete result.transcript.text[i]._;
									delete result.transcript.text[i].$;
								}
								res.send(JSON.stringify(result));
							});
						});
					});
				}
				else if(form == 'xml') {
					request(out).pipe(res);
				}
		    } else {
				exec('phantomjs exec.js '+vid, function(err, out, stderr) {
					if(out.indexOf("http://www.youtube.com/api/timedtext") == 0) {	
				    	// console.log('in first else');
				    	if(form == 'json') {
							var xml = '';
							http.get(out, function(youtubeRes) {
								youtubeRes.setEncoding('utf8');
								console.log("response code: "+youtubeRes.statusCode);
								var xml = '';
								youtubeRes.on('data', function(data) {
									xml += data;
								});
								youtubeRes.on('end', function() {
									console.log("yay xml should be done now!");
									parseString(xml, function(err, result) {
										if(err)
											console.log(err);
										for(var i = 0; i < result.transcript.text.length; i++) {
											result.transcript.text[i]._ = result.transcript.text[i]._.replace('\n',' ');
											result.transcript.text[i].line = result.transcript.text[i]._;
											result.transcript.text[i].timing = result.transcript.text[i].$;
											delete result.transcript.text[i]._;
											delete result.transcript.text[i].$;
										}
										res.send(JSON.stringify(result));
									});
								})
							});
						}
						else if(form == 'xml') {
							request(out).pipe(res);
						}
				    }
				});
			}
	    } else {
	  		console.log(error);
	    }
	  });
	} else {
		res.send("<b>Error</b><p>Invalid video id</p>");
	}
});

app.get('/*', function(req, res) {
	res.redirect('/');
});

app.listen(3000);