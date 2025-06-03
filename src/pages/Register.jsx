import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      
      // Register with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      })
      
      if (error) throw error
      
      // Store additional user data in the profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone
            }
          ])
        
        if (profileError) throw profileError
      }
      
      toast.success('Registration successful! You can now sign in.')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create an account</h1>
        <p>Join our platform today</p>
      </div>
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
