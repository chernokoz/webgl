///////////////////////////////////////////////////////////////////////////
// Builtin uniform
//
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
//
///////////////////////////////////////////////////////////////////////////

// send normal to the fragment shader
varying vec3 world_normal;
varying vec3 world_position;

out vec3 pos_world;

void main()
{
  world_normal = (inverse(transpose(modelMatrix)) * vec4(normal, 1)).xyz ;
  world_position = vec3(modelMatrix *  vec4(position, 1.0));
//  pos_world = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}