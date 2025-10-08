import React, { useState, useEffect } from 'react';

function Example2() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`; // Update the page title
  }, []); // Runs whenever "count" changes

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}

export default Example2;