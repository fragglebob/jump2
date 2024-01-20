#version 300 es

precision mediump float;

uniform sampler2D u_texture;

uniform sampler2D u_text;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_chars;

in vec4 v_position;
in vec2 v_texCoord;

out vec4 outColor;

float gray(vec3 c){
    return c.x*0.299 + c.y*0.587 + c.z*0.114;
}

void main() {

    vec2 uv = v_texCoord.st;

    vec2 st = floor(uv*u_resolution/u_scale) * u_scale / u_resolution;

    float val = gray(texture(u_texture, st).rgb);
    val = clamp(val, 0., 1.) - 1e-5;

    vec2 tuv = mod(uv*u_resolution, u_scale) / u_scale;

    tuv.x *= 1.0 / u_chars;
    tuv.x += floor(val*u_chars)* (1.0 / u_chars);

    float res = 1.0 - texture(u_text, tuv).r;

    outColor = texture(u_texture, uv) * res;
}