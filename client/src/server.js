import { Server, JSONAPISerializer, Model, Response } from "miragejs";
import user from "./api/mock/data/user.json";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    models: {
      user: Model
    },
    seeds(server) {
      user.forEach(element => {
        server.create("user", element);
      });
    },
    serializers: {
      application: JSONAPISerializer
    },
    routes() {
      //namespace will be prepended to any route (it acts like the server base address)
      this.namespace = "/api";
      //------------------------------------------------------------------------------
      //  _    _   _____  ______  _____
      // | |  | | / ____||  ____||  __ \
      // | |  | || (___  | |__   | |__) |
      // | |  | | \___ \ |  __|  |  _  /
      // | |__| | ____) || |____ | | \ \
      //  \____/ |_____/ |______||_|  \_\
      //-----------------------------------------------------------------------------
      this.post("/sign_up", (schema, request) => {
        let userEmail = JSON.parse(request.requestBody).email;
        let isExisted =
          schema.users.where({ email: userEmail }).models[0] != null;
        if (isExisted) {
          return new Response(
            403,
            {},
            {
              message: "Mail exists"
            }
          );
        } else {
          schema.create("user", {
            firstName: JSON.parse(request.requestBody).firstName,
            lastName: JSON.parse(request.requestBody).lasttName,
            email: userEmail,
            password: JSON.parse(request.requestBody).password,
            birthDate: JSON.parse(request.requestBody).birthday,
            bio: JSON.parse(request.requestBody).bio,
            savedImages: [],
            followers: [],
            following: [],
            boards: [],
            counts: {
              likes: 0,
              comments: 0,
              repins: 0,
              saves: 0
            },
            createdAt: "2020-07-02T00:27:21.836Z"
          });
          return new Response(204, {}, {});
        }
      });
    }
  });
  return server;
}
