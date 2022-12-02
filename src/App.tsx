import * as React from 'react';
import { Box, GlobalStyles, Snackbar, Alert } from '@mui/material';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login/';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Register from './pages/Registration/Register';
import ConfirmEmail from './pages/Registration/ConfirmEmail';
import Bookings from './pages/Bookings';
import AccountSettings from './pages/AccountSettings';
import Onboarding from './pages/Onboarding';
import Reservations from './pages/Reservations';
import Sessions from './pages/Sessions';
import LibraryProfile from './pages/LibraryProfile';
import Profile from './pages/Profile';

import Announcements from './pages/Announcements';
import Computers from './pages/Computers';
import Students from './pages/Students';
import Mentors from './pages/Mentors';

import AdvisorIndex from './components/advisor/AdvisorIndex';
import MentorIndex from './components/mentor/MentorIndex';
import OnboardingIndex from './components/Onboarding/OnboardingIndex';

import EmailSent from './components/EmailSent';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAppAlertIsOpen,
  getAppAlert,
  getAppAlertSeverity,
} from './redux/app/app.selectors';
import { getUserDetail } from './redux/user/user.actions';
import { closeAppAlert, setAppToken } from './redux/app/app.actions';
import { AppState } from './redux/rootReducer';
import * as actions from './redux/actions';
import jwt_decode from 'jwt-decode';

export type AlertColor = 'success' | 'error' | 'warning' | 'info';

interface Props {
  children: React.ReactNode;
  redirectPath?: string;
  isAllowed?: boolean;
}

export enum Role {
  Admin = 5,
  Librarian = 4,
  Advisor = 3,
  Mentor = 2,
  Student = 1,
  User = 0,
}

const PrivateRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: Array<Role>;
}) => {
  let location = useLocation();

  const appState = useSelector((store: AppState) => store.appState);

  const tokenCookie = localStorage.getItem('token');
  const refreshCookie = localStorage.getItem('refresh_token');
  const userCookie = localStorage.getItem('user');

  const user = userCookie ? JSON.parse(userCookie) : null;

  const userHasRequiredRole = user && roles.includes(user.role) ? true : false;

  const now = new Date();

  if(tokenCookie !== null && refreshCookie !== null){
      let now = new Date();
      var decoded_refresh:any = jwt_decode(refreshCookie);
      var expires_at:any = decoded_refresh.exp
      let expiresAt = new Date(parseInt(expires_at)*1000);
      if(now > expiresAt){
        return <Navigate to="/login" state={{ from: location }} />;
      }

      // if(!user){
      //   return <Navigate to="/login" state={{ from: location }} />;
      // }
      console.log(user)
      if (user && !userHasRequiredRole) {
        return <Navigate to="/access-denied" state={{ from: location }} />;
      }
  }else{
    if (!appState.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const isAlertOpen = useSelector(getAppAlertIsOpen);
  const alertMsg = useSelector(getAppAlert);
  const alertSeverity = useSelector(getAppAlertSeverity);
  const appState = useSelector((store: AppState) => store.appState);

  React.useEffect(() => {
    console.log(isAlertOpen);
  }, [isAlertOpen]);

  React.useEffect(() => {
    const userCookie = localStorage.getItem('user');
    const tokenCookie = localStorage.getItem('token');
    const refreshCookie = localStorage.getItem('refresh_token');

    const now = new Date();

    if (tokenCookie !== null && refreshCookie !== null) {
      let now = new Date();

      var decoded_refresh: any = jwt_decode(refreshCookie);
      var expires_at: any = decoded_refresh.exp;

      let expiresAt = new Date(parseInt(expires_at) * 1000);

      if (now > expiresAt) {
        setTimeout(() => dispatch(actions.logout()), 100);
      } else {
        setTimeout(
          () =>
            dispatch(
              setAppToken({
                access_token: tokenCookie,
                refresh_token: refreshCookie,
              })
            ),
          0
        );
        dispatch(getUserDetail());
      }
    }
  }, []);

  function handleCloseAlert(e: any) {
    setTimeout(() => dispatch(closeAppAlert()), 0);
  }

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0 } }} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isAlertOpen}
        autoHideDuration={10000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{
            width: '100%',
            fontSize: 18,
            alignItems: 'center',
            borderRadius: '25px',
          }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute
              roles={[
                Role.Admin,
                Role.Student,
                Role.Mentor,
                Role.Librarian,
                Role.Advisor,
                Role.User,
              ]}
            >
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/confirm" element={<ConfirmEmail />} />
        <Route
          path="/bookings"
          element={
            <PrivateRoute roles={[Role.Mentor]}>
              <Bookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute
              roles={[
                Role.Admin,
                Role.Student,
                Role.User,
                Role.Mentor,
                Role.Librarian,
                Role.Advisor,
              ]}
            >
              <AccountSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <Announcements />
            </PrivateRoute>
          }
        />
        <Route path="/advisor/*" element={<AdvisorIndex />} />
        <Route
          path="/onboarding/*"
          element={
            <PrivateRoute roles={[Role.Student, Role.Mentor, Role.User]}>
              <Onboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/sessions/*"
          element={
            <PrivateRoute roles={[Role.Student, Role.Mentor, Role.User]}>
              <Sessions />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations/*"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <Reservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/library-profile/*"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <LibraryProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/computers/*"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <Computers />
            </PrivateRoute>
          }
        />
        <Route
          path="/students/*"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentors/*"
          element={
            <PrivateRoute roles={[Role.Admin, Role.Librarian, Role.Advisor]}>
              <Mentors />
            </PrivateRoute>
          }
        />
        <Route path="/mentor/*" element={<MentorIndex />} />
        <Route path="/mentor/onboarding/*" element={<OnboardingIndex />} />
        <Route
          path="/profile/"
          element={
            <PrivateRoute roles={[Role.User, Role.Mentor]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </>
  );
}
export default App;
