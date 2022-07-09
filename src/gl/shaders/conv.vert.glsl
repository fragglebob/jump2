#version 300 es

uniform vec2 u_imageIncrement;
uniform vec2 u_resolution;

in vec2 texcoord;
in vec4 position;

out vec4 v_position;
out vec2 v_texCoord;                                
out vec2 v_vUv;
out vec2 v_scaledImageIncrement;

void main()
{
    v_scaledImageIncrement = u_imageIncrement * u_resolution;
    v_vUv = texcoord.st - ( ( 25.0 - 1.0 ) / 2.0 ) * v_scaledImageIncrement;
    v_position = position;
    gl_Position = v_position;
}