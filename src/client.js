var PROTO_PATH = __dirname + "/../.proto";
var grpc = require("grpc");
var Rx = require("rxjs/Rx");

var ammochat = grpc.load(PROTO_PATH).ammochat;

var client = new ammochat.AmmoChat(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const id = Math.random()
  .toString(36)
  .substring(7);

const randomText = () =>
  Math.random()
    .toString(36)
    .substring(2);

const input$ = Rx.Observable.range(1, Math.random() * 10).pipe(
  Rx.operators.zip(Rx.Observable.timer(0, 2000)),
  Rx.operators.map(_ => randomText())
);

const runChat = () => {
  const call = client.chat();
  Rx.Observable.fromEvent(call, "data").subscribe(console.log);
  input$.subscribe({
    next: content => call.write({ id, content }),
    complete: () => call.end()
  });
};

if (require.main === module) {
  runChat();
}

exports.runChat = runChat;
