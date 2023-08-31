import { LogicItem } from "../../lasl/meta-data";
import FnContext from "./context";
import * as mqtt from "mqtt";
export default async function MQTTRunner(ctx: FnContext, item: LogicItem) {
  try {
    console.log('mqtt-runner')
    const url = 'ws://broker.emqx.io:8083/mqtt';
    // const url = 'mqtt://broker.emqx.io:1883';
    // 创建客户端实例
    const options = {
      // Clean session
      clean: true,
      connectTimeout: 4000,
      // 认证信息
      clientId: 'emqx_test' + Date.now().toString(),
      username: 'emqx_test',
      password: 'emqx_test',
    }
    const client = mqtt.connect(url, options);
    client.on('connect', function () {
      console.log('Connected')
      // 订阅主题
      client.subscribe('aims/t', function (err) {
        if (!err) {
          // 发布消息
          client.publish('aims/t', 'Hello mqtt from stepflow')
        } else {
          console.log('mqtt err')
          console.log(err)
        }
      })
    })
    client.on('error', (err) => {
      console.log('mqtt err');
      console.log(err);
    })
    ctx._env.mqtt = client;

    return client;
  } catch (err) {
    console.log('catch mqtt err');
    console.log(err);
    // ctx._logic?.log('js error');
    // await ctx._logic?.handleError(err);
    return err;
  }
}
