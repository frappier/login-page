import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-toastify'

const Recovery = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleRecovery = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    try {
      setLoading(true)
      
      // Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      
      if (error) throw error
      
      setSubmitted(true)
      toast.success('Recovery instructions sent to your email')
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Password Recovery</h1>
        <p>We'll send you instructions to reset your password</p>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleRecovery}>
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
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send recovery instructions'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p>Check your email for recovery instructions.</p>
          <p style={{ marginTop: '10px' }}>
            Didn't receive an email? Check your spam folder or try again.
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            Try again
          </button>
        </div>
      )}
      
      <div className="auth-footer">
        <p>
          Remember your password?{' '}
          <Link to="/" className="auth-link">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Recovery
