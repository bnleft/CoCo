import express from "express";

const server = express();

server.all('/', (req, res) => {
  res.send('CoCo online.');
});

export function keepAlive() {
  server.listen(3000, () => {
    console.log('Server online.');
  });
}