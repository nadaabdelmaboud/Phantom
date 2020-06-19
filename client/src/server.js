import { Server, JSONAPISerializer } from "miragejs";
//To be imported
//Model, Response,
export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    models: {},
    // seeds(server){
    // },
    serializers: {
      application: JSONAPISerializer
    },
    routes() {
      //namespace will be prepended to any route (it acts like the server base address)
      this.namespace = "/api";
    }
  });
  return server;
}
