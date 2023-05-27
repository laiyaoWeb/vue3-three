// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min'
import { isJSON, arraybufferToStr } from '@/utils'
import { IClientOptions } from "mqtt/types/lib/client-options";

type OnMessageFunc = (topic: string, payload: Buffer) => void;

interface ISubscribeParams {
  topic: string,
  qos: 0 | 1 | 2;
  fn(topic: string, payload: Buffer): void;
}


class MqttClient {

  private mqClient: mqtt.MqttClient;
  private subscribeTasks: Map<string, ISubscribeParams> = new Map<string, ISubscribeParams>();
  static instance: MqttClient | null = null
  private mqttUrl: string = ''
  
  static getInstance() {
    if (MqttClient.instance === null) {
      MqttClient.instance = new MqttClient()
    }
    return MqttClient.instance
  }

  
  public connect (url: string, options: IClientOptions) {
    this.mqttUrl = url
    this.mqClient = mqtt.connect(url, options);
    this.addEventListeners();
  }

  addEventListeners ( ) {
    this.mqClient.on('connect', this.onConnect.bind(this));
    this.mqClient.on('message', this.onMessage.bind(this));
    this.mqClient.on('error', this.onError.bind(this));
  }

  onConnect() {
    console.log("Connected to mqtt server url: " + this.mqttUrl);
    this.subscribeTasks.forEach(({ topic, qos}) => {
      this.mqClient.subscribe(topic, { qos });
    })
  }

  onMessage(topic: string, payload: any) {
    console.log('topic: ' + topic);
    console.log("Received message: ", payload.toString());
    this.subscribeTasks.forEach(({ fn }, key) => {
      if (topic.includes(key.replace('/#', '')) ) {
        if (Object.prototype.toString.call(payload) === '[object Uint8Array]') {
          const str = arraybufferToStr(payload);
          if(isJSON(str)) {
            fn(topic, JSON.parse(str));
          }
        } else {
          fn(topic, payload);
        }
      }
    });
  }

  onError(err: any) {
    console.error(err);
  }

  public subscribe(topic: string, qos: 0 | 1 | 2, fn: OnMessageFunc) {
    this.mqClient.subscribe(topic, { qos });
    this.subscribeTasks.set(topic, { topic, qos, fn });
  }

  public publish(topic: string, message: string, qos: 0 | 1 | 2 = 0) {
    if (!this.mqClient.connected) {
      console.error('mqtt client is not connected')
      return
    }
    console.log('publish topic: ' + topic);
    console.log('publish message: ' + message);
    this.mqClient.publish(topic, message, { qos: qos, retain: false });
  }

}
const mqttClient = MqttClient.getInstance();
export default mqttClient;