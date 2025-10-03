import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../Button";
import './AdminPanel.css';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportNewsletterPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/newsletter-subscribers/export-pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Greška pri export-u PDF-a');
    }
  };

  const exportSuggestionsPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/suggestions/export-pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `suggestions-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Greška pri export-u PDF-a');
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Admin Panel</h1>

      {/* Statistika */}
      {/* <div className="stats-section">
        <h2>Statistika</h2>
        {loading ? (
          <p>Učitavanje statistike...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Ukupno Epizoda</h3>
              <p className="stat-number">{stats.total_episodes || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Ukupno Gostiju</h3>
              <p className="stat-number">{stats.total_guests || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Newsletter Pretplatnici</h3>
              <p className="stat-number">{stats.newsletter_subscribers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Komentari</h3>
              <p className="stat-number">{stats.suggestions_count || 0}</p>
            </div>
          </div>
        )}
      </div> */}

      {/* Glavne akcije */}
      <div className="actions-section">
        <h2>Glavne Akcije</h2>
        <div className="actions-grid">
          <Button 
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            link="/upload"
            className="action-btn"
          >
            📤 Upload Epizoda
          </Button>
          <Button 
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            link="/add-guest"
            className="action-btn"
          >
            👥 Dodaj Gosta
          </Button>
        </div>
      </div>

      {/* Export sekcija */}
      <div className="export-section">
        <h2>Export Podataka</h2>
        <div className="export-grid">
          <div className="export-card">
            <h3>Newsletter Pretplatnici</h3>
            <p>Exportuj listu svih pretplatnika na newsletter</p>
            <button 
              onClick={exportNewsletterPDF}
              className="export-btn"
            >
              📄 Export PDF
            </button>
          </div>
          
          <div className="export-card">
            <h3>Komentari i Sugestije</h3>
            <p>Exportuj sve komentare i sugestije korisnika</p>
            <button 
              onClick={exportSuggestionsPDF}
              className="export-btn"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}