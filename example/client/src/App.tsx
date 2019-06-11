import React, { useEffect } from 'react';
import logo from './logo.svg';
import { createPost } from './rpc';
import './App.css';

const App: React.FC = () => {
  // useEffect(() => {
  //   load().catch(console.error);
  //   async function load() {
  //     const result = await createPost({ title: "foo", content: "bar" });
  //     console.log({ result });
  //   }
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button
        onClick={async () => {
          const d = { title: 'foo', content: 'bar' };
          // delete d.title;
          console.log('Result', await createPost(d).catch(console.error));
        }}
      >
        Do thing
      </button>
    </div>
  );
};

export default App;
