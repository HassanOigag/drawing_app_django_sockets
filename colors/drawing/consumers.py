import json

from channels.generic.websocket import WebsocketConsumer


class DrawConsumer(WebsocketConsumer):
    def connect(self):
        print("connected")
        self.accept()

    def disconnect(self, close_code):
        print("disconnected", close_code)

    def receive(self, text_data):
        #get json from string
        data = json.loads(text_data)
        print(data['x'])
        # print("received", text_÷data)
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]

        # self.send(text_data=json.dumps({"message": message}))