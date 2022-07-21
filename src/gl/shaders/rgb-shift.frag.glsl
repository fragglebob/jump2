#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform float u_amount;
uniform float u_angle;

in vec4 v_position;
in vec2 v_texCoord;

out vec4 outColor;

void main() {
    vec2 vUv = v_texCoord.st;
    vec2 offset = u_amount * vec2(cos(u_angle), sin(u_angle));
    vec4 cr = texture(u_texture, vUv + offset);
    vec4 cga = texture(u_texture, vUv);
    vec4 cb = texture(u_texture, vUv - offset);
    outColor = vec4(cr.r, cga.g, cb.b, cga.a);

}