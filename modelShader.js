export const modelVertext = `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
export const modelFragment = `
uniform vec4 uModelColor;
varying vec3 vPosition;
uniform float height;

void main() {
  //模型的基础颜色
  vec4 distColor= uModelColor; 
  // 流动范围当前点z的高度加上流动线的高度
  float topY = vPosition.y +0.02;
  if (height > vPosition.z) {
    // 颜色渐变 
    distColor.a = 0.0;
  }
  gl_FragColor = distColor;
}
`;
