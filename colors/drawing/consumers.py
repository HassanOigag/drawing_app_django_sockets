import json

from channels.generic.websocket import AsyncWebsocketConsumer


class DrawConsumer(AsyncWebsocketConsumer):
    connection_number = 0

    async def connect(self):
        DrawConsumer.connection_number += 1
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        print("new connection", self.connection_number)
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        print("disconnected", close_code)

    async def receive(self, text_data):
        #get json from string
        print("recieving", text_data)
        data = json.loads(text_data)
        print("received", data)
        x = data['x']
        y = data['y']
        color = data['color']
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "drawing",
                "x": x,
                "y": y,
                "color": color,
            }
        )

    async def drawing(self, event):
        x = event["x"]
        y = event["y"]
        color = event["color"]
        print("sending", x, y)
        await self.send(text_data=json.dumps({"x": x, "y": y, "color": color}))
    
        # self.send(text_data=json.dumps({"x": x, "y": y}))
        print("sending", x, y, color)
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