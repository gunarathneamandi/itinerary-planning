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
        <div style={styles.container}>
            {/* Logout Button in Top-Right Corner */}
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>

            <h1 style={styles.welcomeText}>Welcome</h1>
            

            {/* Cards for Admin Options */}
            <div style={styles.cardContainer}>
                <Card title="View Hotel" link="/admin/hotelview" />
                <Card title="View Attraction" link="/admin/viewattraction" />
                <Card title="Add Hotel" link="/admin/addhotel" />
                <Card title="Add Attraction" link="/admin/addattraction" />
                <Card title="View Booking" link="/admin/view-booking" />
            </div>
        </div>
    );
};

// Card Component
const Card = ({ title, link }) => {
    return (
        <a href={link} style={styles.card}>
            <h3>{title}</h3>
        </a>
    );
};

// Styles
const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
        position: "relative",
    },
    logoutBtn: {
        position: "absolute",
        top: "20px",
        right: "20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "12px 25px",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "18px",
    },
    welcomeText: {
        fontSize: "42px",
        fontWeight: "bold",
        marginBottom: "15px",
    },
    subText: {
        fontSize: "20px",
        marginBottom: "30px",
    },
    cardContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // Ensures 3 cards per row
        gap: "40px",
        justifyContent: "center",
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
    },
    card: {
        width: "320px", // Increased width
        height: "200px", // Increased height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "15px",
        textDecoration: "none",
        color: "#333",
        fontSize: "22px",
        fontWeight: "bold",
        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        transition: "0.3s",
    }
};

export default AdminHome;
