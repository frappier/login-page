import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          
          // Fetch user profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            throw error
          }
          
          if (data) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error(error.message || 'Error signing out')
    }
  }

  if (loading) {
    return (
      <div className="auth-container" style={{ textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <div className="auth-header">
        <h1>Welcome, {profile?.full_name || user?.email}</h1>
        <p>You're successfully logged in</p>
      </div>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Your Profile</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Email:</strong> {user?.email}
        </div>
        
        {profile?.full_name && (
          <div style={{ marginBottom: '10px' }}>
            <strong>Full Name:</strong> {profile.full_name}
          </div>
        )}
        
        {profile?.phone && (
          <div style={{ marginBottom: '10px' }}>
            <strong>Phone:</strong> {profile.phone}
          </div>
        )}
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Account Created:</strong> {new Date(user?.created_at).toLocaleDateString()}
        </div>
      </div>
      
      <button 
        onClick={handleSignOut} 
        className="btn btn-primary"
      >
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
