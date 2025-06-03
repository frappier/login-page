import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Recovery from './pages/Recovery'
import Dashboard from './pages/Dashboard'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="auth-container" style={{ textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/recovery" 
          element={session ? <Navigate to="/dashboard" /> : <Recovery />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  )
}

export default App
