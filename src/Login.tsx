import React, { createContext, useContext, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isRegistering) {
        await auth.register(name, email, password, passwordConfirmation);
      } else {
        await auth.login(email, password);
      }
      navigate('/inventory');
    } catch (error) {
      setError(isRegistering ? 'Registration failed' : 'Invalid username or password.');
    }
  };

  const triggerStateAndClear = (state: boolean) => {
    setIsRegistering(state);
    setEmail('');
    setPassword('');
    setPasswordConfirmation('')
    setShowPassword(false);
  }

  return (
    <div className="login-page">
      <div className="login-box">
        
        <div className="login-header">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isRegistering ? 8 : undefined}
            />
          </div>
          
          {isRegistering && (
            <div className="input-group">
              <label htmlFor="password-confirm">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password-confirm"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label htmlFor="show-password">Show Password</label>
          </div>

        <div className="ptext">
            <span 
            >
                {isRegistering ? 'Already have an account?' : 'Need an account?'}
            </span>
            <span 
                className="toggle-text"
                onClick={() => triggerStateAndClear(!isRegistering)}
                style={{ cursor: 'pointer' }}
            >
                {isRegistering ? 'Login' : 'Register'}
            </span>
        </div>

    
          <button type="submit" className="login-btn">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;