import React, { useState, useEffect } from 'react';


const useSW = (state, personId) => {
  const [person, setPerson] = useState(state);

  useEffect(() => {
    // Update the document title using the browser API
    fetch('https://swapi.co/api/people/' + personId)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        setPerson(JSON.stringify(myJson));
      });
  }, [personId]);
  return person
};

export default function HomePage() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const person = useSW(0, count);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });


  return (
    <div>
      <p>You clicked {person} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}