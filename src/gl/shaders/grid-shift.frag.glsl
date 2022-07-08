#version 300 es

precision mediump float;

uniform sampler2D u_texture;

uniform float u_rows;
uniform float u_time;

in vec4 v_position;
in vec2 v_texCoord;

out vec4 outColor;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
        vec2(12.9898,78.233))) *
        43758.5453123);
}

void main() {
    vec2 vUv = v_texCoord.st;

    vec2 uv2 = floor(vUv * u_rows) / u_rows;
    vec2 uvOffset = fract(vUv * u_rows);
    
    float gridPoint = floor(random(uv2) * u_rows * u_rows + u_time);
    
    vec2 startPos = vec2(floor(gridPoint / u_rows), mod(gridPoint, u_rows));
    
    startPos += uvOffset;
    startPos = fract(startPos / u_rows);

    outColor = texture(u_texture, startPos);

}