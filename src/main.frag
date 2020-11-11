//in vec3 pos_world;
//
//uniform sampler2D h;
//uniform sampler2D img1;
//uniform sampler2D img2;
//uniform sampler2D img3;
//uniform vec3 u_color;
//
//varying vec2 vUv;
//
//vec4 get_snow_color(vec2 uv) {
//  while (uv.x > 0.1) {
//    uv.x = uv.x - 0.1;
//  }
//
//  while (uv.y > 0.1) {
//    uv.y = uv.y - 0.1;
//  }
//
//  uv.x *= 10.0;
//  uv.y *= 10.0;
//
//  return vec4(texture2D(img3, uv));
//}
//
//vec4 get_grass_color(vec2 uv) {
//  while (uv.x > 0.1) {
//    uv.x = uv.x - 0.1;
//  }
//
//  while (uv.y > 0.1) {
//    uv.y = uv.y - 0.1;
//  }
//
//  uv.x *= 10.0;
//  uv.y *= 10.0;
//
//  return vec4(texture2D(img2, uv));
//}
//
//vec4 get_water_color(vec2 uv) {
//  int i = 0;
//  while (uv.x > 0.1) {
//    i++;
//    uv.x = uv.x - 0.1;
//  }
//
//  int j = 0;
//  while (uv.y > 0.1) {
//    j++;
//    uv.y = uv.y - 0.1;
//  }
//
//  uv.x = uv.x * 10.0;
//  uv.y = uv.y * 10.0;
//
//  return vec4(texture2D(img1, uv));
//}
//
//void main()
//{
//  vec3 outgoingLight = vec3(1.0);
//
//  float shadowMask = 1.0;
//
//  float height = texture2D(h, vUv).x;
//  if (height < 0.35) {
//    gl_FragColor = get_water_color(vUv);
//  } else if (height > 0.7) {
//    gl_FragColor = get_snow_color(vUv);
//  } else if (height > 0.4) {
//    gl_FragColor = get_grass_color(vUv);
////    gl_FragColor = vec4(texture2D(img2, vUv));
//  } else {
//    gl_FragColor = vec4(0.5, 0.5, 0.01, 0.5);
//  }
//}


#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <dithering_pars_fragment>

uniform sampler2D h;
uniform sampler2D img1;
uniform sampler2D img2;
uniform sampler2D img3;
uniform vec3 u_color;

varying vec2 vUv;

vec4 get_snow_color(vec2 uv) {
  while (uv.x > 0.1) {
    uv.x = uv.x - 0.1;
  }

  while (uv.y > 0.1) {
    uv.y = uv.y - 0.1;
  }

  uv.x *= 10.0;
  uv.y *= 10.0;

  return vec4(texture2D(img3, uv));
}

vec4 get_grass_color(vec2 uv) {
  while (uv.x > 0.1) {
    uv.x = uv.x - 0.1;
  }

  while (uv.y > 0.1) {
    uv.y = uv.y - 0.1;
  }

  uv.x *= 10.0;
  uv.y *= 10.0;

  return vec4(texture2D(img2, uv));
}

vec4 get_water_color(vec2 uv) {
  int i = 0;
  while (uv.x > 0.1) {
    i++;
    uv.x = uv.x - 0.1;
  }

  int j = 0;
  while (uv.y > 0.1) {
    j++;
    uv.y = uv.y - 0.1;
  }

  uv.x = uv.x * 10.0;
  uv.y = uv.y * 10.0;

  return vec4(texture2D(img1, uv));
}

void main() {
  vec3 finalColor = vec3(0, 0.75, 0);

  float height = texture2D(h, vUv).x;
  if (height < 0.35) {
    finalColor = get_water_color(vUv).xyz;
  } else if (height > 0.7) {
    finalColor = get_snow_color(vUv).xyz;
  } else if (height > 0.4) {
    finalColor = get_grass_color(vUv).xyz;
    //    gl_FragColor = vec4(texture2D(img2, vUv));
  } else {
    finalColor = vec4(0.5, 0.5, 0.01, 0.5).xyz;
  }

  vec3 shadowColor = vec3(0, 0, 0);
  float shadowPower = 0.5;
  // ------------------------------

  // it just mixes the shadow color with the frag color
  gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
  #include <fog_fragment>
  #include <dithering_fragment>
}