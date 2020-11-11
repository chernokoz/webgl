/////////////////////////////////////////////////////////////////////////////
//// Builtin uniform
////
//// uniform mat4 modelMatrix;
//// uniform mat4 modelViewMatrix;
//// uniform mat4 projectionMatrix;
////
/////////////////////////////////////////////////////////////////////////////

//#include <packing>
//
//out vec3 pos_world;
//varying vec2 vUv;
//
//void main()
//{
//  pos_world = (modelMatrix * vec4(position, 1.0)).xyz;
//  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//
//  vUv = uv;
//  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//}

  #include <common>
  #include <fog_pars_vertex>
  #include <shadowmap_pars_vertex>

  varying vec2 vUv;

void main() {
  vUv = uv;

  #include <begin_vertex>
  #include <project_vertex>
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>
}