const PORT = 3671;
const MULTICAST_ADDR = "224.0.23.12";

const dgram = require("dgram");
const process = require("process");

const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

socket.bind(PORT);

socket.on("listening", function() {
  socket.addMembership(MULTICAST_ADDR);
  //setInterval(sendMessage, 2500);
  const address = socket.address();
  console.log(
    `UDP socket listening on ${address.address}:${address.port} pid: ${
      process.pid
    }`
  );
});

function sendMessage() {
  const message = Buffer.from(`Message from process ${process.pid}`);
  socket.send(message, 0, message.length, PORT, MULTICAST_ADDR, function() {
    console.info(`Sending message "${message}"`);
  });
}

socket.on("message", function(message, rinfo) {
  console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
});