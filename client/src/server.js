import { Server, JSONAPISerializer, Model } from "miragejs";
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
      this.post("/sign_up", () => {});
    }
  });
  return server;
}
