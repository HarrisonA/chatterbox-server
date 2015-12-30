/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var fs = require('fs');   // required to use filesystem aka (fs) methods
var filename = "./server/CaptureDate.txt";  // file location (for writing)
var captureData = {results: []};   // object where the data results will be kept in the array

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  console.log("Serving request type " + request.method + " for url " + request.url);
  

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  if (request.method === 'POST'){

    response.writeHead(201, headers);

    request.on("data", function (dataChunk){        // data arrives from the server in chunks/packets
      captureData.results.push(JSON.parse(dataChunk));  // before adding to our data array, we need to JSON parse it so it can be put back in object form, otherwise it will be in unreadable buffer chunks/packets
    });
    
    request.on("end", function(){   // wait for for all the chunks/packets have been collected
      
      // Write the data into a text file called "filename".
      // If we do not JSON.stringify the data first, then the data written to the file will be in the form of unreadble objects (e.g. [object Object]).  By doing JSON.stringify, it is put into more readable text.  Ex:       
      fs.writeFile(filename, JSON.stringify(captureData.results));
      response.end()}) ;
  }

  if (request.method === 'GET'){
    
    if ( request.url === '/arglebargle'){
      response.writeHead(404, headers);
      response.end();
    }
    
    else {
      response.writeHead(200, headers);
      
      
    
      response.end( JSON.stringify(captureData) );

      

    }
    
  }

  else if (request.method === 'OPTIONS'){  // options explanation down below  "Preflighted Requests"

    response.writeHead(200, headers)
    response.end();
  }

 //  Preflighted requests

 // Unlike simple requests (discussed above), "preflighted" requests first send an HTTP OPTIONS request header to the resource on the other domain, in order to determine whether the actual request is safe to send. Cross-site requests are preflighted like this since they may have implications to user data.


 

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
    
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.

};

