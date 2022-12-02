import * as React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../redux/rootReducer';
import { getUserDetail } from '../redux/user/user.actions';
import {
  getUserComputerReservationSlots,
  updateUserComputerReservationAttendance,
} from '../redux/bookings/bookings.actions';
import {
  PageLayout,
  MainCardLayoutWithSideMenu,
} from '../components/layout/Page';
import scss_variables from '../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import { BasicModal } from '../components/Modals';
import StudentSessionCard from '../components/mentor/StudentSessionCard';
import MentorSessionCard from '../components/mentor/MentorSessionCard';
import { getLibraryAnnouncements } from '../redux/library/library.actions';
import moment from 'moment';
import { DateTime } from 'luxon';


const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let todayDate = DateTime.fromJSDate(new Date())

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const bookingsState = useSelector((store: AppState) => store.bookings);
  const user_reservations = useSelector(
    (store: AppState) => store.bookings.user_reservation_slots
  );
  const announcementsState = useSelector(
    (store: AppState) => store.library.announcements
  );
  const [onboardingModalOpen, set_onboardingModalOpen] = React.useState(false);
  const [viewAllAnnouncementsModalOpen, set_viewAllAnnouncementsModalOpen] =
    React.useState(false);
  const [reservations, set_reservations] = React.useState<any>([]);
  const [numOfStudents, set_numOfStudents] = React.useState<any>(0);
  const [numOfMentors, set_numOfMentors] = React.useState<any>(0);
  const [announcements, set_announcements] = React.useState<any>(null);
  const [activeLibrary, setActiveLibrary] = React.useState<any>(null);

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (user && (user.role === 0 || user.role === 1) && user.studentProfile) {
      if (user.studentProfile.assignedLibrary) {
        var libraryID = user.studentProfile?.assignedLibrary.uniqueID;
        dispatch(getUserComputerReservationSlots());
        dispatch(getLibraryAnnouncements(libraryID));
        setActiveLibrary(user.studentProfile.assignedLibrary);
      }
    } else if (user && user.role === 2 && user.mentorProfile) {
      if (user.mentorProfile.assignedLibrary) {
        var libraryID2 = user.mentorProfile.assignedLibrary.uniqueID;
        dispatch(getUserComputerReservationSlots());
        dispatch(getLibraryAnnouncements(libraryID2));
        setActiveLibrary(user.mentorProfile.assignedLibrary);
      }
    } else if (user && user.role === 3 && user.advisorProfile) {
      if (user.advisorProfile.library) {
        var libraryID3 = user.advisorProfile.library.uniqueID;
        dispatch(getLibraryAnnouncements(libraryID3));
        setActiveLibrary(user.advisorProfile.library);
      }
    } else if (user && user.role === 4 && user.librarianProfile) {
      if (user.librarianProfile.library) {
        var libraryID4 = user.librarianProfile.library.uniqueID;
        //dispatch(getUserComputerReservationSlots());
        dispatch(getLibraryAnnouncements(libraryID4));
        setActiveLibrary(user.librarianProfile.library);
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (user_reservations !== undefined && user_reservations !== null) {
      let reserveSort: any = [...user_reservations];
      let newSort = reserveSort.sort(function (a: any, b: any) {
        return (
          new Date(b.startTime).valueOf() - new Date(a.startTime).valueOf()
        );
      });
      set_reservations(newSort);
    }
  }, [user_reservations]);

  React.useEffect(() => {
    if (announcementsState !== undefined && announcementsState !== null) {
      let announcementSort: any = [...announcementsState];
      let newSort = announcementSort.sort(function (a: any, b: any) {
        return (
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
      });

      let today = moment().format('YYYY-MM-DD');

      let displaySort = newSort.filter((item: any) =>
        moment(item.displayEnd, 'YYYY-MM-DD').isSameOrAfter(today)
      );

      set_announcements(displaySort);
    }
  }, [announcementsState]);

  React.useEffect(() => {
    if (user !== undefined && user !== null) {
      // if (user.mentorProfile === null && user.studentProfile === null && user.role === 2) {
      //   set_onboardingModalOpen(true)
      // }

      if (
        user.studentProfile &&
        user.studentProfile.isOnboarded === false &&
        user.role === 1
      ) {
        set_onboardingModalOpen(true);
      }

      if (
        user.mentorProfile &&
        user.mentorProfile.isOnboarded === false &&
        user.role === 2
      ) {
        set_onboardingModalOpen(true);
      }
    }
  }, [user]);

  function handleLinkRedirect(sessionObj: any) {
    if (sessionObj.conferenceURL) {
      if (user.studentProfile !== null) {
        dispatch(
          updateUserComputerReservationAttendance({
            unique_id: sessionObj.uniqueID,
            student_attended: true,
          })
        );
      } else {
        dispatch(
          updateUserComputerReservationAttendance({
            unique_id: sessionObj.uniqueID,
            mentor_attended: true,
          })
        );
      }
      window.open(sessionObj.conferenceURL, '_blank');
    } else {
      return;
    }
  }

  return (
    <>
      <BasicModal
        open={onboardingModalOpen}
        onClose={() => null}
        title={'Welcome To Village Book Builders'}
      >
        <Typography
          mt={1}
          mb={1}
          variant="body1"
          alignSelf="flex-start"
          color={scss_variables.primary_color}
        >
          <b>
            Thanks for signing up. Let's finish your profile setup by completing
            a quick form.
          </b>
        </Typography>
        <Button
          component={Link}
          to="/onboarding"
          variant="contained"
          color="info"
          sx={{ mt: 2 }}
        >
          Finish Onboarding
        </Button>
      </BasicModal>
      <BasicModal
        open={viewAllAnnouncementsModalOpen}
        onClose={() => set_viewAllAnnouncementsModalOpen(false)}
        title={'View All Announcements'}
      >
        {announcements ? (
          <>
            {announcements.length > 0 ? (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 500,
                  overflow: 'hidden',
                  overflowY: 'scroll',
                }}
              >
                {announcements.slice(0, 3).map((announcement: any) => {
                  return (
                    <div className="announcement-card">
                      <Typography
                        variant="body1"
                        alignSelf="flex-start"
                        color={scss_variables.primary_color}
                      >
                        <b>{activeLibrary && activeLibrary.name} announced:</b>{' '}
                        {announcement.text || ''}
                      </Typography>
                      <Typography
                        variant="body1"
                        alignSelf="flex-start"
                        color={scss_variables.primary_color}
                      >
                        <b>
                          {moment(announcement.createdAt).format(
                            'MM/DD/YY HH:MM a'
                          ) || '-'}
                        </b>
                      </Typography>
                    </div>
                  );
                })}
              </Box>
            ) : (
              <Typography
                variant="body1"
                alignSelf="flex-start"
                color={scss_variables.primary_color}
              >
                No announcements today...
              </Typography>
            )}
          </>
        ) : (
          <CircularProgress />
        )}

        <Button
          onClick={() => set_viewAllAnnouncementsModalOpen(false)}
          variant="contained"
          color="info"
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </BasicModal>
      <PageLayout>
        <MainCardLayoutWithSideMenu>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <div className="card-container">
                <div className="card-header">
                  {user &&
                  (user.role === 0 || user.role === 1 || user.role === 2) ? (
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Resource Center
                    </Typography>
                  ) : (
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Quick Actions
                    </Typography>
                  )}
                </div>
                <div className="card-body">
                  {user && (user.role === 0 || user.role === 1) ? (
                    <>
                      <Typography
                        mt={1}
                        mb={1}
                        variant="body1"
                        alignSelf="flex-start"
                        color={scss_variables.primary_color}
                      >
                        <b>
                          Getting started with Village Book Builders is easy!
                        </b>
                      </Typography>
                      <Box display="flex" flexDirection="column" pb={1}>
                        <Link to="#">Free Books</Link>
                        <Link to="#">Free Onlne Article Sources</Link>
                        <Link to="#">Free Guides / Worksheets</Link>
                        <Link to="#">Village Portal FAQs</Link>
                        <Link to="#">Show Me A Tour</Link>
                      </Box>
                    </>
                  ) : user.role === 2 ? (
                    <>
                      <Typography
                        mt={1}
                        mb={1}
                        variant="body1"
                        alignSelf="flex-start"
                        color={scss_variables.primary_color}
                      >
                        <b>
                          Mentoring with Village Book Builders makes a
                          difference!
                        </b>
                      </Typography>
                      <Box display="flex" flexDirection="column" pb={1}>
                        <a href="https://calendly.com/admin-5496/mentor-orientation-and-scheduling" target="_blank" rel="noreferrer noopener">Book Your Mentoring Orientation</a>
                        <a href="https://work.me/g/qt70QTGMs/R3dUS5iu" target="_blank" rel="noreferrer noopener">Join us on Meta Workplace</a>
                        <a href="https://villagebookbuilders.workplace.com/work/knowledge/995531177915339" target="_blank" rel="noreferrer noopener">The Knowledge Library</a>
                      </Box>
                    </>
                  ) : user.role === 3 ? (
                    <Box display="flex" flexDirection="column" pb={1}>
                      <Link to="/computers">Add New Computer</Link>
                      <Link to="/announcements">Create New Announcement</Link>
                      <Link to="/mentors">View Active Mentor List</Link>
                      <Link to="/students">View Active Student List</Link>
                    </Box>
                  ) : user.role === 4 ? (
                    <Box display="flex" flexDirection="column" pb={1}>
                      <Link to="/announcements">Create New Announcement</Link>
                      <Link to="/mentors">View Active Mentor List</Link>
                      <Link to="/students">View Active Student List</Link>
                    </Box>
                  ) : null}
                </div>
              </div>
              {user && (user.role === 3 || user.role === 4) ? (
                <div className="card-container" style={{ marginTop: '1rem' }}>
                  <div className="card-header">
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Library Stats
                    </Typography>
                  </div>
                  <div className="card-body">
                    <Typography
                      variant="body1"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Number of Students: <b>{numOfStudents}</b>
                    </Typography>
                    <Typography
                      variant="body1"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Number of Mentors: <b>{numOfMentors}</b>
                    </Typography>
                  </div>
                </div>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="card-container">
                <div className="card-header">
                  <Typography
                    variant="h6"
                    alignSelf="flex-start"
                    color={scss_variables.primary_color}
                  >
                    Activity & Announcements
                  </Typography>
                  <a onClick={() => set_viewAllAnnouncementsModalOpen(true)}>
                    View All
                  </a>
                </div>
                <div
                  className="card-body"
                  style={{ padding: '0rem 0rem 1rem 0rem' }}
                >
                  <Box display="flex" flexDirection="column" width="100%">
                    {announcements ? (
                      <>
                        {announcements.length > 0 ? (
                          <>
                            {announcements
                              .slice(0, 3)
                              .map((announcement: any) => {
                                return (
                                  <div className="announcement-card">
                                    <Typography
                                      variant="body1"
                                      alignSelf="flex-start"
                                      color={scss_variables.primary_color}
                                    >
                                      <b>
                                        {activeLibrary && activeLibrary.name}{' '}
                                        announced:
                                      </b>{' '}
                                      {announcement.text || ''}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      alignSelf="flex-start"
                                      color={scss_variables.primary_color}
                                    >
                                      <b>
                                        {moment(announcement.createdAt).format(
                                          'MM/DD/YY HH:MM a'
                                        ) || '-'}
                                      </b>
                                    </Typography>
                                  </div>
                                );
                              })}
                          </>
                        ) : (
                          <Typography
                            variant="body1"
                            alignSelf="flex-start"
                            p={'0.5rem 1rem'}
                            color={scss_variables.primary_color}
                          >
                            No announcements today...
                          </Typography>
                        )}
                      </>
                    ) : (
                      <CircularProgress />
                    )}
                  </Box>
                </div>
              </div>
            </Grid>
          </Grid>

          {user.mentorProfile &&
          user.mentorProfile.isOnboarded === true &&
          user.mentorProfile.approvalStatus === 'Not Reviewed' &&
          user.role === 2 ? (
            <Alert severity="info" sx={{ mt: 3 }}>
              Your Mentor Application Is Currently Under Review! You won't be
              able to book a session until that has been approved.
            </Alert>
          ) : null}

          {user.studentProfile &&
          user.studentProfile.isOnboarded === true &&
          user.studentProfile.approvalStatus === 'Not Reviewed' &&
          user.role === 1 ? (
            <Alert severity="info" sx={{ mt: 3 }}>
              Your Student Account Is Currently Under Review! You won't be able
              to book a session until that has been approved.
            </Alert>
          ) : null}

          {user.role === 1 ? (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12}>
                <div className="card-container">
                  <div className="card-header">
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Upcoming Student Sessions
                    </Typography>
                    <Link to="/sessions">View All Sessions</Link>
                  </div>
                  <div className="card-body">
                    {reservations ? (
                      <>
                        {reservations.length > 0 ? (
                          <>
                            <Box
                              display="flex"
                              flexDirection="column"
                              width="100%"
                            >
                              {reservations.map((reserve: any) => {
                                let sessionDate = DateTime.fromJSDate(new Date(reserve.startTime))
                                if ((sessionDate.weekNumber === todayDate.weekNumber) && (sessionDate.year === todayDate.year)){
                                  return (
                                    <MentorSessionCard
                                      session={reserve}
                                      onCheckIn={(sess: any) =>
                                        handleLinkRedirect(sess)
                                      }
                                    />
                                  );
                                    }
                              })}
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box display="flex" flexDirection="column">
                              <Typography
                                variant="body1"
                                alignSelf="flex-start"
                                color={scss_variables.primary_color}
                              >
                                You have no student sessions yet...
                              </Typography>
                            </Box>

                            {user.studentProfile &&
                            user.studentProfile.isOnboarded === true &&
                            user.studentProfile.approvalStatus ===
                              'Not Reviewed' ? null : (
                              <Button
                                component={Link}
                                to="/bookings"
                                variant="contained"
                                color="info"
                                sx={{ mt: 2 }}
                              >
                                Find New Student Sessions
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <CircularProgress />
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          ) : user.role === 0 ? (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12}>
                <div className="card-container">
                  <div className="card-header">
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Upcoming Mentor Sessions
                    </Typography>
                    <Link to="/sessions">View All Sessions</Link>
                  </div>
                  <div className="card-body">
                    {reservations ? (
                      <>
                        {reservations.length > 0 ? (
                          <>
                            <Box
                              display="flex"
                              flexDirection="column"
                              width="100%"
                            >
                              {reservations.map((reserve: any) => {
                                return (
                                  <StudentSessionCard
                                    session={reserve}
                                    onCheckIn={(sess: any) =>
                                      handleLinkRedirect(sess)
                                    }
                                  />
                                );
                              })}
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box display="flex" flexDirection="column">
                              <Typography
                                variant="body1"
                                alignSelf="flex-start"
                                color={scss_variables.primary_color}
                              >
                                You have no mentor sessions yet...
                              </Typography>
                            </Box>
                            <Button
                              component={Link}
                              to="/bookings"
                              variant="contained"
                              color="info"
                              sx={{ mt: 2 }}
                            >
                              Add Open Slots To My Calendar
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <CircularProgress />
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          ) : user.role === 4 ? (
            <></>
          ) : null}
        </MainCardLayoutWithSideMenu>
      </PageLayout>
    </>
  );
};
export default Home;
