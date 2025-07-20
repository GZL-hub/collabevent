interface LoginResponse {
  success: boolean;
  message?: string;
  user?: any;
  token?: string; // Add token to interface
}

interface SignupResponse {
  success: boolean;
  message?: string;
  user?: any;
  token?: string; // Add token to interface
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
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
      // ✅ FIX: Store all authentication data properly
      console.log('Login response data:', data); // Debug log
      
      // Store the user object
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store user ID separately for easier access
        const userId = data.user._id || data.user.id;
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('✅ Stored user ID:', userId);
        }
      }
      
      // Store the token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token); // Backup key
        console.log('✅ Stored token');
      }
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Unable to connect to server. Please try again.'
    };
  }
};

export const signup = async (
  email: string, 
  username: string, 
  password: string
): Promise<SignupResponse> => {
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
      // ✅ FIX: Store all authentication data properly for signup too
      console.log('Signup response data:', data); // Debug log
      
      // Store the user object
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store user ID separately for easier access
        const userId = data.user._id || data.user.id;
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('✅ Stored user ID:', userId);
        }
      }
      
      // Store the token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token); // Backup key
        console.log('✅ Stored token');
      }
    }
    
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'Unable to connect to server. Please try again.'
    };
  }
};