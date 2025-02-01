export const codeStorageKey = 'JUMP2_SCRIPT';

export function getCodeFromLocalStorage(): string | null {
    return window.localStorage.getItem(codeStorageKey)
}

export function updateCodeInLocalStorage(code: string): boolean {
    try {
        window.localStorage.setItem(codeStorageKey, code)
        return true;
    } catch (e) {
        console.error('Failed to save code to local storage', e);
    }
    return false;
}