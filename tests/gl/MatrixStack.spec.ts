import { m4 } from "twgl.js";
import { beforeEach, describe, expect, it } from "vitest";
import { MatrixStack } from "../../src/gl/MatrixStack";

describe("MatrixStack", () => {
	let stack: MatrixStack;

	beforeEach(() => {
		stack = new MatrixStack();
	});

	it("should start with a identity matrix", () => {
		expect(stack.current).toEqual(m4.identity());
	});

	it("push#should copy the matrix to the top of the stack when pushed", () => {
		const existing = stack.current;
		stack.push();
		expect(stack.current).not.toBe(existing);
		expect(stack.current).toEqual(existing);
	});

	it("pop#should return to the previous value after a pop", () => {
		const firstMatrix = stack.current;
		stack.push();
		const secondMatrix = stack.current;
		stack.pop();
		expect(stack.current).not.toBe(secondMatrix);
		expect(stack.current).toBe(firstMatrix);
	});

	it("pop#should allow popping with no depth, but it doesn't do anything", () => {
		const existing = stack.current;
		stack.pop();
		expect(stack.current).toBe(existing);
	});

	it("reset#should start again when calling reset", () => {
		const existing = stack.current;
		stack.reset();
		expect(stack.current).not.toBe(existing);
		expect(stack.current).toEqual(existing);
	});

	describe("transforms", () => {
		it("translate#should translate the current matrix", () => {
			const existing = stack.current;
			stack.translate([1, 2, 3]);
			expect(stack.current).toBe(existing);
			expect(stack.current).not.toEqual(m4.identity());
			expect(stack.current).toMatchSnapshot();
		});

		it("scale#should scale the current matrix", () => {
			const existing = stack.current;
			stack.scale([1, 2, 3]);
			expect(stack.current).toBe(existing);
			expect(stack.current).not.toEqual(m4.identity());
			expect(stack.current).toMatchSnapshot();
		});

		it("rotateX#should rotate the current matrix", () => {
			const existing = stack.current;
			stack.rotateX(123);
			expect(stack.current).toBe(existing);
			expect(stack.current).not.toEqual(m4.identity());
			expect(stack.current).toMatchSnapshot();
		});

		it("rotateY#should rotate the current matrix", () => {
			const existing = stack.current;
			stack.rotateY(123);
			expect(stack.current).toBe(existing);
			expect(stack.current).not.toEqual(m4.identity());
			expect(stack.current).toMatchSnapshot();
		});

		it("rotateZ#should rotate the current matrix", () => {
			const existing = stack.current;
			stack.rotateZ(123);
			expect(stack.current).toBe(existing);
			expect(stack.current).not.toEqual(m4.identity());
			expect(stack.current).toMatchSnapshot();
		});

		it("should undo transforms that happen in push", () => {
			stack.push();
			stack.translate([4.2, 1.23, 2.6]);
			stack.rotateZ(13.37);
			stack.scale([0.5, 2, 0.6656]);
			expect(stack.current).not.toEqual(m4.identity());
			stack.pop();
			expect(stack.current).toEqual(m4.identity());
		});
	});
});
