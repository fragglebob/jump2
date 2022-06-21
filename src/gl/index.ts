import * as twgl from "twgl.js";

import basicVert from "./shaders/basic.vert.glsl";
import basicFrag from "./shaders/basic.frag.glsl";
import { MatrixStack } from "./MatrixStack";
import { RenderContext } from "./types";
import { Renderer } from "./Renderer";

const m4 = twgl.m4;

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;

  renderer: Renderer;

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas;
    this.gl = gl;

    this.renderer = new Renderer(gl);

  }

  start() {
    requestAnimationFrame(this._render);
  }

  _render = (time: number) => {

    time *= 0.001;
    
    this.renderer.render((manager) => {

      manager.pushMatrix();

      for (let ii = 0; ii < 100; ii++) {
        manager.pushMatrix();
        
        manager.translate(Math.cos(time/2+ii/2+ii)*5, Math.sin(time*2+ii/2)*2, Math.sin(time+ii/3+55)*10);
        manager.rotateX(time-ii);
        manager.rotateY(time+ii);
        manager.scale((2-Math.sin(time+ii/3+55)+1)/4, (2-Math.sin(time+ii/3+55)+1)/4, (2-Math.sin(time+ii/3+55)+1)/4)

        if(ii % 2) {
          manager.box();
        } else {
          manager.ball();
        }
        

        manager.popMatrix();
      }    

      manager.popMatrix();

    })

    requestAnimationFrame(this._render);
  };


}
