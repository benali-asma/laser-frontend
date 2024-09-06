import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css'

function App() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/slots')
      .then(response => {
        setSlots(response.data);
      })
      .catch(error => {
        throw error;
      });
  }, []);

  const handleReserve = () => {
    axios.post('http://localhost:5000/api/reserve', { slotId: selectedSlot, name })
      .then(response => {
        setMessage(response.data.message);
        setSelectedSlot(null);
        setName('');
        setMessage("");
        return axios.get('http://localhost:5000/api/slots');
      })
      .then(response => {
        setSlots(response.data);
      })
      .catch(error => {
        setMessage('Error reserving slot');
        throw error
      });
  };

  return (
    <div>
      <h1>Laser Game Réservation</h1>
      <div>
        <h2>Créneaux Disponibles</h2>
        <ul>
          {slots.map(slot => (
            <li key={slot.id}>
              {slot.time} {slot.reserved ? '(Réservé)' : ''}
              {!slot.reserved && (
                <button onClick={() => setSelectedSlot(slot.id)}>Réserver</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {selectedSlot && (
        <div>
          <h2>Réserver</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez votre nom"
          />
          <button onClick={handleReserve}>Confirmer la Réservation</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
