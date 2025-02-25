
const buttonNameToIndex: Record<string, number> = {
  "A": 0,
  "B": 1,
  "X": 2,
  "Y": 3,
  "LB": 4,
  "RB": 5,
  "LT": 6,
  "RT": 7,
  "BACK": 8,
  "START": 9,
  "LSTICK": 10,
  "RSTICK": 11,
  "UP": 12,
  "DOWN": 13,
  "LEFT": 14,
  "RIGHT": 15,  
}

const axisNameToIndex: Record<string, number> = {
  "LX": 0,
  "LY": 1,
  "RX": 2,
  "RY": 3,
}

export class GamepadManager {

  gamepadIndex: number | null = null;
  
  gamepad: Gamepad | null = null;

  constructor() {
    this.init();
  }

  private init() {
    const gamepads = navigator.getGamepads();

    for (const gamepad of gamepads) {
      if (gamepad !== null) {
        this.gamepadIndex = gamepad.index;
      }
    }
    window.addEventListener("gamepadconnected", this.handleGamepadConnected);
    window.addEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnected,
    );
  }

  private handleGamepadConnected = (event: GamepadEvent) => {
    if (this.gamepadIndex !== null) {
      return;
    }
    this.gamepadIndex = event.gamepad.index;
    console.log("Gamepad connected:", event.gamepad);
  };

  private handleGamepadDisconnected = (event: GamepadEvent) => {

    if(this.gamepadIndex === null) { 
      return;
    }

    if(this.gamepadIndex !== event.gamepad.index) {
      return;
    }

    this.gamepadIndex = null;

    console.log("Gamepad disconnected");
  };


  pollGamepadState(): void {
    if(this.gamepadIndex === null) {
      this.gamepad = null;
      return;
    }
    
    const gamepads = navigator.getGamepads();

    if(!gamepads[this.gamepadIndex]) {
      this.gamepad = null;
      return;
    }

    this.gamepad = gamepads[this.gamepadIndex];
  }

  getButton(name: string): number {
    if (!this.gamepad) {
      return 0;
    }

    const index = buttonNameToIndex[name];
    if (index === undefined) {
      return 0;
    }

    return this.gamepad.buttons[index].value;
  }

  getAxis(name: string): number {
    if (!this.gamepad) {
      return 0;
    }

    const index = axisNameToIndex[name];
    if (index === undefined) {
      return 0;
    }

    // console.log(this.gamepad, name, index);
    return this.gamepad.axes[index];
  }
}