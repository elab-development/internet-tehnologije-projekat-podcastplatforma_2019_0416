import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';
import AdminOnly from '../components/AdminOnly';
import { Button } from '../Button';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    episodes: 0,
    guests: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      };

      // Ovdje možeš dodati API pozive za statistiku kada budu spremni
      // const episodesResponse = await axios.get('http://localhost:8000/api/episodes', config);
      // const guestsResponse = await axios.get('http://localhost:8000/api/guests', config);
      
      // Za sada, postavljamo placeholder vrijednosti
      setStats({
        episodes: 15, // Zamijeni sa stvarnim podacima
        guests: 8,    // Zamijeni sa stvarnim podacima
        users: 124    // Zamijeni sa stvarnim podacima
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-panel"><p>Loading admin panel...</p></div>;
  }

  return (
    <AdminOnly>
      <div className="admin-panel">
        <div className="admin-panel__header">
          <h1>Admin Panel</h1>
          <p>Manage your podcast platform</p>
        </div>

        <div className="admin-panel__stats">
          <div className="stat-card">
            <h3>Total Episodes</h3>
            <p className="stat-number">{stats.episodes}</p>
          </div>
          <div className="stat-card">
            <h3>Total Guests</h3>
            <p className="stat-number">{stats.guests}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>

        <div className="admin-panel__actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Button 
              link="/upload"
              buttonStyle="btn--primary"
              buttonSize="btn--large"
            >
              Upload New Episode
            </Button>
            
            <Button 
              onClick={() => console.log('Open add guest modal')}
              buttonStyle="btn--primary"
              buttonSize="btn--large"
            >
              Add New Guest
            </Button>
            
            <Button 
              onClick={() => console.log('Open user management')}
              buttonStyle="btn--primary" 
              buttonSize="btn--large"
            >
              Manage Users
            </Button>
            
            <Button 
              onClick={() => console.log('Open analytics')}
              buttonStyle="btn--primary"
              buttonSize="btn--large"
            >
              View Analytics
            </Button>
          </div>
        </div>

        <div className="admin-panel__recent">
          <h2>Recent Activity</h2>
          <div className="recent-activity">
            <p>No recent activity to display</p>
            {/* Ovdje možeš dodati listu nedavnih epizoda, gostiju, itd. */}
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default AdminPanel;