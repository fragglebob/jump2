import type { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import { type FramebufferInfo, setUniforms } from "twgl.js";
import fragShader from "../shaders/kaleidoscope.frag.glsl";
import vertShader from "../shaders/screen.vert.glsl";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
  segments: number;
  time?: number;
};

export class KaleidoscopePass extends ShaderRenderPass<Props> {
  constructor(renderer: Renderer) {
    super(renderer, vertShader, fragShader);
  }

  render(
    args: Props,
    fromFramebuffer: FramebufferInfo,
    toFramebuffer: FramebufferInfo,
  ) {
    const segments = args.segments;
    const time = args.time ?? this.renderer.getTime();

    this.renderer.gl.useProgram(this.programInfo.program);

    setUniforms(this.programInfo, {
      u_offset: 0,
      u_divisor: (Math.PI * 2) / Math.max(segments, 1),
      u_roll: time / 10,
      u_time: time,
    });

    this.renderer.processFragmentShaderProgram(
      this.getProgramInfo(),
      fromFramebuffer,
      toFramebuffer,
    );

    return true;
  }
}
