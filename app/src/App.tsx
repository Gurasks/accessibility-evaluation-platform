import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EvaluationProvider } from './contexts/EvaluationContext';
import { QuestionProvider } from './contexts/QuestionContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login';
import Evaluations from './pages/Evaluations';
import Signup from './pages/SignUp';
import Results from './pages/Results';
import RespondEvaluation from './pages/RespondEvaluation';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EvaluationProvider>
          <QuestionProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Home />} />
                <Route path="admin" element={<Home />} />
                <Route path="evaluations" element={<Evaluations />} />
                <Route path="evaluation/:id" element={<Results />} />
                <Route path="respond/:id" element={<RespondEvaluation />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </QuestionProvider>
        </EvaluationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;