// src/components/Profile.jsx

import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import { getCurrentUserEmail } from "../services/authService";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(true);
  const [secureMsg, setSecureMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // user not logged in
      setLoading(false);
      return;
    }

    // read from localStorage first (instant display)
    const storedName = localStorage.getItem("userName") || "Traveller";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedMemberSince =
      localStorage.getItem("memberSince") || new Date().toLocaleDateString();

    setName(storedName);
    setMemberSince(storedMemberSince);
    setEmail(storedEmail);

    // then confirm with secure backend
    const load = async () => {
      try {
        const backendEmail = await getCurrentUserEmail();
        if (backendEmail) {
          setEmail(backendEmail);
          setSecureMsg(`Logged in as: ${backendEmail}`);
        } else if (storedEmail) {
          setSecureMsg(`Logged in as: ${storedEmail}`);
        } else {
          setSecureMsg("");
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setSecureMsg("");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card glass loading-card">
          <div className="spinner" />
          <p>Loading your travel profile...</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card glass not-logged">
          <h2>You're not logged in</h2>
          <p>Please login or sign up from the navbar to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">
        <div className="profile-header">
          <div className="avatar-circle">
            {name ? name.charAt(0).toUpperCase() : "T"}
          </div>
          <div>
            <h2 className="profile-name">{name}</h2>
            <p className="profile-email">{email}</p>
            <p className="member-since">Member since {memberSince}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-label">Trips Planned</span>
            <span className="stat-value">04</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Countries Visited</span>
            <span className="stat-value">02</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Wishlist Spots</span>
            <span className="stat-value">09</span>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="primary-btn"
            onClick={() => (window.location.href = "/itinerary")}
          >
            ✈ Plan New Trip
          </button>
          <button
            className="secondary-btn"
            onClick={() => (window.location.href = "/payments")}
          >
            💳 View Payments
          </button>
        </div>

        {secureMsg && (
          <div className="secure-badge">
            🔐 Secure session: <span>{secureMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
