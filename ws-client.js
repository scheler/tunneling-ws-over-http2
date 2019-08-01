const WebSocket = require('ws')
const util = require('util');

const port = process.argv[2] || 8080;
const url = util.format('ws://localhost:%s/', port);

const connection = new WebSocket(url)

this.counter = 0;
connection.onopen = () => {
  connection.send('hey')
}

connection.onmessage = e => {
  console.log(e.data);
  if (this.counter == 0) {
    connection.send('hey again');
    this.counter = 1;
  }
}


