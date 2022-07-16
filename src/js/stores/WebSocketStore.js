import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export const WebSocketStore = {
    state: () => {
        return {
            received_messages: [],
            send_message: null,
            connected: false,
            socket: null,
            stompClient: null
        }
    },
    mutations: {
        
    },
    actions: {
        send() {
            console.log("Send message:" + this.send_message);
            if (this.stompClient && this.stompClient.connected) {
              const msg = { text: "message" };
              console.log(JSON.stringify(msg));
              this.stompClient.send("ws/app/hello", JSON.stringify(msg), {});
            }
        },
        getSocketConnection() {
            let socket = new SockJS("http://localhost:8081/ws");
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect(
              {},
              frame => {
                this.connected = true;
                console.log(frame);
                this.stompClient.subscribe("/ws/subscribe", tick => {
                  console.log(tick);
                  this.received_messages.push(JSON.parse(tick.body).content);
                });
              },
              error => {
                console.log("error", error);
                this.connected = false;
              }
            );
        },
        disconnect() {
            if (this.stompClient) {
              this.stompClient.disconnect();
            }
            this.connected = false;
        },
        tickleConnection() {
            this.connected ? this.disconnect() : this.connect();
        }
    },
}