#version 300 es

precision mediump float;

uniform sampler2D u_texture;

uniform float u_x;
uniform float u_y;

in vec4 v_position;
in vec2 v_texCoord;

out vec4 outColor;


void main() {
    vec2 vUv = v_texCoord.st;

    vec2 size = vec2(u_x, u_y);

    vec2 uv2 = floor(vUv * size) / size;

    outColor = texture(u_texture, uv2);

}