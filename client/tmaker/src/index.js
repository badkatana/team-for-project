import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TagsStore from './store/tagStore';
import UserStore from './store/userStore';
import ProjectsStore from './store/projectsStore';

export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    tags: new TagsStore(),
    user: new UserStore(),
    project: new ProjectsStore()
  }}>
     <React.StrictMode>
      <App />
     </React.StrictMode>
  </Context.Provider>
  ,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
