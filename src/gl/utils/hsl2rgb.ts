function hue2rgb(p: number, q: number, t: number) {
	let t2 = t;
	if (t2 < 0) t2 += 1;
	if (t2 > 1) t2 -= 1;
	if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
	if (t2 < 1 / 2) return q;
	if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
	return p;
}

export function hslToRgb(
	h: number,
	s: number,
	l: number,
): [number, number, number] {
	if (s === 0) {
		return [l, l, l];
	}

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}
