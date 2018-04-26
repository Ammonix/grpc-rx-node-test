var PROTO_PATH = __dirname + "/../../.proto";
var grpc = require("grpc");
var Rx = require("rxjs/Rx");

var ammochat = grpc.load(PROTO_PATH).ammochat;

const messages$ = new Rx.ReplaySubject(5);

function chat(call) {
  console.info("new client");
  const sub = messages$.subscribe(i => call.write(i));
  call.on("data", i => messages$.next(i));
  call.on("end", () => {
    console.info("end client");
    call.end();
    sub.unsubscribe();
  });
}

function getServer() {
  var server = new grpc.Server();
  server.addService(ammochat.AmmoChat.service, {
    chat
  });
  return server;
}

if (require.main === module) {
  var chatServer = getServer();
  chatServer.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  chatServer.start();
}

exports.getServer = getServer;
