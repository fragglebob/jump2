#version 300 es

uniform sampler2D tDiffuse;
uniform float _Offset;
uniform float _Divisor;
uniform float _Roll;
uniform float iTime;

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
    phi += _Offset;
    phi = phi - _Divisor * floor(phi / _Divisor);
    // #if SYMMETRY_ON
    phi = min(phi, _Divisor - phi);
    // #endif
    phi += _Roll - _Offset;

    // Convert back to the texture coordinate.
    vec2 uv = vec2(cos(phi), sin(phi)) * r + 0.5;

    // Reflection at the border of the screen.
    uv = max(min(uv, 2.0 - uv), -uv);

    outColor = texture2D(tDiffuse, uv);

}