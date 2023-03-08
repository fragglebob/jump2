import { encodeCode, decodeCode } from "./encoding";

const vizUrlPrefix = "/viz/";

export function pushNewVizUrl(code: string) {
    const url = new URL(window.location.toString());
    url.pathname = vizUrlPrefix + encodeCode(code);
    window.history.replaceState({}, '', url);
}

export function isVizUrl() {
    const url = new URL(window.location.toString());
    return url.pathname.startsWith(vizUrlPrefix);
}

export function getVizCodeFromUrl() {
    const url = new URL(window.location.toString());
    return decodeCode(url.pathname.slice(vizUrlPrefix.length));
}