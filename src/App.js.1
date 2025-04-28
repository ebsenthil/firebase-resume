// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";  // ✅ Import your Firebase configuration
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";

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

    // 👇 Firebase Authentication States
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");

    // 👇 Monitor User Login State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser?.email) {
                setFormData((prev) => ({ ...prev, email: currentUser.email }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLoginSignup = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (authMode === "login") {
                await signInWithEmailAndPassword(auth, authEmail, authPassword);
            } else {
                await createUserWithEmailAndPassword(auth, authEmail, authPassword);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setFormData(initialFormData);
        setEditedData(null);
        setStage("form");
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
            setError(`Resume generation failed: ${err.message}.`);
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
                } catch (e) { }
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

    // 🔥 Authentication view: if no user logged in, show login/signup page
    if (!user) {
        return (
            <div className="auth-container">
                <h2>{authMode === "login" ? "Login" : "Sign Up"}</h2>
                <form onSubmit={handleLoginSignup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{authMode === "login" ? "Login" : "Sign Up"}</button>
                </form>
                <p onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="auth-toggle">
                    {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
                {error && <div className="error">{error}</div>}
            </div>
        );
    }

    // 🔥 Normal Resume Builder app if user is authenticated
    return (
        <>
            <div className="logout-profile">
                <p>Welcome, {user.email}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            {/* Your Full Resume App */}
            {/* Copy rest of your main App content here below */}
            {/* ... */}
        </>
    );
}

export default App;

