import { Param, TypeAnnotation } from "./index";

export default class Return extends Param {
    constructor(name: string) {
        super(name)
        this.concept = "Return"
    }
}