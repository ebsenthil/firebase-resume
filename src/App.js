// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// ✅ Initialize Firebase (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyA3ecMiFFfSDrVOV_Exjpdiw8ceVcS434c",
  authDomain: "fir-resume-app.firebaseapp.com",
  projectId: "fir-resume-app",
  storageBucket: "fir-resume-app.appspot.com",
  messagingSenderId: "337503710284",
  appId: "1:337503710284:web:65ade82b8335e491e4d8e9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    education: "",
    experience: "",
    certifications: "",
    skills: "",
    languages: "",
    extracurricular: "",
    jobDescription: "",
  };

  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [authError, setAuthError] = useState("");

  const [formData, setFormData] = useState(initialFormData);
  const [editedData, setEditedData] = useState(null);
  const [stage, setStage] = useState("form"); // 'form', 'preview'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleAuthInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      setAuthError("");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      setAuthError("");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setAuthForm({ email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditedChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setEditedData(null);
    setStage("form");
    setError("");
    setSuccessMessage("");
    setLoading(false);
  };

  const handleGenerateResume = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.jobDescription) {
      setError("Please provide at least your Name and the Job Description.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://2no2a0hmtd.execute-api.us-east-1.amazonaws.com/dev/resume-view2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const formattedData = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : (data.skills ? String(data.skills).split(/,|\n/).map(s => s.trim()).filter(Boolean) : []),
        experience: Array.isArray(data.experience) ? data.experience : (data.experience ? [{ responsibilities: String(data.experience).split('\n').filter(Boolean) }] : []),
        education: Array.isArray(data.education) ? data.education : (data.education ? String(data.education).split('\n').map(s => s.trim()).filter(Boolean) : []),
        certifications: Array.isArray(data.certifications) ? data.certifications : (data.certifications ? String(data.certifications).split('\n').map(s => s.trim()).filter(Boolean) : []),
        languages: Array.isArray(data.languages) ? data.languages : (data.languages ? String(data.languages).split(/,|\n/).map(s => s.trim()).filter(Boolean) : []),
        extracurricular: Array.isArray(data.extracurricular) ? data.extracurricular : (data.extracurricular ? String(data.extracurricular).split('\n').map(s => s.trim()).filter(Boolean) : []),
      };

      setEditedData(formattedData);
      setStage("preview");
      setSuccessMessage("✅ Resume generated successfully! Review and edit below.");
    } catch (err) {
      console.error("Resume generation failed:", err);
      setError(`Resume generation failed: ${err.message}. Please check your input or try again.`);
      setEditedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!editedData) {
      setError("No resume data available to download.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://e73kxnqelj.execute-api.us-east-1.amazonaws.com/dev/resume-pdf2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error(`PDF Generation failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = editedData.name ? editedData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'resume';
      a.download = `${safeName}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setSuccessMessage("✅ PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError(`PDF download failed: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>Login / Signup</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={authForm.email}
          onChange={handleAuthInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={authForm.password}
          onChange={handleAuthInputChange}
        />
        {authMode === "login" ? (
          <>
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? <span className="link" onClick={() => setAuthMode("signup")}>Sign Up</span></p>
          </>
        ) : (
          <>
            <button onClick={handleSignup}>Sign Up</button>
            <p>Already have an account? <span className="link" onClick={() => setAuthMode("login")}>Login</span></p>
          </>
        )}
        {authError && <div className="error-toast">{authError}</div>}
      </div>
    );
  }

  // ✅ If authenticated user, show your resume app
  return (
    <>
      <div className="auth-header">
        <span>Welcome, {user.email}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* 🔥 Your full app here unchanged 🔥 */}
      {/* ... (YOUR ORIGINAL FUNCTIONALITY) ... */}
      {/* Continue with your <h1>AI Resume Generator</h1> and other sections */}

