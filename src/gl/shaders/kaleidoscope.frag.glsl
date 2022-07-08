#version 300 es

precision mediump float;

uniform sampler2D u_texture;

uniform float u_offset;
uniform float u_divisor;
uniform float u_roll;
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

    vec2 sc = vUv - 0.5;
    float phi = atan(sc.y, sc.x);
    float r = sqrt(dot(sc, sc));

    // Angular repeating.
    phi += u_offset;
    phi = phi - u_divisor * floor(phi / u_divisor);
    // #if SYMMETRY_ON
    phi = min(phi, u_divisor - phi);
    // #endif
    phi += u_roll - u_offset;

    // Convert back to the texture coordinate.
    vec2 uv = vec2(cos(phi), sin(phi)) * r + 0.5;

    // Reflection at the border of the screen.
    uv = max(min(uv, 2.0 - uv), -uv);

    outColor = texture(u_texture, uv);

}