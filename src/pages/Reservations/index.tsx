import * as React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Pagination,
  CircularProgress,
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
import MentorUserDropdown from '../../components/shared/MentorUserDropdown';
import StudentUserDropdown from '../../components/shared/StudentUserDropdown';

import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import { paginate } from '../../utils/api';
import moment from 'moment';
import {
  getLibraryUserSlots,
  updateLibraryUserSlot,
  updateLibraryComputerReservation,
  deleteLibraryComputerReservation,
  getLibraryComputerReservations,
  getLibraryMentors,
  createLibraryComputerReservation,
  deleteLibraryUserSlot,
  getLibraryStudents,
} from '../../redux/library/library.actions';
import { FaDesktop, FaEllipsisV } from 'react-icons/fa';
import { BasicModal } from '../../components/Modals';
import {
  CalendarMonth as CalendarMonthIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssignStudentModal from './AssignStudentModal'
const defaultForm = {
  name: '',
  notes: '',
  end_date: '',
  uniqueID: '',
};

const Reservations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const reservationsState = useSelector(
    (store: AppState) => store.library.reservations
  );
  const userPrefSlots = useSelector(
    (store: AppState) => store.library.user_preference_slots
  );

  const [activePaginationIndex, set_activePaginationIndex] = React.useState(1);
  const [activePaginationIndex2, set_activePaginationIndex2] =
    React.useState(1);

  const [numOfItems, set_numOfItems] = React.useState(10);
  const [reservations, set_reservations] = React.useState<any>(null);
  const [user_preference_slots, set_user_preference_slots] =
    React.useState<any>(null);

  const [toggleView, set_toggleView] = React.useState(false);

  const [addUserPrefSlotModalOpen, set_addUserPrefSlotModalOpen] =
    React.useState(false);
  const [editUserPrefSlotModalOpen, set_editUserPrefSlotModalOpen] =
    React.useState(false);
  const [
    deleteUserPrefSlotConfirmModalOpen,
    set_deleteUserPrefSlotConfirmModalOpen,
  ] = React.useState(false);
  const [activeUserPrefSlotToDelete, set_activeUserPrefSlotToDelete] =
    React.useState<any>(null);
  const [activeUserPrefSlotForm, set_activeUserPrefSlotForm] =
    React.useState<any>(defaultForm);
  const [activeUserPrefSlot, set_activeUserPrefSlot] =
    React.useState<any>(null);

  const [addReservationModalOpen, set_addReservationModalOpen] =
    React.useState(false);
  const [editReservationModalOpen, set_editReservationModalOpen] =
    React.useState(false);

  const [assignStudentSlotModalOpen, set_assignStudentSlotModalOpen] = React.useState(false);

  const [viewAssigned, set_viewAssigned] = React.useState(false);


  const [
    deleteReservationConfirmModalOpen,
    set_deleteReservationConfirmModalOpen,
  ] = React.useState(false);
  const [activeReservationToDelete, set_activeReservationToDelete] =
    React.useState<any>(null);
  const [activeReservationForm, set_activeReservationForm] =
    React.useState<any>(defaultForm);
  const [activeReservation, set_activeReservation] = React.useState<any>(null);
  const [libID, set_libID] = React.useState<any>('');
  const [filterText, set_filterText] = React.useState<any>('');
  const [filterText2, set_filterText2] = React.useState<any>('');

  React.useEffect(() => {
    if (
      appState !== undefined &&
      appState !== null &&
      appState.success === true
    ) {
      set_deleteUserPrefSlotConfirmModalOpen(false);
    }
  }, [appState]);

  React.useEffect(() => {
    if (reservationsState !== undefined && reservationsState !== null) {
      let reservationSort: any = [...reservationsState];
      let newSort = reservationSort.sort(function (a: any, b: any) {
        return (
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
        );
      });
      set_reservations(newSort);
    }
  }, [reservationsState]);

  React.useEffect(() => {
    if (userPrefSlots !== undefined && userPrefSlots !== null) {
      let prefSlotSort: any = [...userPrefSlots];
      let newSort = prefSlotSort.sort(function (a: any, b: any) {
        return (
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
      });
      set_user_preference_slots(newSort);
    }
  }, [userPrefSlots]);

  React.useEffect(() => {
    if (user && user.role === 1 && user.studentProfile) {
      if (user.studentProfile.assignedLibrary) {
        var libraryID = user.studentProfile?.assignedLibrary.uniqueID;
        set_libID(user.studentProfile?.assignedLibrary.id);
        dispatch(getLibraryComputerReservations(libraryID));
      }
    } else if (user && user.role === 2 && user.mentorProfile) {
      if (user.mentorProfile.assignedLibrary) {
        var libraryID2 = user.mentorProfile.assignedLibrary.uniqueID;
        set_libID(user.mentorProfile.assignedLibrary.id);

        dispatch(getLibraryComputerReservations(libraryID2));
      }
    } else if (user && user.role === 3 && user.advisorProfile) {
      if (user.advisorProfile.library) {
        var libraryID3 = user.advisorProfile.library.uniqueID;
        set_libID(user.advisorProfile.library.id);
        dispatch(getLibraryUserSlots(libraryID3));
        dispatch(getLibraryComputerReservations(libraryID3));
        dispatch(getLibraryMentors(libraryID3));
        dispatch(getLibraryStudents(libraryID3));
      }
    } else if (user && user.role === 4 && user.librarianProfile) {
      if (user.librarianProfile.library) {
        var libraryID4 = user.librarianProfile.library.uniqueID;
        set_libID(libraryID4);
        dispatch(getLibraryUserSlots(libraryID4));
        dispatch(getLibraryComputerReservations(libraryID4));
        dispatch(getLibraryMentors(libraryID4));
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

  const handlePageChange2 = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    set_activePaginationIndex2(value);
  };


  const toggleViewAssignedFilter = (value:boolean) => {

    if (userPrefSlots !== undefined && userPrefSlots !== null) {
      let prefSlotSort: any = [...userPrefSlots];
      if (value === true) {
        prefSlotSort = prefSlotSort.filter((pref:any) => pref.student === null)

        let newSort = prefSlotSort.sort(function (a: any, b: any) {
          return (
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
          );
        });
        set_user_preference_slots(newSort);
      }else{
        let newSort = prefSlotSort.sort(function (a: any, b: any) {
          return (
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
          );
        });
        set_user_preference_slots(newSort);
      }

      set_viewAssigned(value)
    }
  };

  const handleToggleActiveReservationView = (reservation: any) => {
    console.log(reservation)

    if (editReservationModalOpen) {
      set_activeReservation(null);
      set_editReservationModalOpen(false);
      set_activeReservationForm(defaultForm);
    } else {
      set_activeReservation(reservation);
      set_editReservationModalOpen(true);
      set_activeReservationForm(reservation);
    }
  };

  const handleToggleDeleteReservationConfirm = (reservation: any) => {
    console.log(reservation);
    if (deleteReservationConfirmModalOpen) {
      set_activeReservationToDelete(null);
      set_deleteReservationConfirmModalOpen(false);
    } else {
      set_activeReservationToDelete(reservation);
      set_deleteReservationConfirmModalOpen(true);
    }
  };

  const handleAddReservation = (reservation: any) => {
    console.log(reservation);

    let obj = { ...reservation, library: libID };
    delete obj.uniqueID;
    //dispatch(createLibraryReservation(obj))
  };

  const handleEditReservation = (reservation: any) => {
    console.log(reservation);

    var studentId = null;
    var mentorId = null;
    var comp = null;
    if (reservation.computer) {
      comp = reservation.computer?.id;
    }

    if (reservation.student && typeof reservation.student === 'object') {
      studentId = reservation?.student?.id;
    }else{
      studentId = reservation.student
    }

    if (reservation.mentor) {
      mentorId = reservation?.mentor?.id;
    }
    let obj = {
      ...reservation,
      student: studentId,
      computer: comp,
      mentor: mentorId,
    };
    console.log(obj);
    dispatch(updateLibraryComputerReservation(obj, obj.uniqueID));
  };

  const handleDeleteReservation = (reservation: any) => {
    dispatch(deleteLibraryComputerReservation(reservation.uniqueID));
  };

  const ReservationRow = ({ reservation }: { reservation: any }) => {
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
        key={reservation.uniqueID}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell scope="column">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <CalendarMonthIcon />
            {moment(reservation.startTime).format('dddd, MMMM Do') || '-'}
          </Box>
        </TableCell>
        <TableCell align="center">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <AccessTimeIcon />
            {moment(reservation.startTime).format('h:mm a')} -
            {moment(reservation.endTime).format('h:mm a')}
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <PersonIcon />{' '}
            {(reservation.student && reservation.student.firstName) || '-'}{' '}
            {(reservation.student && reservation.student.lastName) || '-'}
          </Box>
        </TableCell>
        <TableCell>
          <PersonIcon />{' '}
          {(reservation.mentor && reservation.mentor.firstName) || '-'}{' '}
          {(reservation.mentor && reservation.mentor.lastName) || '-'}
        </TableCell>
        <TableCell>
          {moment(reservation.createdAt).format('MM/DD/YY HH:MM A') || '-'}
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
              onClick={() => handleToggleActiveReservationView(reservation)}
            >
              View/Edit...
            </MenuItem>
            <MenuItem
              onClick={() => handleToggleDeleteReservationConfirm(reservation)}
            >
              <div style={{ color: 'red' }}>Remove...</div>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  const renderReservations = (reservations: any[], filterTxt: string) => {
    if (reservations.length === 0) {
      return null;
    }
    let renderList = [];
    let filteredList = [];
    if (filterTxt === '') {
      filteredList = [...reservations];
    } else {
      filteredList = reservations.filter(
        (item: any) =>
          item.name && item.name.toLowerCase().includes(filterTxt.toLowerCase())
      );
    }
    renderList = filteredList.map((reservation) => {
      return <ReservationRow reservation={reservation} />;
    });
    return renderList;
  };

  /*
   * User Pref Slot Functions
   */

  const handleToggleActiveUserPrefView = (userPrefSlot: any) => {
    if (editUserPrefSlotModalOpen) {
      set_activeUserPrefSlot(null);
      set_editUserPrefSlotModalOpen(false);
      set_activeUserPrefSlotForm(defaultForm);
    } else {
      set_activeUserPrefSlot(userPrefSlot);
      set_editUserPrefSlotModalOpen(true);
      set_activeUserPrefSlotForm(userPrefSlot);
    }
  };

  const handleToggleDeleteUserPrefConfirm = (userPrefSlot: any) => {
    if (deleteUserPrefSlotConfirmModalOpen) {
      set_activeUserPrefSlotToDelete(null);
      set_deleteUserPrefSlotConfirmModalOpen(false);
    } else {
      set_activeUserPrefSlotToDelete(userPrefSlot);
      set_deleteUserPrefSlotConfirmModalOpen(true);
    }
  };


  const handleToggleAssignStudentPrefView = (userPrefSlot: any) => {
    if (assignStudentSlotModalOpen) {
      set_activeUserPrefSlot(null);
      set_assignStudentSlotModalOpen(false);
      set_activeUserPrefSlotForm(defaultForm);
    } else {
      set_activeUserPrefSlot(userPrefSlot);
      set_assignStudentSlotModalOpen(true);
      set_activeUserPrefSlotForm(userPrefSlot);
    }
  };

  const handleAddUserPrefSlot = (userPrefSlot: any) => {
    console.log(userPrefSlot);
    let obj = { ...userPrefSlot, library: libID };
    delete obj.uniqueID;
    //dispatch(createLibraryReservation(obj))
  };

  const handleEditUserPrefSlot = (userPrefSlot: any) => {
    console.log(userPrefSlot)
    let stud:number | null = null
    if (userPrefSlot.student && userPrefSlot?.student.id) {
      stud = userPrefSlot?.student.id
    }
    let obj = { ...userPrefSlot, student: stud };
    console.log(obj);
    dispatch(updateLibraryUserSlot(obj, obj.uniqueID));
  };

  const handleAssignUserSlot = (userPrefSlot: any, studentId:number) => {
    let obj = { ...userPrefSlot, student: studentId, mentor:userPrefSlot?.mentor.id};
    console.log(obj);
    dispatch(updateLibraryUserSlot(obj, obj.uniqueID));
  };

  const handleDeleteUserPrefSlot = (userPrefSlot: any) => {
    console.log(userPrefSlot);
    dispatch(deleteLibraryUserSlot(userPrefSlot.uniqueID));
    set_activeUserPrefSlot(null);
    set_deleteUserPrefSlotConfirmModalOpen(false);
  };

  const UserPreferenceSlotRow = ({ userPrefSlot }: { userPrefSlot: any }) => {
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
        key={userPrefSlot.uniqueID}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell scope="column">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <CalendarMonthIcon />
            {moment(userPrefSlot.startTime).format('dddd, MMMM Do') || '-'}
          </Box>
        </TableCell>
        <TableCell align="center">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <AccessTimeIcon />
            {moment(userPrefSlot.startTime).format('h:mm a')} -
            {moment(userPrefSlot.endTime).format('h:mm a')}
          </Box>
        </TableCell>
        <TableCell scope="column">
          <b>{userPrefSlot.isRecurring ? 'Yes' : 'No'}</b>
          <br />
          {userPrefSlot.isRecurring
            ? `End Date: ${moment(userPrefSlot.endRecurring).format(
                'MM/DD/YYYY'
              )}`
            : null}
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <PersonIcon />{' '}
            {(userPrefSlot.student && userPrefSlot.student.firstName) || '-'}{' '}
            {(userPrefSlot.student && userPrefSlot.student.lastName) || '-'}
          </Box>
        </TableCell>
        <TableCell>
          <PersonIcon />{' '}
          {(userPrefSlot.mentor && userPrefSlot.mentor.firstName) || '-'}{' '}
          {(userPrefSlot.mentor && userPrefSlot.mentor.lastName) || '-'}
        </TableCell>
        <TableCell>
          {moment(userPrefSlot.createdAt).format('MM/DD/YY HH:MM A') || '-'}
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
            {user && user.role === 3 &&
              <MenuItem
                onClick={() => handleToggleActiveUserPrefView(userPrefSlot)}
              >
                View/Edit...
              </MenuItem>
            }

            {user && (user.role === 3 || user.role === 4) &&
              <MenuItem
                onClick={() => handleToggleAssignStudentPrefView(userPrefSlot)}
              >
                Assign a Student...
              </MenuItem>
            }
            {user && user.role === 3 &&
              <MenuItem
                onClick={() => handleToggleDeleteUserPrefConfirm(userPrefSlot)}
              >
                <div style={{ color: 'red' }}>Delete...</div>
              </MenuItem>
            }
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  const renderUserPrefSlots = (userPrefSlots: any[], filterTxt: string) => {
    if (userPrefSlots.length === 0) {
      return null;
    }
    let renderList = [];
    let filteredList = [];
    if (filterTxt === '') {
      filteredList = [...userPrefSlots];
    } else {
      filteredList = userPrefSlots.filter(
        (item: any) =>
          item.firstName &&
          item.firstName.toLowerCase().includes(filterTxt.toLowerCase())
      );
    }
    renderList = filteredList.map((userPrefSlot) => {
      return <UserPreferenceSlotRow userPrefSlot={userPrefSlot} />;
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
      set_activeReservationForm({
        ...activeReservationForm,
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
        open={deleteReservationConfirmModalOpen}
        onClose={() => set_deleteReservationConfirmModalOpen(false)}
        title={'Delete Reservation?'}
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
            Are you sure you want to delete this reservation? This student's
            session will be cancelled, but if in a recurring series, all other
            sessions have been kept.
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
              {activeReservationToDelete && activeReservationToDelete.student
                ? `${activeReservationToDelete.student?.firstName} ${activeReservationToDelete.student?.lastName}`
                : `No student...`}
            </b>
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Assigned Mentor:{' '}
            <b>
              {activeReservationToDelete && activeReservationToDelete.mentor
                ? `${activeReservationToDelete.mentor.firstName} ${activeReservationToDelete.mentor?.lastName}`
                : `No mentor...`}
            </b>
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Start - End Date & Time:{' '}
            <b>
              {activeReservationToDelete
                ? `${
                    moment(activeReservationToDelete.startTime).format(
                      'dddd, MMMM Do hh:mm a'
                    ) || '-'
                  } - ${
                    moment(activeReservationToDelete.endTime).format(
                      'dddd, MMMM Do'
                    ) || '-'
                  }`
                : `No user preference time...`}
            </b>
          </Typography>

          <Button
            onClick={() => handleDeleteReservation(activeReservationToDelete)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? (
              <CircularProgress />
            ) : (
              `Yes, delete this reservation.`
            )}
          </Button>
          <Button
            onClick={() =>
              handleToggleDeleteReservationConfirm(activeReservationToDelete)
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
        open={deleteUserPrefSlotConfirmModalOpen}
        onClose={() => set_deleteUserPrefSlotConfirmModalOpen(false)}
        title={'Delete User Preference Slot?'}
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
            Are you sure you want to delete this user preference slot? It will
            remove all connected computer reservations for this student.
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
              {activeUserPrefSlotToDelete && activeUserPrefSlotToDelete.student
                ? `${activeUserPrefSlotToDelete.student.firstName} ${activeUserPrefSlotToDelete.student.lastName}`
                : `No student...`}
            </b>
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Assigned Mentor:{' '}
            <b>
              {activeUserPrefSlotToDelete && activeUserPrefSlotToDelete.mentor
                ? `${activeUserPrefSlotToDelete.mentor.firstName} ${activeUserPrefSlotToDelete.mentor.lastName}`
                : `No mentor...`}
            </b>
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Initial Start - End Date & Time:{' '}
            <b>
              {activeUserPrefSlotToDelete
                ? `${
                    moment(activeUserPrefSlotToDelete.startTime).format(
                      'dddd, MMMM Do hh:mm a'
                    ) || '-'
                  } - ${
                    moment(activeUserPrefSlotToDelete.endTime).format(
                      'dddd, MMMM Do'
                    ) || '-'
                  }`
                : `No user preference time...`}
            </b>
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Recurring Start - End Date & Time:{' '}
            <b>
              {activeUserPrefSlotToDelete
                ? `${
                    (activeUserPrefSlotToDelete.startRecurring &&
                      moment(activeUserPrefSlotToDelete.startRecurring).format(
                        'dddd, MMMM Do hh:mm a'
                      )) ||
                    '-'
                  } - ${
                    (activeUserPrefSlotToDelete.endRecurring &&
                      moment(activeUserPrefSlotToDelete.endRecurring).format(
                        'dddd, MMMM Do'
                      )) ||
                    '-'
                  }`
                : `No user preference time...`}
            </b>
          </Typography>

          <Button
            onClick={() => handleDeleteUserPrefSlot(activeUserPrefSlotToDelete)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? (
              <CircularProgress />
            ) : (
              `Yes, delete this user slot.`
            )}
          </Button>
          <Button
            onClick={() =>
              handleToggleDeleteUserPrefConfirm(activeUserPrefSlotToDelete)
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
        open={editReservationModalOpen}
        onClose={() => set_editReservationModalOpen(false)}
        title={'Edit Reservation'}
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
                  <FormLabel>Student</FormLabel>
                  <b>
                    {activeReservationForm &&
                      activeReservationForm.student?.firstName}{' '}
                    {activeReservationForm &&
                      activeReservationForm.student?.lastName}
                  </b>

                  <FormLabel>Change Active Mentor</FormLabel>
                  {activeReservationForm !== undefined &&
                  activeReservationForm !== null ? (
                    <StudentUserDropdown
                      selectedUser={activeReservationForm.student}
                      isRequired={false}
                      defaultValue={
                        activeReservationForm.student
                          ? activeReservationForm.student?.pk
                          : null
                      }
                      handleSelectUser={(id) =>
                        set_activeReservationForm({
                          ...activeReservationForm,
                          student: id,
                        })
                      }
                    />
                  ) : null}

                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Assigned Mentor</FormLabel>
                  <p>
                    Current:{' '}
                    <b>
                      {activeReservation && activeReservation.mentor
                        ? `${
                            activeReservation &&
                            activeReservation.mentor.firstName
                          } ${
                            activeReservation &&
                            activeReservation.mentor.lastName
                          }`
                        : 'No mentor assigned'}
                    </b>
                  </p>

                  <FormLabel>Change Active Mentor</FormLabel>
                  {activeReservationForm !== undefined &&
                  activeReservationForm !== null ? (
                    <MentorUserDropdown
                      selectedUser={activeReservationForm.mentor}
                      isRequired={false}
                      defaultValue={
                        activeReservationForm.mentor
                          ? activeReservationForm.mentor?.pk
                          : null
                      }
                      handleSelectUser={(id) =>
                        set_activeReservationForm({
                          ...activeReservationForm,
                          mentor: id,
                        })
                      }
                    />
                  ) : null}
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Start Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      value={activeReservationForm.startTime}
                      onChange={(newValue) => {
                        set_activeReservationForm({
                          ...activeReservationForm,
                          startTime: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>End Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      value={activeReservationForm.endTime}
                      onChange={(newValue) => {
                        set_activeReservationForm({
                          ...activeReservationForm,
                          endTime: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <br />
                <br />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Unique ID: <b>{activeReservationForm.uniqueID}</b>
                </Typography>
                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Computer:
                  <b>{activeReservationForm.computer ? 'Yes' : 'No'}</b>
                  <br />
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
                    {activeReservationForm &&
                      moment(activeReservationForm.createdAt).format(
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
                  Reservation Slot Actions
                </Typography>
                <Button
                  onClick={() =>
                    handleToggleDeleteReservationConfirm(activeReservation)
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
                onClick={() =>
                  handleToggleActiveReservationView(activeReservation)
                }
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleEditReservation(activeReservationForm)}
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
        open={editUserPrefSlotModalOpen}
        onClose={() => set_editUserPrefSlotModalOpen(false)}
        title={'Edit Student Preference Slot'}
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
                  <FormLabel>Student</FormLabel>
                  <b>
                    {activeUserPrefSlot &&
                      activeUserPrefSlot.student?.firstName}{' '}
                    {activeUserPrefSlot && activeUserPrefSlot.student?.lastName}
                  </b>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Assigned Mentor</FormLabel>
                  <p>
                    Current:{' '}
                    <b>
                      {activeUserPrefSlot && activeUserPrefSlot.mentor
                        ? `${
                            activeUserPrefSlot &&
                            activeUserPrefSlot.mentor.firstName
                          } ${
                            activeUserPrefSlot &&
                            activeUserPrefSlot.mentor.lastName
                          }`
                        : 'No mentor assigned'}
                    </b>
                  </p>

                  <FormLabel>Change Active Mentor</FormLabel>
                  {activeUserPrefSlotForm !== undefined &&
                  activeUserPrefSlotForm !== null ? (
                    <MentorUserDropdown
                      selectedUser={activeUserPrefSlotForm.mentor}
                      isRequired={false}
                      defaultValue={
                        activeUserPrefSlotForm.mentor
                          ? activeUserPrefSlotForm.mentor?.pk
                          : null
                      }
                      handleSelectUser={(id) =>
                        set_activeUserPrefSlotForm({
                          ...activeUserPrefSlotForm,
                          mentor: id,
                        })
                      }
                    />
                  ) : null}
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Start Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      disabled={true}
                      value={activeUserPrefSlotForm.startTime}
                      onChange={(newValue) => {
                        set_activeUserPrefSlotForm({
                          ...activeUserPrefSlotForm,
                          startTime: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>End Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      disabled={true}
                      value={activeUserPrefSlotForm.endTime}
                      onChange={(newValue) => {
                        set_activeUserPrefSlotForm({
                          ...activeUserPrefSlotForm,
                          endTime: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Start Recurring Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      value={activeUserPrefSlotForm.startRecurring}
                      disabled={true}
                      onChange={(newValue) => {
                        set_activeUserPrefSlotForm({
                          ...activeUserPrefSlotForm,
                          startRecurring: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>End Recurring Date & Time</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label=""
                      disabled={true}
                      value={activeUserPrefSlotForm.endRecurring}
                      onChange={(newValue) => {
                        set_activeUserPrefSlotForm({
                          ...activeUserPrefSlotForm,
                          endRecurring: newValue,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Unique ID: <b>{activeUserPrefSlotForm.uniqueID}</b>
                </Typography>
                <br />
                <br />
                <Typography
                  variant="body1"
                  alignSelf="flex-start"
                  color={scss_variables.primary_color}
                >
                  Recurring?:
                  <b>{activeUserPrefSlotForm.isRecurring ? 'Yes' : 'No'}</b>
                  <br />
                  <b>
                    {activeUserPrefSlotForm.isRecurring
                      ? `End Date: ${moment(
                          activeUserPrefSlotForm.endRecurring
                        ).format('MM/DD/YYYY')}`
                      : null}
                  </b>
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
                    {activeUserPrefSlotForm &&
                      moment(activeUserPrefSlotForm.createdAt).format(
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
                  Preference Slot Actions
                </Typography>
                <Button
                  onClick={() =>
                    handleToggleDeleteUserPrefConfirm(activeUserPrefSlot)
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
                onClick={() =>
                  handleToggleActiveUserPrefView(activeUserPrefSlot)
                }
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleEditUserPrefSlot(activeUserPrefSlotForm)}
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
        open={addReservationModalOpen}
        onClose={() => set_addReservationModalOpen(false)}
        title={'Add Reservation'}
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
                  <FormLabel>Reservation Name</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.name}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        name: e.target.value,
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
                    value={activeReservationForm.email}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        email: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Identifier</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.key}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        key: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>IP - Address</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.ipAddress}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        ipAddress: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Notes</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.notes}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        notes: e.target.value,
                      })
                    }
                    multiline
                    rows={3}
                    variant="standard"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
            </Grid>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={() =>
                  handleToggleActiveReservationView(activeReservation)
                }
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleAddReservation(activeReservationForm)}
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
        open={addUserPrefSlotModalOpen}
        onClose={() => set_addUserPrefSlotModalOpen(false)}
        title={'Add Student Preference Slot'}
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
                  <FormLabel>Reservation Name</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.name}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        name: e.target.value,
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
                    value={activeReservationForm.email}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        email: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Identifier</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.key}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        key: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>IP - Address</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.ipAddress}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        ipAddress: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                  <FormLabel>Notes</FormLabel>
                  <TextField
                    id="standard-basic"
                    value={activeReservationForm.notes}
                    onChange={(e) =>
                      set_activeReservationForm({
                        ...activeReservationForm,
                        notes: e.target.value,
                      })
                    }
                    multiline
                    rows={3}
                    variant="standard"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
            </Grid>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={() =>
                  handleToggleActiveReservationView(activeReservation)
                }
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleAddReservation(activeReservationForm)}
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

      <AssignStudentModal loading={appState.loading} set_activeUserPrefSlotForm={set_activeUserPrefSlotForm} eventOrSlot={activeUserPrefSlotForm} handleSubmit={handleAssignUserSlot} title={'Assign Student'} onClose={() => set_assignStudentSlotModalOpen(false)} open={assignStudentSlotModalOpen}/>

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
                    Program Reservations
                  </Typography>
                </div>

                {toggleView === false ? (
                  <div className="card-body">
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Student Preference Slots
                    </Typography>
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
                      <Box>



                      {viewAssigned
                        ? (
                          <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                              toggleViewAssignedFilter(false)}}
                            sx={{ mt: 2, ml: 2 }}
                          >
                            {appState.loading ? (
                              <CircularProgress />
                            ) : (
                              `View All`
                            )}
                          </Button>
                        )
                        : (
                          <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                              toggleViewAssignedFilter(true)
                            }}
                            sx={{ mt: 2, ml: 2 }}
                          >
                            {appState.loading ? (
                              <CircularProgress />
                            ) : (
                              `View Unassigned`
                            )}
                          </Button>
                        )
                      }


                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => set_toggleView(!toggleView)}
                        sx={{ mt: 2, ml: 2 }}
                      >
                        {appState.loading ? (
                          <CircularProgress />
                        ) : (
                          `View Computer Reservations`
                        )}
                      </Button>
                      </Box>
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
                              <TableCell>Slot Preference Date</TableCell>
                              <TableCell>Slot Time</TableCell>
                              <TableCell>Recurring</TableCell>
                              <TableCell>Student</TableCell>
                              <TableCell>Mentor</TableCell>
                              <TableCell>Created At</TableCell>
                              <TableCell align="right">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {user_preference_slots ? (
                              <>
                                {user_preference_slots.length > 0 ? (
                                  <>
                                    {renderUserPrefSlots(
                                      paginate(
                                        user_preference_slots,
                                        activePaginationIndex2,
                                        numOfItems
                                      ).data,
                                      filterText2
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
                                      No student preference slots...
                                    </TableCell>
                                    <TableCell>-</TableCell>
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
                    {user_preference_slots && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Pagination
                          shape="rounded"
                          count={
                            paginate(
                              user_preference_slots,
                              activePaginationIndex2,
                              numOfItems
                            ).totalPages
                          }
                          page={activePaginationIndex2}
                          onChange={handlePageChange2}
                        />
                      </Box>
                    )}
                  </div>
                ) : (
                  <div className="card-body">
                    <Typography
                      variant="h6"
                      alignSelf="flex-start"
                      color={scss_variables.primary_color}
                    >
                      Computer Reservations
                    </Typography>
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
                          label="Search by student name..."
                          onChange={(e) => set_filterText(e.target.value)}
                          variant="standard"
                        />
                      </FormControl>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => set_toggleView(!toggleView)}
                        sx={{ mt: 2, ml: 2 }}
                      >
                        {appState.loading ? (
                          <CircularProgress />
                        ) : (
                          `View Student Preference Slots`
                        )}
                      </Button>
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
                              <TableCell>Reservation Date</TableCell>
                              <TableCell>Reservation Time</TableCell>
                              <TableCell>Student</TableCell>
                              <TableCell>Mentor</TableCell>
                              <TableCell>Reserved At</TableCell>
                              <TableCell align="right">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reservations ? (
                              <>
                                {reservations.length > 0 ? (
                                  <>
                                    {renderReservations(
                                      paginate(
                                        reservations,
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
                                      No reservations...
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
                    {reservations && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Pagination
                          shape="rounded"
                          count={
                            paginate(
                              reservations,
                              activePaginationIndex,
                              numOfItems
                            ).totalPages
                          }
                          page={activePaginationIndex}
                          onChange={handlePageChange}
                        />
                      </Box>
                    )}
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </MainCardLayoutWithSideMenu>
      </PageLayout>
    </>
  );
};
export default Reservations;
