import { startingCode } from "../../demo-code";
import { getCodeFromLocalStorage } from "./localStorage";

export function getStartingCode(): string {
	try {
		return getCodeFromLocalStorage() ?? startingCode;
	} catch (e) {
		console.error("Failed to fetch code from locale storage", e);
		return startingCode;
	}
}
