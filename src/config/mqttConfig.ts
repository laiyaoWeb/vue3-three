import { IClientOptions } from "mqtt/types/lib/client-options";

export const clientOptions: IClientOptions = {
  port: 9001,
  clientId: "mqttx_" + Math.random().toString(36).substr(2, 10),
  username: "unbuntu",
  password: "",
  clean: true,
};

// export const mqttUrl = `ws://192.168.1.10`;

export const mqttUrl = `ws://192.168.3.6`;
