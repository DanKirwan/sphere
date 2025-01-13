import { CubeTexture, DoubleSide, LinearFilter, Mesh, OrthographicCamera, PixelFormat, PlaneGeometry, RGBAFormat, Scene, ShaderMaterial, TextureDataType, UnsignedByteType, WebGLRenderer, WebGLRenderTarget } from 'three';

/**
 * Fragment shader that maps a cube map to an equirectangular projection.
 * Adapted from: https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/CubeToEquirectFragment.js
 */
const cubeToEquirectFragmentShader = `
uniform samplerCube envMap;
uniform float flipX;
varying vec2 vUV;

void main() {
  // Map from [0..1] to [-1..1]
  vec2 uv = vUV * 2.0 - 1.0;
  float longitude = uv.x * 3.141592653589793;   // -PI to PI
  float latitude  = uv.y * 0.5 * 3.141592653589793; // -PI/2 to PI/2
  
  // Convert lat/long to direction vector
  vec3 dir;
  dir.x =  cos( latitude ) * cos( longitude );
  dir.y =  sin( latitude );
  dir.z =  cos( latitude ) * sin( longitude );
  
  // Flip X if requested (sometimes needed depending on orientation)
  dir.x *= flipX;

  // Sample the cube map
  vec3 color = textureCube(envMap, normalize(dir)).rgb;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

const cubeToEquirectVertexShader = `
varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * A simple ShaderMaterial that transforms a samplerCube into an equirectangular view.
 * Usage:
 *   const material = new CubeToEquirectMaterial(cubeMapTexture);
 */
export class CubeToEquirectMaterial extends ShaderMaterial {
    constructor(envMap: CubeTexture, flipX = 1.0) {
        super({
            name: 'CubeToEquirectMaterial',
            uniforms: {
                envMap: { value: envMap },
                flipX: { value: flipX },
            },
            vertexShader: cubeToEquirectVertexShader,
            fragmentShader: cubeToEquirectFragmentShader,
            side: DoubleSide,
            transparent: false
        });
    }
}



interface CubeToEquirectOptions {
    width?: number;         // default: 2048
    height?: number;        // default: 1024 (2:1 aspect)
    flipX?: number;         // default: 1.0 (no flip), or -1.0 to flip horizontally
    format?: PixelFormat;  // default: THREE.RGBAFormat
    type?: TextureDataType; // default: THREE.UnsignedByteType (for PNG/JPEG)
}

/**
 * Convert a cube map texture to equirectangular and return a canvas.
 * @param renderer  The THREE.WebGLRenderer instance
 * @param cubeMap   The cube texture (e.g., from a CubeCamera or loaded)
 * @param options   Conversion settings
 * @returns         A canvas containing the equirectangular image
 */
export function cubeToEquirectangular(
    renderer: WebGLRenderer,
    cubeMap: CubeTexture,
    options: CubeToEquirectOptions = {}
): HTMLCanvasElement {
    const {
        width = 2048,
        height = 1024,
        flipX = 1.0,
        format = RGBAFormat,
        type = UnsignedByteType,
    } = options;

    // 1) Create a render target for the equirectangular output (2:1 aspect)
    const equirectRT = new WebGLRenderTarget(width, height, {
        format,
        type,
        magFilter: LinearFilter,
        minFilter: LinearFilter,
    });
    equirectRT.texture.name = 'EquirectangularRenderTarget';

    // 2) Set up an orthographic camera (covers the whole screen quad from -1..1)
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3) Create a scene and a plane geometry for the full-screen quad
    const scene = new Scene();
    const geometry = new PlaneGeometry(2, 2);

    // 4) Create the shader material that does the cube->equirect mapping
    const material = new CubeToEquirectMaterial(cubeMap, flipX);

    // 5) Create a mesh with that material and add to the scene
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // 6) Render to the equirectRT
    const currentRenderTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(equirectRT);
    renderer.render(scene, camera);
    renderer.setRenderTarget(currentRenderTarget);

    // 7) Create a canvas to extract pixel data
    const pixelBuffer = new Uint8Array(width * height * 4);
    renderer.readRenderTargetPixels(equirectRT, 0, 0, width, height, pixelBuffer);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas.');
        return canvas;
    }

    // 8) Copy pixelBuffer into the canvas
    const imageData = new ImageData(new Uint8ClampedArray(pixelBuffer), width, height);
    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

