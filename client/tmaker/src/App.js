import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter.js';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from './index.js';
import { check } from './http/funstions.js';

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  const gt = async() => {
    await check().then(data => 
      {
          user.setAuth(true)
          user.setEmail(data.email)
          user.setID(data.id)
          user.setRole(data.role)
    }).finally(() => setLoading(false))
  }
  useEffect(() => {
    try {
      if (localStorage.getItem('token')) {
        gt()
      } else {
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  if (loading) {
    return <div></div>
  }
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
})

export default App;
