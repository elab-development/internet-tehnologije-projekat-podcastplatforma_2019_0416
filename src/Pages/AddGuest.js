import React, { useState } from 'react';
import axios from 'axios';
import AdminOnly from '../components/AdminOnly';
import { Button } from '../Button';

const AddGuest = () => {
  const [formData, setFormData] = useState({
    imePrezimeG: '',
    firma: '',
    bio: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      // Dodaj text polja
      submitData.append('imePrezimeG', formData.imePrezimeG);
      submitData.append('firma', formData.firma);
      submitData.append('bio', formData.bio);
      
      // Dodaj sliku ako postoji
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post('http://localhost:8000/api/guests', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Gost je uspješno dodat!');
      // Reset form
      setFormData({
        imePrezimeG: '',
        firma: '',
        bio: '',
        image: null
      });
      
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
      
    } catch (error) {
      console.error('Greška pri dodavanju gosta:', error);
      console.error('Error details:', error.response?.data);
      setMessage('Greška pri dodavanju gosta: ' + (error.response?.data?.message || error.message || 'Nepoznata greška'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dodaj Novog Gosta</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ime i Prezime:</label>
            <input
              type="text"
              name="imePrezimeG"
              value={formData.imePrezimeG}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unesite ime i prezime gosta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Firma:</label>
            <input
              type="text"
              name="firma"
              value={formData.firma}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unesite firmu gosta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografija:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unesite biografiju gosta"
            />
          </div>

          {/* DODATO POLJE ZA SLIKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profilna Slika:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">možete dodati profilnu sliku gosta</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit"
              buttonStyle="btn--primary"
              buttonSize="btn--large"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Dodavanje...' : 'Dodaj Gosta'}
            </Button>
            
            <Button 
              buttonStyle="btn--outline"
              buttonSize="btn--large"
              link="/admin"
              className="flex-1"
            >
              ← Nazad na Admin
            </Button>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('Greška') 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminOnly>
  );
};

export default AddGuest;