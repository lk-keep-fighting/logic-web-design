import axios from "axios";
import { InitPanelData } from "../settings/PanelSetting";

export async function getPanelData() {
    return new Promise((resolve, reject) => {
        resolve(InitPanelData());
    });
}