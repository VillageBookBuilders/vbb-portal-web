import * as React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Pagination,
  CircularProgress,
  InputLabel,
  Select,
  ListItemText,
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
  getLibraryStudents,
  updateStudentStatus,
  deleteLibraryStudent,
} from '../../redux/library/library.actions';
import { FaDesktop, FaEllipsisV } from 'react-icons/fa';
import { BasicModal } from '../../components/Modals';

const defaultForm = {
  name: '',
  notes: '',
  end_date: '',
  uniqueID: '',
};

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const studentsState = useSelector(
    (store: AppState) => store.library.students
  );
  const [activePaginationIndex, set_activePaginationIndex] = React.useState(1);
  const [numOfItems, set_numOfItems] = React.useState(10);
  const [students, set_students] = React.useState<any>(null);

  const [studentStatusModalOpen, set_studentStatusModalOpen] =
    React.useState(false);
  const [activeStudentStatus, set_activeStudentStatus] =
    React.useState<any>('');

  const [editStudentModalOpen, set_editStudentModalOpen] =
    React.useState(false);
  const [deleteStudentConfirmModalOpen, set_deleteStudentConfirmModalOpen] =
    React.useState(false);
  const [activeStudentToDelete, set_activeStudentToDelete] =
    React.useState<any>(null);
  const [activeStudentForm, set_activeStudentForm] =
    React.useState<any>(defaultForm);
  const [activeStudent, set_activeStudent] = React.useState<any>(null);
  const [filterText, set_filterText] = React.useState<any>('');

  React.useEffect(() => {
    if (studentsState !== undefined && studentsState !== null) {
      let studentSort: any = [...studentsState];
      let newSort = studentSort.sort(function (a: any, b: any) {
        return (
          new Date(a.user?.dateJoined).valueOf() - new Date(b.user?.dateJoined).valueOf()
        );
      });
      set_students(newSort);
    }
  }, [studentsState]);

  React.useEffect(() => {
    if (user && user.role === 1 && user.studentProfile) {
      if (user.studentProfile.assignedLibrary) {
        var libraryID = user.studentProfile?.assignedLibrary.uniqueID;
        dispatch(getLibraryStudents(libraryID));
      }
    } else if (user && user.role === 2 && user.mentorProfile) {
      if (user.mentorProfile.assignedLibrary) {
        var libraryID2 = user.mentorProfile.assignedLibrary.uniqueID;
        dispatch(getLibraryStudents(libraryID2));
      }
    } else if (user && user.role === 3 && user.advisorProfile) {
      if (user.advisorProfile.library) {
        var libraryID3 = user.advisorProfile.library.uniqueID;
        dispatch(getLibraryStudents(libraryID3));
      }
    } else if (user && user.role === 4 && user.librarianProfile) {
      if (user.librarianProfile.library) {
        var libraryID4 = user.librarianProfile.library.uniqueID;
        dispatch(getLibraryStudents(libraryID4));
      }
    }
  }, [user]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    set_activePaginationIndex(value);
  };

  const handleToggleActiveStudentView = (student: any) => {
    if (editStudentModalOpen) {
      set_activeStudent(null);
      set_editStudentModalOpen(false);
      set_activeStudentForm(defaultForm);
    } else {
      set_activeStudent(student);
      set_editStudentModalOpen(true);
      set_activeStudentForm(student);
    }
  };

  const handleToggleDeleteStudentConfirm = (student: any) => {
    if (deleteStudentConfirmModalOpen) {
      set_activeStudentToDelete(null);
      set_deleteStudentConfirmModalOpen(false);
    } else {
      set_activeStudentToDelete(student);
      set_deleteStudentConfirmModalOpen(true);
    }
  };

  const handleToggleApproveStudentModal = (student: any) => {
    if (studentStatusModalOpen) {
      set_activeStudent(null);
      set_studentStatusModalOpen(false);
    } else {
      set_activeStudent(student);
      set_studentStatusModalOpen(true);
    }
  };

  const handleChangeStudentStatus = (student: any, status: string) => {
    console.log(student);
    console.log(status);
    dispatch(
      updateStudentStatus({ student_id: student.user.pk, status: status })
    );
  };

  const handleEditStudent = (student: any) => {
    console.log(student);
    dispatch(deleteLibraryStudent(student.user.pk));
  };

  const handleDeleteStudent = (student: any) => {
    console.log(student);
    dispatch(deleteLibraryStudent(student.user.pk));
  };

  const StudentRow = ({ student }: { student: any }) => {
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
        key={student.uniqueID}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>{student.user?.firstName}</TableCell>
        <TableCell>{student.user?.lastName}</TableCell>
        <TableCell>{student.user?.username}</TableCell>
        <TableCell>{student.approvalStatus}</TableCell>
        <TableCell>
          {moment(student.user?.dateJoined).format('MM/DD/YY') || '-'}
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
            <MenuItem
              onClick={() => handleToggleActiveStudentView(student.user)}
            >
              View/Edit...
            </MenuItem>
            <MenuItem onClick={() => handleToggleApproveStudentModal(student)}>
              Approve/Reject Account...
            </MenuItem>
            <MenuItem onClick={() => handleToggleDeleteStudentConfirm(student)}>
              <div style={{ color: 'red' }}>Remove...</div>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  const renderStudents = (students: any[], filterTxt: string) => {
    if (students.length === 0) {
      return null;
    }
    let renderList = [];
    let filteredList = [];
    if (filterTxt === '') {
      filteredList = [...students];
    } else {
      filteredList = students.filter(
        (item: any) =>
          item.user?.name && item.user?.name.toLowerCase().includes(filterTxt.toLowerCase())
      );
    }
    renderList = filteredList.map((student) => {
      return <StudentRow student={student} />;
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
      set_activeStudentForm({
        ...activeStudentForm,
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

  return (
    <>
      <BasicModal
        open={deleteStudentConfirmModalOpen}
        onClose={() => set_deleteStudentConfirmModalOpen(false)}
        title={'Delete Student?'}
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
            Are you sure you want to delete this student? It will no longer be
            viewable by library users.
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Student:{' '}
            <b>
              {activeStudentToDelete
                ? `${activeStudentToDelete.user?.firstName} ${activeStudentToDelete.user?.lastName}`
                : `No student details...`}
            </b>
          </Typography>
          <Typography
            mt={0}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Username:{' '}
            <b>
              {activeStudentToDelete
                ? `${activeStudentToDelete.user?.username} `
                : `No student username...`}
            </b>
          </Typography>
          <Button
            onClick={() => handleDeleteStudent(activeStudentToDelete)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? (
              <CircularProgress />
            ) : (
              `Yes, delete this student.`
            )}
          </Button>
          <Button
            onClick={() =>
              handleToggleDeleteStudentConfirm(activeStudentToDelete)
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
        open={editStudentModalOpen}
        onClose={() => set_deleteStudentConfirmModalOpen(false)}
        title={'Edit Student'}
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
                    value={activeStudentForm.firstName}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
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
                    value={activeStudentForm.lastName}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
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
                    value={activeStudentForm.email}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
                        email: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Username</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeStudentForm.username}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
                        username: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Date of Birth</FormLabel>
                  <TextField
                    id="standard-basic"
                    type="date"
                    value={activeStudentForm.dateOfBirth}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
                        dateOfBirth: e.target.value,
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
                    value={activeStudentForm.timeZone}
                    onChange={(e) =>
                      set_activeStudentForm({
                        ...activeStudentForm,
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
                  Role: {activeStudentForm.role}
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
                    {activeStudent &&
                      moment(activeStudent.user?.dateJoined).format(
                        'MM/DD/YY HH:MM A'
                      )}
                  </b>
                </Typography>
                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Student Actions
                </Typography>
                <Button variant="contained" color="error" sx={{ mt: 2 }}>
                  Delete
                </Button>
              </Grid>
            </Grid>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={() => handleToggleActiveStudentView(activeStudent)}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleEditStudent(activeStudentForm)}
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
        open={studentStatusModalOpen}
        onClose={() => set_studentStatusModalOpen(false)}
        title={'Change Student Approval Status'}
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
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                  mb={3}
                >
                  Approve or reject this student account.
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="multi-career-select">
                    Change Student Status
                  </InputLabel>
                  <Select
                    label="Change Student Status"
                    labelId="multi-career-select"
                    id="select-careers-dropdown"
                    value={activeStudentStatus}
                    onChange={(e) => set_activeStudentStatus(e.target.value)}
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
                onClick={() => handleToggleApproveStudentModal(activeStudent)}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() =>
                  handleChangeStudentStatus(activeStudent, activeStudentStatus)
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
                    Students
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
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Approval Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell align="right">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {students ? (
                            <>
                              {students.length > 0 ? (
                                <>
                                  {renderStudents(
                                    paginate(
                                      students,
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
                                    No students...
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                </TableRow>
                              )}
                            </>
                          ) : (
                            <CircularProgress />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  {students && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Pagination
                        shape="rounded"
                        count={
                          paginate(students, activePaginationIndex, numOfItems)
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
export default Students;
