import { Component } from 'react'
import AuthPage from './../pages/AuthPage'
import SettingsPage from './../pages/SettingsPage'
import StartPage from './../pages/StartPage'
import TeamsPage from './../pages/TeamsPage'
import AdminPage from '../pages/AdminPage'

export const publicRoutes = [
    {
        path: '/registration',
        Component: <AuthPage/>
    },
    {
        path: '/login',
        Component: <AuthPage/>
    },
    {
        path: '/', 
        Component: <StartPage/>
    }

]

export const authRoutes = [
    {
        path:'/settings',
        Component: <SettingsPage/>
    }, 
    {
        path: '/teams', 
        Component: <TeamsPage/>
    }
]

export const adminRoutes =[
    {
        path:'/admin',
        Component: <AdminPage/>
    }
]