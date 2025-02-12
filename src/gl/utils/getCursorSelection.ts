export interface CursorSelection {
	start: number;
	end: number;
}

export function isCursorSelection(x: unknown): x is CursorSelection {
	if (typeof x !== "object") {
		return false;
	}
	if (x == null) {
		return false;
	}

	if (!("start" in x && "end" in x)) {
		return false;
	}

	return typeof x.start === "number" && typeof x.end === "number";
}

export function getCursorSelection(
	input: HTMLTextAreaElement,
): CursorSelection | undefined {
	if ("selectionStart" in input && document.activeElement === input) {
		return {
			start: input.selectionStart,
			end: input.selectionEnd,
		};
	}
	return;
}
