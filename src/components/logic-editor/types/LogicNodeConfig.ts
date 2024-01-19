import { Node } from "@antv/x6";

export default class LogicNodeConfig {
    constructor(nodeConfig: Node.Config) {
        this._nodeConfig = JSON.parse(JSON.stringify(nodeConfig));
        if (this._nodeConfig._groups) this._groups = this._nodeConfig._groups;
    }
    _nodeConfig: Node.Config;
    _groups?: any[];

    getNodeConfig() {
        return this._nodeConfig;
    }
    getGroups() {
        return this._groups;
    }
    setLabel(label: string) {
        if (this._nodeConfig.attrs)
            this._nodeConfig.attrs.text.text = label
    }
    setGroups(groups: any[]) {
        this._groups = groups;
    }
    setConfigSchemel(type: string) {
        if (this._nodeConfig.data) {
            this._nodeConfig.data.configSchema = type;
            this._nodeConfig.data.config = { type }
        }
        else {
            this._nodeConfig.data = {
                configSchema: type,
                config: { type }
            }
        }
    }
    setConfigData(config: any) {
        if (this._nodeConfig.data) {
            this._nodeConfig.data.config = config;
        }
        else {
            this._nodeConfig.data = {
                config,
            }
        }
    }
}