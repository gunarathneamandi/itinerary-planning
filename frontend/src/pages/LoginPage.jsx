import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    // Hardcoded credentials
    const USERNAME = "admin";
    const PASSWORD = "12345";


    // Login function as a constant method
    const handleLogin = () => {
        if (username === USERNAME && password === PASSWORD) {
            setMessage("Login successful!");
            navigate('/admin/home')
        } else {
            setMessage("Invalid username or password.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: "block", margin: "10px auto", padding: "8px" }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", margin: "10px auto", padding: "8px" }}
            />
            <button onClick={handleLogin} style={{ padding: "8px 20px", cursor: "pointer" }}>
                Login
            </button>
            <p>{message}</p>
        </div>
    );
};

export default LoginPage;
