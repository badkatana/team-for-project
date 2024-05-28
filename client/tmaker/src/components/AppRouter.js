import React, { useContext } from 'react' 
import {Routes, Route, Navigate} from 'react-router-dom'
import { adminRoutes, authRoutes, publicRoutes } from './routes';
import { Context } from '..';

const AppRouter = () => {
    const {user} = useContext(Context)
    console.log(`user auth is ${user.auth}`)
    console.log(user.getRole() == 'admin')
  
    return(
        <Routes>
            {user.auth && user.getRole() == 'admin' && adminRoutes.map(({path, Component}) => 
                <Route key={path} element={Component} path={path}/>
            )}
            { user.auth && authRoutes.map(({path, Component}) => 
            <Route key={path} element={Component} path={path}/>)}

            {
               publicRoutes.map(({path, Component}) => 
               <Route key={path} element={Component} path={path}/>)
            }

            <Route path="*" element={<Navigate to ="/" />}/>
        </Routes>
    )

}

export default AppRouter