import * as React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
  Menu,
  ListItemIcon,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../redux/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import scss_variables from '../styles/_variables.scss';

const flexContainerStyles = {
  maxWidth: '200px',
  flex: '1 1 auto',
};

const SideMenu = () => {
  const navigate = useNavigate();
  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);

  return (
    <div className="card-container">
      <div className="card-header">
        <Typography
          variant="h6"
          alignSelf="flex-start"
          color={scss_variables.primary_color}
        >
          Quick Links
        </Typography>
      </div>
      <Grid container padding={3} spacing={3}>
        <Grid item xs={12}>
          <Link to="/">Dashboard</Link>
        </Grid>
        {user && (user.role === 2) && (
          <>
            <Grid item xs={12}>
              <Link to="/bookings">Bookings</Link>
            </Grid>
          </>
        )}


        {user && (user.role === 0 || user.role === 1 || user.role === 2) && (
          <>
            <Grid item xs={12}>
              <Link to="/sessions">My Sessions</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/profile">My Profile</Link>
            </Grid>
          </>
        )}


        {user && user.role === 3 && (
          <>
            <Grid item xs={12}>
              <Link to="/reservations">Reservations</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/announcements">Announcements</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/computers">Computers</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/students">Students</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/mentors">Mentors</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/library-profile">Library Profile</Link>
            </Grid>
          </>
        )}

        {user && user.role === 4 && (
          <>
            <Grid item xs={12}>
              <Link to="/reservations">Reservations</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/students">Students</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/mentors">Mentors</Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/announcements">Announcements</Link>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Link to="/account">Account Settings</Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default SideMenu;
