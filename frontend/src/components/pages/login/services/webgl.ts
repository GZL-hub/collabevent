export class Renderer {
  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private fragmentSrc = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;

// Noise function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 pos = uv * 4.0;
  
  float n1 = noise(pos + time * 0.1);
  float n2 = noise(pos * 2.0 + time * 0.15);
  float n3 = noise(pos * 4.0 + time * 0.2);
  
  float wave = sin(pos.x + time * 0.5) * 0.5 + 0.5;
  float wave2 = sin(pos.y + time * 0.3) * 0.5 + 0.5;
  
  vec3 color1 = vec3(0.2, 0.4, 0.8); // Blue
  vec3 color2 = vec3(0.4, 0.2, 0.8); // Purple
  vec3 color3 = vec3(0.1, 0.3, 0.6); // Dark blue
  
  vec3 finalColor = mix(color1, color2, wave);
  finalColor = mix(finalColor, color3, wave2);
  finalColor += (n1 + n2 * 0.5 + n3 * 0.25) * 0.3;
  
  // Add some flowing patterns
  float flow = sin(uv.x * 3.14159 + time * 0.4) * sin(uv.y * 3.14159 + time * 0.6);
  finalColor += flow * 0.2;
  
  O = vec4(finalColor, 1.0);
}`;

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  private canvas: HTMLCanvasElement;
  private scale: number;
  private gl: WebGL2RenderingContext;
  private shaderSource: string;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext('webgl2')!;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.shaderSource = this.fragmentSrc;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER)!;
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }

  init() {
    const { gl, program } = this;
    if (!program) return;
    
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    
    (program as any).resolution = gl.getUniformLocation(program, 'resolution');
    (program as any).time = gl.getUniformLocation(program, 'time');
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f((program as any).resolution, canvas.width, canvas.height);
    gl.uniform1f((program as any).time, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  cleanup() {
    const { gl, program, vs, fs, buffer } = this;
    if (buffer) gl.deleteBuffer(buffer);
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    if (program) gl.deleteProgram(program);
  }
}

export default Renderer;