import { m4, type v3 } from "twgl.js";

export class MatrixStack {
	private stack: m4.Mat4[];
	private depth: number;

	constructor() {
		this.stack = [m4.identity()];
		this.depth = 0;
	}

	reset() {
		this.stack = [m4.identity()];
		this.depth = 0;
	}

	public get current(): m4.Mat4 {
		return this.stack[this.depth];
	}

	pop() {
		if (this.depth > 0) {
			this.stack.pop();
			this.depth--;
		}
	}

	push() {
		this.stack.push(this.copy());
		this.depth++;
	}

	copy(): m4.Mat4 {
		return m4.copy(this.current);
	}

	scale(vec: v3.Vec3): void {
		m4.scale(this.current, vec, this.current);
	}

	translate(vec: v3.Vec3): void {
		m4.translate(this.current, vec, this.current);
	}

	rotateX(angle: number): void {
		m4.rotateX(this.current, angle, this.current);
	}

	rotateY(angle: number): void {
		m4.rotateY(this.current, angle, this.current);
	}

	rotateZ(angle: number): void {
		m4.rotateZ(this.current, angle, this.current);
	}
}
