//Multicast Client receiving sent messages
var PORT = 3671;
var MCAST_ADDR = "224.0.23.12"; //same mcast address as Server
var HOST = '192.168.0.18'; //this is your own IP
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    client.addMembership(MCAST_ADDR);
});

client.on('message', function (message, remote) {   
    console.log('MCast Msg: From: ' + remote.address + ':' + remote.port +' - ' + message);
});

client.bind(PORT, HOST);