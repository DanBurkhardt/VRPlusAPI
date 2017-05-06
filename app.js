/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var fs = require('fs');
var youtubedl = require('youtube-dl');

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.get("/getVideo", function (req, res) {
  if(req.query.videoID){
    sendVideo(req.query.videoID)
  }else{
    res.send("no id provided")
  }
  
  function sendVideo(ID) {
    res.sendFile(ID+'.mp4' , { root : __dirname});
  }
})

app.get("/downloadVideo", function (req, res) {
  
  console.log(req);
  
  if(req.query.videoID){
    startDownload(req.query.videoID)
  }else{
    res.send("no id provided")
  }
  
  function startDownload(ID){
    
    var video = youtubedl('http://www.youtube.com/watch?v='+ID,
      // Optional arguments passed to youtube-dl. 
      ['--format=18'],
      // Additional options can be given for calling `child_process.execFile()`. 
      { cwd: __dirname });
     
    // Will be called when the download starts. 
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info.filename);
      console.log('size: ' + info.size);
    });
    
    // Write
    video.pipe(fs.createWriteStream(ID+'.mp4'));
    res.send("finished")
  }
})