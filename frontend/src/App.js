import React from "react";
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Home from "./home";
import PrivateRoute from "./privateRoute";
import Register from "./auth/register";
import Login from "./auth/login";
import Logout from "./auth/logout";
import tokenService from "./services/token.service";
import UserListAdmin from "./admin/users/UserListAdmin";
import UserEditAdmin from "./admin/users/UserEditAdmin";
import SwaggerDocs from "./public/swagger";
import GameListing from "./player/game/gameListing";
import GameDetails from "./player/game/gameDetails";
import CardListing from "./player/card/CardListing";
import GameJoining from "./player/game/GameJoining";
import GamePlay from "./player/game/GamePlay";
import Profile from "./player/profile/Profile";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const jwt = tokenService.getLocalAccessToken();
  let roles = []
  if (jwt) {
    roles = getRolesFromJWT(jwt);
  }

  function getRolesFromJWT(jwt) {
    return jwt_decode(jwt).authorities;
  }

  let adminRoutes = <></>;
  let userRoutes = <></>;
  let publicRoutes = <></>;
  let playerRoutes = <></>;

  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>
          <Route path="/users" exact={true} element={<PrivateRoute><UserListAdmin /></PrivateRoute>} />
          <Route path="/users/:username" exact={true} element={<PrivateRoute><UserEditAdmin /></PrivateRoute>} />
          <Route path="/cards" exact={true} element={<PrivateRoute><CardListing /></PrivateRoute>} />
          <Route path="/games/gameListing" exact={true} element={<PrivateRoute><GameListing /></PrivateRoute>} />
          <Route path="/games/:id" exact={true} element={<PrivateRoute><GameDetails /></PrivateRoute>} />)
          <Route path="/games/:id/join" exact={true} element={<PrivateRoute><GameJoining /></PrivateRoute>} />
          <Route path="/games/:id/play" exact={true} element={<PrivateRoute><GamePlay /></PrivateRoute>} />
          <Route path="/profile" exact={true} element={<PrivateRoute><Profile /></PrivateRoute>} />
        </>)
    }
    if (role === "PLAYER") {
      playerRoutes = (
        <>
          <Route path="/cards" exact={true} element={<PrivateRoute><CardListing /></PrivateRoute>} />
          <Route path="/games/gameListing" exact={true} element={<PrivateRoute><GameListing /></PrivateRoute>} />
          <Route path="/games/:id" exact={true} element={<PrivateRoute><GameDetails /></PrivateRoute>} />)
          <Route path="/games/:id/join" exact={true} element={<PrivateRoute><GameJoining /></PrivateRoute>} />
          <Route path="/games/:id/play" exact={true} element={<PrivateRoute><GamePlay /></PrivateRoute>} />
          <Route path="/profile" exact={true} element={<PrivateRoute><Profile /></PrivateRoute>} />
        </>
      )
    }
  })
  if (!jwt) {
    publicRoutes = (
      <>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  } else {
    userRoutes = (
      <>
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  }

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback} >
        <AppNavbar />
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/docs" element={<SwaggerDocs />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {playerRoutes}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
