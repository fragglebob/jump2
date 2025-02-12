import type { Renderer } from "../Renderer";

import { type FramebufferInfo, createTexture, setUniforms } from "twgl.js";
import fragShader from "../shaders/ascii.frag.glsl";
import vertShader from "../shaders/screen.vert.glsl";
import { ShaderRenderPass } from "./ShaderRenderPass";

import textUrl from "../../assets/text.png?url";

export type Props = {
  scale: number;
};

export class AsciiPass extends ShaderRenderPass<Props> {
  textTexture: WebGLTexture;

  ready = false;

  constructor(renderer: Renderer) {
    super(renderer, vertShader, fragShader);

    this.textTexture = createTexture(
      renderer.gl,
      {
        src: textUrl,
      },
      () => {
        this.ready = true;
      },
    );
  }

  render(
    args: Props,
    fromFramebuffer: FramebufferInfo,
    toFramebuffer: FramebufferInfo,
  ) {
    if (!this.ready) {
      return false;
    }

    this.renderer.gl.useProgram(this.programInfo.program);

    setUniforms(this.programInfo, {
      u_text: this.textTexture,
      u_resolution: [fromFramebuffer.width, fromFramebuffer.height],
      u_scale: args.scale,
      u_chars: 9,
    });

    this.renderer.processFragmentShaderProgram(
      this.getProgramInfo(),
      fromFramebuffer,
      toFramebuffer,
    );

    return true;
  }
}
