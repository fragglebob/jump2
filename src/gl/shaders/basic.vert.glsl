#version 300 es

uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_projection;

in vec4 position;
in vec3 normal;
in vec2 texcoord;

out vec4 v_position;
out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  v_texCoord = texcoord;
  v_position = (u_projection * u_view * u_world) * position;
  v_normal = (transpose(inverse(u_world)) * vec4(normal, 0)).xyz;
  v_surfaceToLight = u_lightWorldPos - (u_world * position).xyz;
  v_surfaceToView = (u_view[3] - (u_world * position)).xyz;
  gl_Position = v_position;
}