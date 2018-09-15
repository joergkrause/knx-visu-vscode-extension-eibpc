var PORT = 4805;
var HOST = '192.168.0.12';

var dgram = require('dgram');

var client = dgram.createSocket('udp4');

var args = [
  { "z0":0x08 },
  { "z1":0x10 },
  { "z4":0x16 },
  { "-t":0x04 },
  { "-S":0x0D },
  { 0x08:"z0" },
  { 0x10:"z1" },
  { 0x16:"z4" },
  { 0x04:"-t" },
  { 0x0D:"-S" },
];

function getArg(arg) {  
  return args.filter(d => d[arg])[0][arg];
}

var message = Buffer.from([0x40, getArg("-S"), 0x00, 0x00]);

client.on('error', function(e) {
  client.close();
  throw e;
});

client.on("message", function (msg, rinfo) {
  console.log("got from\t" + rinfo.address + ":" + rinfo.port);
  var i = 0;
  for(; i < msg.byteLength; i++){
    if (msg.slice(i, i+1).readUInt8(0) === 0xC0){
      var commandReceived = msg.slice(i+1, i+2).readInt8(0);      
      console.log("Answer", getArg(commandReceived));
      i+=4;
      break;
    }    
  }
  console.log(msg.slice(i, msg.length - 5).toString());
  client.close();
});

client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
});
