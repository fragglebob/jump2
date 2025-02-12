interface MIDIMessage {
	type: string;
}

export interface ControlChange extends MIDIMessage {
	type: "control_change";
	index: number;
	value: number;
}

export interface NoteOn extends MIDIMessage {
	type: "note_on";
	index: number;
	velocity: number;
}

export interface NoteOff extends MIDIMessage {
	type: "note_off";
	index: number;
	velocity: number;
}

const isControlChange = (data: Uint8Array): boolean => {
	return data.length === 3 && (data[0] & 0b10110000) === 0b10110000;
};

const isNoteOn = (data: Uint8Array): boolean => {
	return data.length === 3 && (data[0] & 0b10010000) === 0b10010000;
};

const isNoteOff = (data: Uint8Array): boolean => {
	return data.length === 3 && (data[0] & 0b10000000) === 0b10000000;
};

export const decodeMessage = (
	data: Uint8Array,
): ControlChange | NoteOn | NoteOff | undefined => {
	if (isControlChange(data)) {
		return {
			type: "control_change",
			index: data[1],
			value: data[2],
		} satisfies ControlChange;
	}
	if (isNoteOn(data)) {
		return {
			type: "note_on",
			index: data[1],
			velocity: data[2],
		} satisfies NoteOn;
	}
	if (isNoteOff(data)) {
		return {
			type: "note_off",
			index: data[1],
			velocity: data[2],
		} satisfies NoteOff;
	}
};
