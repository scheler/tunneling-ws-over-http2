# tunneling-ws-over-http2
Tunneling websocket over http2 using extended CONNECT protocol

This is a demonstration of tunneling websocket connections over http2 stream using the extended CONNECT protocol. This uses Envoy proxy to do the H2 hops.

[WS Client] —- HTTP/1.1 —- [Envoy A] —- HTTP/2 —- [Envoy B] —- HTTP/1.1 —- [WS Server]

### References:

* https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/websocket.html?#handling-h2-hops
* https://tools.ietf.org/html/rfc8441
* https://nodejs.org/api/http2.html#http2_supporting_the_connect_method

## Creating the WS Client and WS server

* Requirement - node (https://nodejs.org/en/download/)
* yarn init
* yarn add

* Run the server: node ws-server.js
* Run the client: node ws-client.js 8080

## Setting up the HTTP2 tunnel

We will setup both the plain-text tunnel and an encrypted tunnel.

Generate a cert

> openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem

Get envoy proxy docker image

> docker pull envoyproxy/envoy:latest

Run envoy as front proxy (Envoy A)

> docker run --rm -p 8000:8000  -p 8002:8002 -v $(pwd):/certs -v $(pwd)/front-proxy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:latest -l debug -c /etc/envoy/envoy.yaml

Run envoy as reverse proxy (Envoy B)

> docker run --rm --name another -p 8001:8001 -p 8003:8003 -v $(pwd):/certs -v $(pwd)/reverse-proxy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:latest -l debug -c /etc/envoy/envoy.yaml

With this, Envoy A on port 8000 tunnels to port 8001 of Envoy B over plain-text http2 and Envoy A on port 8002 tunnels to port 8003 of Envoy B over TLS.

## Running the WS client through the tunnel

Through the plain-text tunnel

> node ws-client.js 8000

Through the TLS tunnel

> node ws-client.js 8002