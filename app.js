const WebSocket = require('ws');
const config = require('./config');
const wss = new WebSocket.Server({port: config.server.port});
const serialport = require('serialport');
const readline = require('@serialport/parser-readline');
const port = new serialport(config.serialData.port, {
    baudRate: config.serialData.baudRate,
    dataBits: config.serialData.dataBits,
    stopBits: config.serialData.stopBits,
    parity: config.serialData.parity
});
const parser = port.pipe(new readline({delimiter: '\r\n'}));
wss.on('connection', function connection(ws) {
    // console.log('Connecting...');
    parser.on('data', function (data) {
        let finalResult = parseFloat(data.match(/\d+/)[0]);
        if (ws.readyState === 1) {
            ws.send(finalResult);
        }
    });
});