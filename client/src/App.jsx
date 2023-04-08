import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import HomePage from './scenes/HomePage/index.jsx'
import LoginPage from './scenes/LoginPage/index.jsx'
import ProfilePage from './scenes/ProfilePage/index.jsx'

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";
import { themeSettings } from './theme.js'

export default function App() {


    const mode = useSelector(state => state.auth.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
    const isAuth = Boolean(useSelector((state) => state.auth.token));
    const user = useSelector((state) => state.auth.user)

    return (
        <div className="app">
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
                            <Route path="/profile/:userID" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
                    </Routes>
                </ThemeProvider>
        </div>
    )
}

