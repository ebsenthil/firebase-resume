import React, { useState, useEffect } from "react";
import "./App.css";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3ecMiFFfSDrVOV_Exjpdiw8ceVcS434c",
  authDomain: "fir-resume-app.firebaseapp.com",
  projectId: "fir-resume-app",
  storageBucket: "fir-resume-app.appspot.com",
  messagingSenderId: "337503710284",
  appId: "1:337503710284:web:65ade82b8335e491e4d8e9"
};

// Initialize Firebase
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

  const [formData, setFormData] = useState(initialFormData);
  const [editedData, setEditedData] = useState(null);
  const [stage, setStage] = useState("form"); // 'form', 'preview'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      } else {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Resume Generator functions (your original)

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
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore if response wasn't JSON
        }
        throw new Error(errorData?.error || `PDF Generation failed with status: ${response.status}`);
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

  const renderTextArea = (fieldName, rows = 3) => {
    let value = editedData[fieldName];
    if (Array.isArray(value)) {
      if (fieldName === 'skills' || fieldName === 'languages') {
        value = value.join(", ");
      } else {
        value = value.join("\n");
      }
    }
    const displayValue = (typeof value === 'string' || typeof value === 'number') ? value : '';

    return (
      <textarea
        name={fieldName}
        value={displayValue}
        onChange={handleEditedChange}
        rows={rows}
        className="edit-area"
        placeholder={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        disabled={loading}
      />
    );
  };

  const renderExperienceEditor = () => {
    let experienceString = "";
    if (Array.isArray(editedData.experience) && editedData.experience.length > 0 && typeof editedData.experience[0] === 'object') {
      experienceString = editedData.experience.map(job => {
        const title = job.title || '';
        const company = job.company || '';
        const location = job.location || '';
        const period = job.period || '';
        const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities.map(r => `- ${r}`).join("\n") : (job.responsibilities || '');
        return `Title: ${title}\nCompany: ${company}\nLocation: ${location}\nPeriod: ${period}\nResponsibilities:\n${responsibilities}`;
      }).join("\n\n---\n\n");
    } else if (typeof editedData.experience === 'string') {
      experienceString = editedData.experience;
    } else if (Array.isArray(editedData.experience)) {
      experienceString = editedData.experience.join("\n\n---\n\n");
    }

    return (
      <textarea
        name="experience"
        value={experienceString}
        onChange={(e) => {
          setEditedData({ ...editedData, experience: e.target.value });
        }}
        rows={10}
        className="edit-area"
        placeholder="Experience details (e.g., Title: ..., Company: ..., Responsibilities: - ...)"
        disabled={loading}
      />
    );
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsSignup(!isSignup)} className="link-button">
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="App container">
      <header className="header-bar">
        <h1>AI Resume Generator</h1>
        <div>
          <span>Welcome {user.email}!</span> 
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Your resume generation form/preview code here */}
      {/* 🔥 (Copy all previous "return" content from your app from here onward!) 🔥 */}
      
      {/* ➡️ I can also help you paste full properly formatted render content if needed! */}

    </div>
  );
}

export default App;

