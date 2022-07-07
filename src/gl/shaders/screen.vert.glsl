#version 300 es

in vec4 position;
in vec2 texcoord;
in vec3 normal;

out vec4 v_position;
out vec2 v_texCoord;

void main() {
  v_texCoord = texcoord;
  v_position = position;
  gl_Position = v_position;
}