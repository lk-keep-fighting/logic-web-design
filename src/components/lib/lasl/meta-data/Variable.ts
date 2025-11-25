import { Param, TypeAnnotation } from "./index";

export default class Variable extends Param {
    constructor(name: string) {
        super(name)
        this.concept = "Variable"
    }
}