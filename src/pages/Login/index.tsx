import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions';
import formToJson from '../../utils/formToJson';
import { PageLayout } from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import moment from 'moment';

const Login = () => {
  const dispatch = useDispatch();
  return (
    <PageLayout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const values = formToJson(e.target as HTMLFormElement);
          dispatch(
            actions.login({
              username: values.username as string,
              password: values.password as string,
            })
          );
        }}
      >
        <Paper
          sx={{ pl: 3, mt: 10, maxWidth: '720px', mx: 'auto', display: 'flex' }}
          elevation={0}
          variant="outlined"
          square
        >
          <Paper
            sx={{ p: 3, my: -4, maxWidth: '320px' }}
            elevation={0}
            variant="outlined"
            square
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4">Login</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Username/Email"
                  name="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  type="password"
                  fullWidth
                  label="Password"
                  name="password"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper
            sx={{
              p: 3,
              flexGrow: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            elevation={0}
          >
            <div>
              <Typography
                variant="h6"
                color={scss_variables.primary_color}
                mb={3}
              >
                Welcome back to
                <br /> Village Portal
              </Typography>
              <Typography
                variant="h6"
                color={scss_variables.primary_color}
                mb={3}
              >
                <i>
                  Let's give <b>hope</b>...
                </i>
              </Typography>
            </div>
            <div>
              <Typography
                variant="body1"
                color={scss_variables.primary_color}
                alignSelf="flex-end"
              >
                Don't have an account?
              </Typography>
              <Button
                component={Link}
                to="/register?type=mentee"
                sx={{
                  color: scss_variables.primary_color,
                  textDecoration: 'underline',
                }}
              >
                Register As A Student
              </Button>
              <Button
                component={Link}
                to="/register?type=mentor"
                sx={{
                  color: scss_variables.primary_color,
                  textDecoration: 'underline',
                }}
              >
                Register As A Mentor
              </Button>
              <Button
                sx={{
                  color: scss_variables.primary_color,
                  textDecoration: 'underline',
                }}
                target="_blank" 
                href="https://villagebookbuilders.org/sponsorprogram/"
              >
                Sponsor a Student
              </Button>
            </div>
          </Paper>
        </Paper>
      </form>
    </PageLayout>
  );
};

export default Login;
