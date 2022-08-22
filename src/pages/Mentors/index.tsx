import * as React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Pagination,
  CircularProgress,
  FormGroup,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  FormControl,
  FormLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer';
import {
  PageLayout,
  MainCardLayoutWithSideMenu,
} from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import { paginate } from '../../utils/api';
import moment from 'moment';
import {
  getLibraryMentors,
  updateMentorStatus,
  deleteLibraryMentor,
} from '../../redux/library/library.actions';
import { FaDesktop, FaEllipsisV } from 'react-icons/fa';
import { BasicModal } from '../../components/Modals';

const defaultForm = {
  name: '',
  notes: '',
  end_date: '',
  uniqueID: '',
  user:{
    firstName:'',
    lastName:'',
    email:'',
    timeZone:''
  }
};

const Mentors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const loading = useSelector((store: AppState) => store.appState.loading);
  const user = useSelector((store: AppState) => store.user);
  const mentorsState = useSelector((store: AppState) => store.library.mentors);
  const [activePaginationIndex, set_activePaginationIndex] = React.useState(1);
  const [numOfItems, set_numOfItems] = React.useState(10);
  const [mentors, set_mentors] = React.useState<any>(null);

  const [mentorStatusModalOpen, set_mentorStatusModalOpen] =
    React.useState(false);

  const [editMentorModalOpen, set_editMentorModalOpen] = React.useState(false);
  const [deleteMentorConfirmModalOpen, set_deleteMentorConfirmModalOpen] =
    React.useState(false);
  const [activeMentorToDelete, set_activeMentorToDelete] =
    React.useState<any>(null);
  const [activeMentorForm, set_activeMentorForm] =
    React.useState<any>(defaultForm);
  const [activeMentor, set_activeMentor] = React.useState<any>(null);
  const [filterText, set_filterText] = React.useState<any>('');
  const [activeMentorStatus, set_activeMentorStatus] = React.useState<any>('');
  const [libID, set_libID] = React.useState<any>('');

  React.useEffect(() => {
    if (mentorsState !== undefined && mentorsState !== null) {
      let mentorSort: any = [...mentorsState];
      let newSort = mentorSort.sort(function (a: any, b: any) {
        return (
          new Date(a.user?.dateJoined).valueOf() - new Date(b.user?.dateJoined).valueOf()
        );
      });
      set_mentors(newSort);
    }
  }, [mentorsState]);

  React.useEffect(() => {
    if (user && user.role === 1 && user.studentProfile) {
      if (user.studentProfile.assignedLibrary) {
        var libraryID = user.studentProfile?.assignedLibrary.uniqueID;
        dispatch(getLibraryMentors(libraryID));
        set_libID(libraryID)
      }
    } else if (user && user.role === 2 && user.mentorProfile) {
      if (user.mentorProfile.assignedLibrary) {
        var libraryID2 = user.mentorProfile.assignedLibrary.uniqueID;
        dispatch(getLibraryMentors(libraryID2));
        set_libID(libraryID2)
      }
    } else if (user && user.role === 3 && user.advisorProfile) {
      if (user.advisorProfile.library) {
        var libraryID3 = user.advisorProfile.library.uniqueID;
        dispatch(getLibraryMentors(libraryID3));
        set_libID(libraryID3)
      }
    } else if (user && user.role === 4 && user.librarianProfile) {
      if (user.librarianProfile.library) {
        var libraryID4 = user.librarianProfile.library.uniqueID;
        dispatch(getLibraryMentors(libraryID4));
        set_libID(libraryID4)
      }
    }
  }, [user]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    set_activePaginationIndex(value);
  };

  const handleToggleActiveMentorView = (mentor: any) => {
    if (editMentorModalOpen) {
      set_activeMentor(null);
      set_editMentorModalOpen(false);
      set_activeMentorForm(defaultForm);
    } else {
      set_activeMentor(mentor);
      set_editMentorModalOpen(true);
      set_activeMentorForm(mentor);
    }
  };

  const handleToggleDeleteMentorConfirm = (mentor: any) => {
    if (deleteMentorConfirmModalOpen) {
      set_activeMentorToDelete(null);
      set_deleteMentorConfirmModalOpen(false);
    } else {
      set_activeMentorToDelete(mentor);
      set_deleteMentorConfirmModalOpen(true);
    }
  };

  const handleToggleApproveMentorModal = (mentor: any) => {
    if (mentorStatusModalOpen) {
      set_activeMentor(null);
      set_mentorStatusModalOpen(false);
    } else {
      set_activeMentor(mentor);
      set_mentorStatusModalOpen(true);
    }
  };

  const handleEditMentor = (mentor: any) => {
    console.log(mentor);
  };

  const handleDeleteMentor = (mentor: any) => {
    dispatch(deleteLibraryMentor(mentor.pk));
  };

  const MentorRow = ({ mentor }: { mentor: any }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <TableRow
        key={mentor.uniqueID}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>{mentor.user?.firstName}</TableCell>
        <TableCell>{mentor.user?.lastName}</TableCell>
        <TableCell>{mentor.user?.email}</TableCell>
        <TableCell>
          {mentor.user?.organization ? mentor.user?.organization.name : '-'}
        </TableCell>
        <TableCell>{mentor.approvalStatus}</TableCell>
        <TableCell>
          {moment(mentor.user?.dateJoined).format('MM/DD/YY') || '-'}
        </TableCell>
        <TableCell align="right">
          <Button
            id="positioned-button"
            aria-controls={open ? 'positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <FaEllipsisV />
          </Button>
          <Menu
            id="positioned-menu"
            aria-labelledby="positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleToggleActiveMentorView(mentor)}>
              View/Edit...
            </MenuItem>
            <MenuItem onClick={() => handleToggleApproveMentorModal(mentor)}>
              Approve/Reject Account...
            </MenuItem>
            <MenuItem
              onClick={() => handleToggleDeleteMentorConfirm(mentor.user)}
            >
              <div style={{ color: 'red' }}>Remove...</div>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  const renderMentors = (mentors: any[], filterTxt: string) => {
    if (mentors.length === 0) {
      return null;
    }
    let renderList = [];
    let filteredList = [];
    if (filterTxt === '') {
      filteredList = [...mentors];
    } else {
      filteredList = mentors.filter(
        (item: any) =>
          item.user?.name && item.user?.name.toLowerCase().includes(filterTxt.toLowerCase())
      );
    }
    renderList = filteredList.map((mentor) => {
      return <MentorRow mentor={mentor} />;
    });
    return renderList;
  };

  const calculateEndDate = (days: string) => {
    if (!days) {
      return null;
    }
    var dayAmts = parseInt(days);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dayAmts);
    return newDate;
  };

  function handleEditEndDate(e: any) {
    const { value } = e.currentTarget;
    let newEndDate = calculateEndDate(value);
    if (newEndDate) {
      set_activeMentorForm({
        ...activeMentorForm,
        displayEnd: newEndDate.toISOString(),
      });
    }
  }

  const returnDateValue = (date: string) => {
    if (!date) {
      return '';
    }
    const dateValue = new Date(date).toISOString().slice(0, 10);
    return dateValue;
  };

  const handleChangeMentorStatus = (mentor: any, status: string) => {
    console.log(mentor);
    console.log(status);
    dispatch(updateMentorStatus({ library_id: libID, mentor_id: mentor.user.pk, status: status }));
  };

  return (
    <>
      <BasicModal
        open={deleteMentorConfirmModalOpen}
        onClose={() => set_deleteMentorConfirmModalOpen(false)}
        title={'Delete Mentor?'}
      >
        <Box
          display={'flex'}
          flexWrap={'wrap'}
          width={'100%'}
          flexDirection={'column'}
          justifyContent={'flex-start'}
        >
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Are you sure you want to delete this mentor? They will no longer be
            able to log into Village Book Builders, and all user info & exsiting
            reservations will be deleted.
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Mentor:{' '}
            <b>
              {activeMentorToDelete
                ? `${activeMentorToDelete.firstName} ${activeMentorToDelete.lastName}`
                : `No mentor details...`}
            </b>
          </Typography>
          <Typography
            mt={0}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Email:{' '}
            <b>
              {activeMentorToDelete
                ? `${activeMentorToDelete.email} `
                : `No mentor email...`}
            </b>
          </Typography>

          <Button
            onClick={() => handleDeleteMentor(activeMentorToDelete)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? (
              <CircularProgress />
            ) : (
              `Yes, delete this mentor.`
            )}
          </Button>
          <Button
            onClick={() =>
              handleToggleDeleteMentorConfirm(activeMentorToDelete)
            }
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            No, cancel.
          </Button>
        </Box>
      </BasicModal>
      <BasicModal
        open={editMentorModalOpen}
        onClose={() => set_deleteMentorConfirmModalOpen(false)}
        title={'Edit Mentor'}
      >
        <Box
          mt={2}
          display={'flex'}
          flexWrap={'wrap'}
          width={'100%'}
          flexDirection={'column'}
          justifyContent={'flex-start'}
        >
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>First Name</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeMentorForm.user.firstName}
                    multiline
                    rows={3}
                    onChange={(e) =>
                      set_activeMentorForm({
                        ...activeMentorForm,
                        firstName: e.target.value,
                      })
                    }
                    variant="standard"
                    required
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Last Name</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeMentorForm.user?.lastName}
                    multiline
                    rows={3}
                    onChange={(e) =>
                      set_activeMentorForm({
                        ...activeMentorForm,
                        lastName: e.target.value,
                      })
                    }
                    variant="standard"
                    required
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeMentorForm.user?.email}
                    onChange={(e) =>
                      set_activeMentorForm({
                        ...activeMentorForm,
                        email: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Timezone</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeMentorForm.user?.timeZone}
                    onChange={(e) =>
                      set_activeMentorForm({
                        ...activeMentorForm,
                        timeZone: e.target.value,
                      })
                    }
                    variant="standard"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Role: {activeMentorForm.user?.role}
                </Typography>
                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Created At: <br />
                  <b>
                    {activeMentor &&
                      moment(activeMentor.user?.dateJoined).format('MM/DD/YY HH:MM A')}
                  </b>
                </Typography>
                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Assigned Library: <br />
                  <b>
                    {activeMentor && activeMentor.assignedLibrary &&
                      `${activeMentor.assignedLibrary.name}`
                    }
                  </b>
                </Typography>

                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Mentor Actions
                </Typography>
                <Button
                  onClick={() =>
                    handleToggleActiveMentorView(activeMentor.user)
                  }
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={() => handleToggleActiveMentorView(activeMentor)}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleEditMentor(activeMentorForm)}
                variant="contained"
                color="info"
                sx={{ mt: 2, ml: 2 }}
              >
                {appState.loading ? <CircularProgress /> : `Save`}
              </Button>
            </Box>
          </>
        </Box>
      </BasicModal>

      <BasicModal
        open={mentorStatusModalOpen}
        onClose={() => set_mentorStatusModalOpen(false)}
        title={'Change Mentor Approval Status'}
      >
        <Box
          mt={2}
          display={'flex'}
          flexWrap={'wrap'}
          width={'100%'}
          flexDirection={'column'}
          justifyContent={'flex-start'}
        >
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                  mb={3}
                >
                  Mentor Profile
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h6">Video Uploaded</Typography>
                    {activeMentor && (
                      <TextField
                        id="standard-basic"
                        label="URL:"
                        variant="standard"
                        value={activeMentor.applicationVideoUrl || 'No video link provided...'}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 0 }}>
                    <Typography variant="h6">
                      Careers areas I’m interested in
                    </Typography>

                    {activeMentor ? (
                      <>
                        {activeMentor.careers.legnth > 0
                          ? (
                            <>
                            {activeMentor.careers.map((career: any) => {
                              return <Chip label={career.name} />;
                            })}
                            </>
                          )
                          : (
                            <>
                            <Typography variant="body1">
                              No subjects selected...
                            </Typography>
                            </>
                          )

                        }

                      </>
                    ) : null}

                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <Typography variant="h6">
                      Subjects I’m interested in
                    </Typography>

                    {activeMentor ? (
                      <>
                        {activeMentor.subjects.legnth > 0
                          ? (
                            <>
                            {activeMentor.subjects.map((sub: any) => {
                              return <Chip label={sub.name} />;
                            })}
                            </>
                          )
                          : (
                            <>
                            <Typography variant="body1">
                              No subjects selected...
                            </Typography>
                            </>
                          )

                        }

                      </>
                    ) : null}

                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <Typography variant="h6">
                      What languages do you speak?
                    </Typography>

                    {activeMentor ? (
                      <>
                        {activeMentor.mentoringLanguages.legnth > 0
                          ? (
                            <>
                            {activeMentor.mentoringLanguages?.map((lang: any) => {
                              return <Chip label={lang.englishDisplayName} />;
                            })}
                            </>
                          )
                          : (
                            <>
                            <Typography variant="body1">
                              No mentoring languages selected...
                            </Typography>
                            </>
                          )

                        }

                      </>
                    ) : null}
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <Typography variant="h6">
                      How do you find out this opportunity?
                    </Typography>

                    {activeMentor ? (
                      <>
                        {activeMentor.opportunities.legnth > 0
                          ? (
                            <>
                            {activeMentor.opportunities?.map((opp: any) => {
                              return <Chip label={opp.name} />;
                            })}
                            </>
                          )
                          : (
                            <>
                            <Typography variant="body1">
                              No opportunities selected...
                            </Typography>
                            </>
                          )

                        }

                      </>
                    ) : null}

                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <Typography variant="h6">Timezone Is</Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="body1">
                        <b>{activeMentor && activeMentor.user?.timeZone || 'No timezone selected...'}</b>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <FormControl>
                      <Typography variant="h6">
                        Please indicate whether you would like to mentor via
                        Microsoft Teams or Google Meets
                      </Typography>
                      <FormGroup></FormGroup>
                      <Typography variant="body1">
                        <b>{activeMentor && activeMentor.meetProvider || 'None'}</b>
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <FormControl>
                      <Typography variant="h6">
                        Once you book a mentoring session, will you be able to
                        meet with your student consistently every week for at
                        least 6 months?
                      </Typography>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                activeMentor && activeMentor.canMeetConsistently
                              }
                            />
                          }
                          label="Yes, I can meet consistently."
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                    <FormControl>
                      <Typography variant="h6">
                        Do you have any crimes or misdemeanors?
                      </Typography>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                activeMentor && activeMentor.crimesOrMisdemeanor
                              }
                            />
                          }
                          label="Yes, I have prior crimes & misdemeanors."
                        />
                      </RadioGroup>

                      <Typography
                        variant="body1"
                        alignSelf="flex-start"
                        color={scss_variables.primary_color}
                        mt={3}
                        mb={3}
                      >
                        {activeMentor &&
                          activeMentor.crimesOrMisdemeanorResponses}
                      </Typography>
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                  mt={3}
                  mb={3}
                >
                  <hr />
                </Typography>

                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                  mt={3}
                  mb={3}
                >
                  Approve or reject this mentor account.
                </Typography>

                <FormControl fullWidth>
                  <InputLabel id="multi-career-select">
                    Change Mentor Status
                  </InputLabel>
                  <Select
                    label="Change Mentor Status"
                    labelId="multi-career-select"
                    id="select-careers-dropdown"
                    value={activeMentorStatus}
                    onChange={(e) => set_activeMentorStatus(e.target.value)}
                  >
                    <MenuItem key={1} value={'not-reviewed'}>
                      <ListItemText primary={`Not Reviewed`} />
                    </MenuItem>
                    <MenuItem key={2} value={'approved'}>
                      <ListItemText primary={`Approved`} />
                    </MenuItem>
                    <MenuItem key={3} value={'rejected'}>
                      <ListItemText primary={`Rejected`} />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={() => handleToggleApproveMentorModal(activeMentor)}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() =>
                  handleChangeMentorStatus(activeMentor, activeMentorStatus)
                }
                variant="contained"
                color="info"
                sx={{ mt: 2, ml: 2 }}
              >
                {appState.loading ? <CircularProgress /> : `Save`}
              </Button>
            </Box>
          </>
        </Box>
      </BasicModal>
      <PageLayout>
        <MainCardLayoutWithSideMenu>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="card-container">
                <div className="card-header">
                  <Typography
                    variant="h6"
                    alignSelf="flex-start"
                    color={scss_variables.primary_color}
                  >
                    Mentors
                  </Typography>
                </div>
                <div className="card-body">
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flex={1}
                    width="100%"
                  >
                    <FormControl>
                      <TextField
                        id="standard-basic"
                        value={filterText}
                        label="Search..."
                        onChange={(e) => set_filterText(e.target.value)}
                        variant="standard"
                      />
                    </FormControl>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    width="100%"
                    mt={2}
                  >
                    <TableContainer>

                          {loading === false && mentors ? (
                            <>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Organization</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {mentors.length > 0 ? (
                                <>
                                  {renderMentors(
                                    paginate(
                                      mentors,
                                      activePaginationIndex,
                                      numOfItems
                                    ).data,
                                    filterText
                                  )}
                                </>
                              ) : (
                                <TableRow
                                  key={0}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    No mentors...
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell align="right">-</TableCell>
                                </TableRow>
                              )}
                              </TableBody>
                              </Table>
                            </>
                          ) : (
                            <CircularProgress />
                          )}
                    </TableContainer>
                  </Box>
                  {mentors && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Pagination
                        shape="rounded"
                        count={
                          paginate(mentors, activePaginationIndex, numOfItems)
                            .totalPages
                        }
                        page={activePaginationIndex}
                        onChange={handlePageChange}
                      />
                    </Box>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </MainCardLayoutWithSideMenu>
      </PageLayout>
    </>
  );
};
export default Mentors;
