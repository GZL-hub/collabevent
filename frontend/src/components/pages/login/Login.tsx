import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

// WebGL Renderer class for shader animation
class Renderer {
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

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Canvas refs and animation variables
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Initialize WebGL shader animation for left side only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio);
    
    const resize = () => {
      const { innerWidth: width, innerHeight: height } = window;
      // Canvas only covers left half
      canvas.width = (width / 2) * dpr;
      canvas.height = height * dpr;
      canvas.style.width = (width / 2) + 'px';
      canvas.style.height = height + 'px';
      if (rendererRef.current) {
        rendererRef.current.updateScale(dpr);
      }
    };

    try {
      rendererRef.current = new Renderer(canvas, dpr);
      rendererRef.current.setup();
      rendererRef.current.init();
      resize();

      const loop = (now: number) => {
        if (rendererRef.current) {
          rendererRef.current.render(now);
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop(0);

      const handleResize = () => resize();
      window.addEventListener('resize', handleResize);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (rendererRef.current) {
          rendererRef.current.cleanup();
        }
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('WebGL initialization failed:', error);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setError('');
  };

  const switchToLogin = () => {
    setIsSignUp(false);
    setError('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Animated Background */}
      <div className="relative w-1/2">
        {/* WebGL Canvas Animation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Brand Info */}
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold mb-4">CollabEvent</h1>
            <p className="text-xl opacity-90 mb-6">Event Management Software</p>
          </div>
        </div>
      </div>

      {/* Right Side - Sliding Forms Container */}
      <div className="w-1/2 bg-white relative overflow-hidden">
        {/* Sliding Container */}
        <div 
          className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${
            isSignUp ? '-translate-x-1/2' : 'translate-x-0'
          }`}
          style={{ width: '200%' }}
        >
          {/* Login Form */}
          <div className="w-1/2 flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Demo Credentials Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-600 text-sm">
                    <strong>Test Accounts:</strong><br />
                    Admin: admin@collabevent.com / Admin@123<br />
                    Manager: john@collabevent.com / manager123
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Switch to Sign Up */}
                <button
                  type="button"
                  onClick={switchToSignUp}
                  className="w-full py-3 px-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="w-1/2 flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md px-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join CollabEvent today</p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="signup-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-purple-600 hover:text-purple-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-purple-600 hover:text-purple-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>

                {/* Switch to Login */}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="w-full py-3 px-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        Secure login powered by CollabEvent
      </div>
    </div>
  );
};

export default Login;