/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

  // var captureData =[];
  var captureData = {results: []};
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

    //headers['Content-Length'] = Buffer.byteLength(request._postData);
    //console.log('\n \n \n HEADERS HEADERS:', headers, "\n \n \n");
    response.writeHead(201, headers);
    //console.log('\n \n \n HERE IS THE REQUEST:', request);

    request.on("data", function (dataChunk){
      captureData.results.push(JSON.parse(dataChunk)); 
      //console.log("faddddsdsdsdssdd: ", dataChunk);  
    });
    
    //console.log("\n\nPost: ", request, "\n\n");
    request.on("end", function(){response.end()}) ;
  }

  if (request.method === 'GET'){
    //console.log('\n \n \n\nRESPONSE DATA!:', response._data);
    //console.log("\n\n GET's captureData: ", captureData, "\n\n");
    //console.log("\n\n\n\n\nREQUEST:", request);

    if ( request.url === '/arglebargle'){
      response.writeHead(404, headers);
     // console.log("\n\n\n\n\n  ARBLEL RESPOSNE", response)
      response.end();
    }
    
    else {
      response.writeHead(200, headers);
      
      
    
      response.end( JSON.stringify(captureData) );

      // response.on('end', function(){
      //   var result = captureData.join('');
      //   console.log('\n \n \n STRINGIFIED RESPONSE', JSON.stringify(result), "\n \n \n" )
      //   return JSON.stringify(result);
      // })

    }
    //response._data.results = captureData;   //ALMOST THERE but something is off
    
    
    // response.end( JSON.stringify({results: []}) );
    //response.write(JSON.stringify({results: captureData}));

    //console.log(response);
    // response.end( JSON.stringify({results: response._data.results}) );
  }


 // response.writeHead(statusCode, headers);
  
  // response.write( JSON.stringify(response) );

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
    
  
 // response.end(JSON.stringify({results: []}) );
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

