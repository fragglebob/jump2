export type MIDIMessageHandler = (
  input: MIDIInput,
  data: Uint8Array | null,
) => void;

export class MIDIManager {
  subscriptions: Set<MIDIMessageHandler>;

  outputs: MIDIOutput[] = [];

  access: MIDIAccess;

  constructor(midiAccess: MIDIAccess) {
    this.access = midiAccess;
    this.subscriptions = new Set<MIDIMessageHandler>();

    midiAccess.addEventListener("statechange", (event) => {
      console.log(event);
    });

    // biome-ignore lint/complexity/noForEach: this isn't an array
    midiAccess.inputs.forEach((input) => {
      input.open().then(() => {
        input.addEventListener("midimessage", (event) => {
          this.forwardMessage(event);
        });
      });
    });

    // biome-ignore lint/complexity/noForEach: this isn't an array
    midiAccess.outputs.forEach((output) => {
      output.open().then(() => {
        this.outputs.push(output);
      });
    });
  }

  static async make(): Promise<MIDIManager> {
    return navigator.requestMIDIAccess({ sysex: true }).then((midiAccess) => {
      return new MIDIManager(midiAccess);
    });
  }

  forwardMessage(event: MIDIMessageEvent): void {
    for (const subscription of this.subscriptions) {
      subscription(event.target as MIDIInput, event.data);
    }
  }

  subscribe(handler: MIDIMessageHandler): () => void {
    this.subscriptions.add(handler);
    return () => {
      this.subscriptions.delete(handler);
    };
  }

  send(portSelector: { name: string; manufacturer?: string }, data: number[]) {
    for (const output of this.outputs) {
      if (output.name !== portSelector.name) {
        return;
      }
      if (
        portSelector.manufacturer &&
        portSelector.manufacturer !== output.manufacturer
      ) {
        return;
      }
      output.send(data);
    }
  }
}
