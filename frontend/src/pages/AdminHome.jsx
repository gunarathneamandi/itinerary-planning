import { useState, useEffect } from "react";

const AdminHome = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUsername(user.username);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to login page
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav style={styles.navbar}>
                <h2 style={styles.logo}>Admin Dashboard</h2>
                <ul style={styles.navLinks}>
                    <li><a href="/view-hotel">View Hotel</a></li>
                    <li><a href="/view-attraction">View Attraction</a></li>
                    <li><a href="/add-hotel">Add Hotel</a></li>
                    <li><a href="/add-attraction">Add Attraction</a></li>
                    <li><a href="/view-booking">View Booking</a></li>
                    <li><button onClick={handleLogout} style={styles.logoutBtn}>Logout</button></li>
                </ul>
            </nav>

            {/* Main Content */}
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Welcome, {username || "Admin"}!</h2>
                <p>Select an option from the navigation bar.</p>
            </div>
        </div>
    );
};

// Styles for the navbar
const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#333",
        padding: "10px 20px",
        color: "white"
    },
    logo: {
        margin: 0
    },
    navLinks: {
        listStyle: "none",
        display: "flex",
        gap: "15px",
        margin: 0,
        padding: 0
    },
    logoutBtn: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "5px"
    }
};

export default AdminHome;
