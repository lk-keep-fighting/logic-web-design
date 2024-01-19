import axios from "axios";
import { ProcessInput } from "./dtos/processInput";
import { presetAxios } from "../utils/axiosInit";

export class MesService {
    async updateRouteProcessDesign(input: ProcessInput) {
        return presetAxios.post('/api/mes/asm-standard/route/update-route-process-design', JSON.stringify(input))
    }
    async getRouteProcessDesign(productCode: string, version: string) {
        return presetAxios.post('/api/mes/asm-standard/route/route-process-design', JSON.stringify({
            version,
            productCode
        }))
    }
}