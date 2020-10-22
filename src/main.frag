in vec3 pos_world;

uniform vec3 u_color;

// get normal from vertex shader
varying vec3 world_normal;
varying vec3 world_position;

// camera position and skybox sampler
uniform samplerCube skybox;
uniform float n1;
uniform float n2;



void main()
{
  vec3 I = normalize(world_position - cameraPosition);
  I = vec3(-I.x, I.y, I.z);

  vec3 real_normal = normalize(vec3(-world_normal.x, world_normal.y, world_normal.z));

  vec3 Reflected = reflect(I, real_normal);
  vec3 Refracted = refract(I, real_normal, n1 / n2);

  float cosThetaI = dot(-I, real_normal);
  float cosThetaT = dot(Refracted, -real_normal);

//  float R_0 = pow((n1 - n2) / (n1 + n2), 2.0);

  float R;

  float R_normal = pow( (n1 * cosThetaI - n2 * cosThetaT) / (n1 * cosThetaI + n2 * cosThetaT) , 2.0);
  float R_tangent = pow( (n2 * cosThetaI - n1 * cosThetaT) / (n2 * cosThetaI + n1 * cosThetaT) , 2.0);

  if (Refracted.x == 0.0 && Refracted.y == 0.0 && Refracted.z == 0.0) {
    R = 1.0;
  } else {
    R = (R_normal + R_tangent) / 2.0;
  }

//  R = R_0 + (1.0 - R_0) * pow(1.0 - cosThetaI, 5.0);


  vec3 reflectionColor = textureCube(skybox, Reflected).rgb;
  vec3 refractionColor = textureCube(skybox, Refracted).rgb;

  gl_FragColor = vec4( reflectionColor * R + refractionColor * (1.0 - R) , 1.0);
}