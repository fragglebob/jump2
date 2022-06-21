import { m4, v3 } from "twgl.js"

export class MatrixStack {

    _stack: m4.Mat4[];
    _current: number;

    constructor() {
        this._stack = [m4.identity()]
        this._current = 0;
    }

    reset() {
        this._stack = [m4.identity()]
        this._current = 0;
    }

    public get current() : m4.Mat4 {
        return this._stack[this._current]
    }  

    pop() {
        if(this._current > 0) {
            this._stack.pop();
            this._current--;
        }
    }

    push() {
        this._stack.push(this.copy());
        this._current++;
    }

    copy() : m4.Mat4 {
        return m4.copy(this.current);
    }

    scale(vec: v3.Vec3) : void {
        m4.scale(this.current, vec, this.current)
    }

    translate(vec: v3.Vec3) : void {
        m4.translate(this.current, vec, this.current);
    }

    rotateX(angle: number) : void {
        m4.rotateX(this.current, angle, this.current);
    }

    rotateY(angle: number) : void {
        m4.rotateY(this.current, angle, this.current);
    }

    rotateZ(angle: number) : void {
        m4.rotateZ(this.current, angle, this.current);
    }
}