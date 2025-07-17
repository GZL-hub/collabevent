interface LoginResponse {
  success: boolean;
  message?: string;
  user?: any;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  user?: any;
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
      localStorage.setItem('user', JSON.stringify(data.user));
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
      localStorage.setItem('user', JSON.stringify(data.user));
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