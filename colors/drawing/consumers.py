import json

from channels.generic.websocket import WebsocketConsumer


class DrawConsumer(WebsocketConsumer):
    connection_number = 0

    def connect(self):
        DrawConsumer.connection_number += 1
        print("new connection", self.connection_number)
        self.channel_layer.group_add(
            "drawing",
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            "drawing",
            self.channel_name
        )
        print("disconnected", close_code)

    def receive(self, text_data):
        #get json from string
        data = json.loads(text_data)
        x = data['x']
        y = data['y']
        print("received", x, y)
        self.channel_layer.group_send(
            "drawing",
            {
                "type": "drawing",
                "x": x,
                "y": y,
            }
        )

    def drawing(self, event):
        x = event["x"]
        y = event["y"]
        print("sending", x, y)
        self.send(text_data=json.dumps({"x": x, "y": y}))
    
        # self.send(text_data=json.dumps({"x": x, "y": y}))
        print("sending", x, y)
        # self.channel_layer.group_send(
        #     "drawing",
        #     {
        #         "type": "drawing",
        #         "x": x,
        #         "y": y,
        #     }
        # )

    # def drawing(self, event):
    #     x = event["x"]
    #     y = event["y"]
    #     print("sending", x, y)
    #     self.send(text_data=json.dumps({"x": x, "y": y}))

        #send json to string
        # self.send(text_data=json.dumps({"x": x, "y": y}))

        # print("received", text_÷data)
        # print(f"x = {data['x']}")
        # print(f"y = {data['y']}")
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]

        # self.send(text_data=json.dumps({"message": message}))