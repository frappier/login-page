import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      
      // Sign in with Supabase auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      // Success notification
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Welcome back</h1>
        <p>Sign in to your account</p>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>
          <Link to="/recovery" className="auth-link">
            Forgot your login or password?
          </Link>
        </p>
        <p style={{ marginTop: '10px' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Join now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
