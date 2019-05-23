import React, { Component, useState } from 'react';
import './HomePage.css';


export default function HomePage() {
  const [name, setName] = useState('New');
  const [surname, setSurname] = useState('Way');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleSurnameChange(e) {
    setSurname(e.target.value);
  }

  return (
    <section>
      <div>
        <input
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <input
          value={surname}
          onChange={handleSurnameChange}
        />
      </div>
    </section>
  )
}
