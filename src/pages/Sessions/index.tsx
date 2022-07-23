import * as React from 'react';
import { Grid, Typography, Box, Button} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer'
import { PageLayout, MainCardLayoutWithSideMenu} from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import MentorSessionCard, { EmptySessionMsg} from '../../components/mentor/MentorSessionCard'
import { getUserComputerReservationSlots } from '../../redux/bookings/bookings.actions'
import StudentSessionCard from '../../components/mentor/StudentSessionCard'


const Sessions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const appState = useSelector((store: AppState) => store.appState);
    const user_reservations = useSelector((store: AppState) => store.bookings.user_reservation_slots);
    const user = useSelector((store: AppState) => store.user);
    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
      dispatch(getUserComputerReservationSlots())
    }, []);

    React.useEffect(() => {
      if (user_reservations !== undefined && user_reservations !== null) {
        let reserveSort:any = [...user_reservations]
        let newSort = reserveSort.sort(function(a:any, b:any){return new Date(a.startTime).valueOf() - new Date(b.startTime).valueOf()});
        setSessions(newSort)
      }
    }, [user_reservations]);



    return(
    <PageLayout>
      <MainCardLayoutWithSideMenu>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="card-container">
                <div className="card-header">
                <Typography variant="h6" alignSelf="flex-start" color={scss_variables.primary_color}>
                  My Sessions
                </Typography>
                </div>
                <div className="card-body">
                  {user.mentorProfile !== null
                  ? (
                  <Grid container spacing={3}>
                    {sessions.length === 0 ? (
                      <EmptySessionMsg />
                    ) : (
                      sessions.map((session:any) => (
                        <Grid item xs={12} key={session.id}>
                          <MentorSessionCard
                            session={session}
                            onCheckIn={() => null}
                          />
                        </Grid>
                      ))
                    )}
                  </Grid>)
                  : user.studentProfile !== null
                  ? (
                    (
                    <Grid container spacing={3}>
                      {sessions.length === 0 ? (
                        <EmptySessionMsg />
                      ) : (
                        sessions.map((session:any) => (
                          <Grid item xs={12} key={session.id}>
                            <StudentSessionCard
                              session={session}
                              onCheckIn={() => null}
                              manage={true}
                            />
                          </Grid>
                        ))
                      )}
                    </Grid>)
                  )
                  : null
                  }
                </div>
              </div>
            </Grid>
          </Grid>
      </MainCardLayoutWithSideMenu>
    </PageLayout>
  );
}
export default Sessions;