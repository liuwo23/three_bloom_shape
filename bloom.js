import * as THREE from "three";

function bloomPassX(maskTexture) {
    return new THREE.ShaderMaterial({
        vertexShader: `// 顶点着色器
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
			`,
        fragmentShader: `// 片元着色器
                uniform sampler2D textureSampler;
                varying vec2 vUv;

                void main() {
                    float TexelIncrement = 0.005;
                    // float2 QuadTexelOffsets = float2(0.0,0.0);
                    // float2 Coord = float2(TexCoord.xy);

                    float WT9_NORMALIZE = 6.0;
                    float WT9_0 = 1.0;
                    float WT9_1 = 0.8;
                    float WT9_2 = 0.6;
                    float WT9_3 = 0.4;
                    float WT9_4 = 0.2;

                    float colour = texture(textureSampler,vec2(vUv.x + TexelIncrement, vUv.y)).r * (0.8/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2((vUv.x + 2.0 * TexelIncrement), vUv.y)).r * (WT9_2/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x +3.0 * TexelIncrement, vUv.y)).r * (WT9_3/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x +4.0 * TexelIncrement, vUv.y)).r * (WT9_4/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x, vUv.y)).r * (WT9_0/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x - 1.0 * TexelIncrement, vUv.y)).r * (WT9_1/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x - 2.0 * TexelIncrement, vUv.y)).r * (WT9_2/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x - 3.0 * TexelIncrement, vUv.y)).r * (WT9_3/WT9_NORMALIZE);
                    colour += texture(textureSampler, vec2(vUv.x - 4.0 * TexelIncrement, vUv.y)).r * (WT9_4/WT9_NORMALIZE);

                    // vec4 color = vec4(vUv.x,vUv.y,0.0,1.0);

                    // vec4 color2 = texture(textureSampler, vUv);
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0 - colour);
                    // gl_FragColor = color;
                }
			`,
        uniforms: {
            textureSampler: {
                value: maskTexture
            },
        },
    });
}

function bloomPassY(maskTexture, blurXTexture) {
    return new THREE.ShaderMaterial({
        vertexShader: `// 顶点着色器
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
			`,
        fragmentShader: `// 片元着色器
                uniform sampler2D blurX;
                uniform sampler2D textureSampler;
                varying vec2 vUv;

                void main() {
                    float TexelIncrement = 0.005;
                    // float2 QuadTexelOffsets = float2(0.0,0.0);
                    // float2 Coord = float2(TexCoord.xy);

                    float WT9_NORMALIZE = 6.0;
                    float WT9_0 = 1.0;
                    float WT9_1 = 0.8;
                    float WT9_2 = 0.6;
                    float WT9_3 = 0.4;
                    float WT9_4 = 0.2;
                    float WT9_5 = 0.1;

                    float colour = texture(blurX,vec2(vUv.x, vUv.y + TexelIncrement)).w * (0.8/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y + 2.0 * TexelIncrement)).w * (WT9_2/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y + 3.0 * TexelIncrement)).w * (WT9_3/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y + 4.0 * TexelIncrement)).w * (WT9_4/WT9_NORMALIZE);
                    // colour += texture(blurX, vec2(vUv.x, vUv.y + 4.0 * TexelIncrement)).w * (WT9_5/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y)).w * (WT9_0/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y - 1.0 * TexelIncrement)).w * (WT9_1/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y - 2.0 * TexelIncrement)).w * (WT9_2/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y - 3.0 * TexelIncrement)).w * (WT9_3/WT9_NORMALIZE);
                    colour += texture(blurX, vec2(vUv.x, vUv.y - 4.0 * TexelIncrement)).w * (WT9_4/WT9_NORMALIZE);

                    vec4 glownColor = vec4(0.0,1.0,1.0,1.0) * colour;
                    float opacity = texture(textureSampler, vUv).r;
                    gl_FragColor = vec4(opacity * glownColor.rgb,1.0);
                }
			`,
        uniforms: {
            blurX: {
                value: blurXTexture
            },
            textureSampler: {
                value: maskTexture
            },
        },

    });
}

function imgPass(maskTexture) {
    return new THREE.ShaderMaterial({
        vertexShader: `// 顶点着色器
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
			`,
        fragmentShader: `// 片元着色器
                uniform sampler2D textureSampler;
                varying vec2 vUv;

                void main() {
                    vec4 color2 = texture(textureSampler, vUv);

                    gl_FragColor = color2;
                }
			`,
        uniforms: {
            textureSampler: {
                value: maskTexture
            },
        },
    });
}

export {
    bloomPassX,
    bloomPassY,
    imgPass
};