import * as React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  CircularProgress,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  Notes,
  Person,
  PhotoCameraFront,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer';
import {
  PageLayout,
  MainCardLayoutWithSideMenu,
} from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import {
  getUserComputerReservationSlots,
  getLibraryComputerSlots,
  createUserPreferenceSlot,
  getUserPreferenceSlots,
  deleteUserPreferenceSlot,
  getLibraryStudentPreferenceSlots,
  createComputerReservationSlot,
} from '../../redux/bookings/bookings.actions';
import { selectLibrarySlots } from '../../redux/bookings/bookings.selectors';
import { BasicModal } from '../../components/Modals';
import MentorBookingModal from '../../components/mentor/MentorBookingModal';

const CURRENT_DATE = moment().toDate();

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const bookings = useSelector((store: AppState) => store.bookings);
  const lib_slots = useSelector(
    (store: AppState) => store.bookings.library_slots
  );
  const mentor_preference_slots = useSelector(
    (store: AppState) => store.bookings.mentor_preference_slots
  );
  const user_reservation_slots = useSelector(
    (store: AppState) => store.bookings.user_reservation_slots
  );

  const calendarRef = React.createRef<any>();

  const [sessions, setSessions] = React.useState([]);
  const [rescheduleActive, setRescheduleActive] = React.useState(false);
  const [isMobile, set_isMobile] = React.useState(false);

  const [rescheduleData, set_rescheduleData] = React.useState({ revert: null });

  const [activeReschedule, set_activeReschedule] = React.useState({
    id: '',
    start_time: '',
    end_time: '',
  });
  const [prevReschedule, set_prevReschedule] = React.useState({
    id: '',
    start_time: '',
    end_time: '',
  });
  const [activeBooking, set_activeBooking] = React.useState({
    uniqueID: '',
    start_time: '',
    end_time: '',
  });
  const [newBooking, set_newBooking] = React.useState({
    uniqueID: '',
    start: '',
    end: '',
    startRecur: '',
    endRecur: '',
    is_recurring: false,
  });
  const [activeBookingToDelete, set_activeBookingToDelete] = React.useState({
    uniqueID: '',
    start: '',
    end: '',
    startRecur: '',
    endRecur: '',
    event: null,
    is_recurring: false,
  });

  const [events, setEvents] = React.useState<any[]>([]);
  const [scheduleEvents, set_scheduleEvents] = React.useState<any[]>([]);
  const [activeLibrarySlot, setActiveLibrarySlot] = React.useState<any>(null);
  const [selectedOpenReservation, setSelectedOpenReservation] =
    React.useState<any>(null);
  const [activeLibrary, setActiveLibrary] = React.useState<any>(null);

  const today = moment();

  const todayDate = new Date();

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 6);

  const futureRecurrDate = new Date();
  futureRecurrDate.setDate(futureRecurrDate.getDate() + 1825);


  const [createUserSlotModalOpen, set_createUserSlotModalOpen] =
    React.useState(false);
  const [deleteSlotConfirmModalOpen, set_deleteSlotConfirmModalOpen] =
    React.useState(false);
  const [slotReservationModalOpen, setSlotReservationModalOpen] =
    React.useState(false);

  const [selectedConferenceType, set_selectedConferenceType] =
    React.useState('google');
  const [selectedOpenReservationNotes, set_selectedOpenReservationNotes] =
    React.useState('');

  React.useEffect(() => {
    if (user && user.mentorProfile && user.mentorProfile !== null) {
      if (user.mentorProfile.assignedLibrary) {
        var libraryID2 = user.mentorProfile.assignedLibrary.uniqueID;
        dispatch(getLibraryComputerSlots(libraryID2));
        //dispatch(getLibraryStudentPreferenceSlots(libraryID2));
        dispatch(getUserPreferenceSlots())
        setActiveLibrary(user.mentorProfile.assignedLibrary);
        dispatch(getUserComputerReservationSlots());
      }
    }
  }, [user]);

  React.useEffect(() => {}, []);

  // React.useEffect(() => {
  //   if (user && user.studentProfile) {
  //     var libraryID = user.studentProfile?.assignedLibrary?.uniqueID
  //     dispatch(getLibraryComputerSlots(libraryID))
  //     dispatch(getUserPreferenceSlots())
  //   }
  //   if (user && user.mentorProfile) {
  //     var libraryID = user.mentorProfile?.assignedLibrary?.uniqueID
  //     dispatch(getLibraryComputerSlots(libraryID))
  //     dispatch(getUserPreferenceSlots())
  //   }
  // }, [user]);

  React.useEffect(() => {
    if (lib_slots !== undefined && lib_slots !== null) {
      const generateSlots = async () => {
        var slots: any = [];
        lib_slots.forEach((slot) => {
          var newSlot = {};
          if (
            slot.startRecurring &&
            slot.endRecurring &&
            slot.startRecurring !== null &&
            slot.endRecurring !== null
          ) {
            let start = moment(slot.startTime); // some random moment in time (in ms)
            let end = moment(slot.endTime); // some random moment after start (in ms)

            const userTimzezone = moment.tz.guess();

            let startTime = moment(slot.startTime).tz(userTimzezone).format('HH:mm')
            let endTime = moment(slot.endTime).tz(userTimzezone).format('HH:mm')

            newSlot = {
              title: 'Open Library Slot',
              start: slot.startTime,
              end: slot.endTime,
              startTime: startTime,
              endTime: endTime,
              startRecur: slot.startRecurring,
              endRecur: slot.endRecurring,
              daysOfWeek: [slot.day],
              display: 'background',
              groupId: 'openSlots',
              extendedProps: {
                uniqueID: slot.uniqueID,
              },
              allDay: false, // will make the time show
            };
          } else {
            newSlot = {
              title: 'Open Library Slot',
              start: slot.startTime,
              end: slot.endTime,
              display: 'background',
              groupId: 'openSlots',
              extendedProps: {
                uniqueID: slot.uniqueID,
              },
              allDay: false, // will make the time show
            };
          }
          slots.push(newSlot);
        });
        let tempArr = [...slots, ...scheduleEvents];
        set_scheduleEvents(tempArr);
        if (calendarRef.current) {
          const api = calendarRef.current.getApi();
          api.refetchEvents();
        }
      };
      generateSlots();
    }
  }, [lib_slots]);

  React.useEffect(() => {
    if (
      mentor_preference_slots !== undefined &&
      mentor_preference_slots !== null &&
      user !== undefined &&
      user !== null
    ) {
      var mentor_slots: any = [];

      //Duplicate Check
      // for (let index = 0; index < student_preference_slots.length; index++) {
      //   const slot:any = student_preference_slots[index];
      //

      // var keys = ['startTime'];
      // var filtered = student_preference_slots.filter(
      //     (s => o =>
      //         (k => !s.has(k) && s.add(k))
      //         (keys.map(k => o[k]).join('|'))
      //     )
      //     (new Set)
      // );
      // }

      let filteredSlots = [];

      const sortedSlots = mentor_preference_slots
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt);

      for (let index = 0; index < sortedSlots.length; index++) {
        const slotelement: any = sortedSlots[index];

        var prev = sortedSlots[index - 1];
        var next = sortedSlots[index + 1];

        if (!prev) {
          filteredSlots.push(slotelement);
          continue;
        }

        if (slotelement.startTime === prev.startTime) {
          var prevIdx = index - 1;

          if (slotelement.createdAt > prev.createdAt) {
            continue;
          } else {
            filteredSlots.splice(prevIdx, 1);
            filteredSlots.push(slotelement);
            continue;
          }
        } else {
          filteredSlots.push(slotelement);
        }
      }

      //console.log(sortedSlots)
      console.log(filteredSlots);

      if (filteredSlots.length > 0) {
        for (let index = 0; index < filteredSlots.length; index++) {
          const slot: any = filteredSlots[index];
          var idList: any = [];
          scheduleEvents.forEach((element: any) => {
            idList.push(element.extendedProps.uniqueID);
          });
          if (idList.includes(slot.uniqueID)) {
            continue;
          } else {
            var newStudentSlot = {
              title: 'Student Slot',
              start: slot.startTime,
              end: slot.endTime,
              groupId: 'myBooks',
              extendedProps: {
                uniqueID: slot.uniqueID,
              },
              allDay: false, // will make the time show
            };
            mentor_slots.push(newStudentSlot);
          }
        }
      }
      let tempArrFinal = [...mentor_slots, ...scheduleEvents];
      set_scheduleEvents(tempArrFinal);
      if (calendarRef.current) {
        const api = calendarRef.current.getApi();
        api.refetchEvents();
      }
    }
  }, [mentor_preference_slots, user]);

  React.useEffect(() => {
    if (
      user_reservation_slots !== undefined &&
      user_reservation_slots !== null &&
      user !== undefined &&
      user !== null
    ) {
      var active_slots: any = [];
      if (user !== null) {
        user_reservation_slots.forEach((slot) => {
          var activeComputerReservationSlot = {
            title: 'My Booked Session',
            start: slot.startTime,
            end: slot.endTime,
            backgroundColor: '#107c10',
            groupId: 'activeComputerReservations',
            extendedProps: {
              uniqueID: slot.uniqueID,
            },
            allDay: false, // will make the time show
          };
          active_slots.push(activeComputerReservationSlot);
        });
      }

      setEvents(active_slots);

      if (calendarRef.current) {
        const api = calendarRef.current.getApi();
        api.refetchEvents();
      }
    }
  }, [user_reservation_slots]);

  function renderInnerContent(innerProps: any) {
    let splitTag = innerProps.event.groupId.split(':');
    let id = splitTag[0];

    return (
      <div className="fc-event-main-frame">
        {innerProps.event.groupId !== 'openSlots' &&
          innerProps.event.groupId !== 'alreadyBooked' &&
          rescheduleActive === true && (
            <div
              style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 99 }}
            >
              <button
                type="button"
                onClick={(e) => handleStudentSlotRemove(innerProps.event)}
                style={{ padding: 1 }}
                id="btnDeleteEvent"
              >
                X
              </button>
            </div>
          )}
        {innerProps.timeText && (
          <div className="fc-event-time">{innerProps.timeText}</div>
        )}
        <div className="fc-event-title-container">
          {innerProps.event.groupId === '' ||
          id === 'myBooks' ||
          innerProps.event.groupId === 'alreadyBooked' ? (
            <div className="fc-event-title fc-sticky">
              {innerProps.event.title || <>&nbsp;</>}
            </div>
          ) : (
            <div
              style={{
                fontSize: '14px',
                color: '#fff',
                padding: 5,
                borderRadius: 7,
              }}
              className="fc-event-title fc-sticky"
            >
              {innerProps.event.title || <>&nbsp;</>}
              {id === 'myBooks' && <div className="fc-event-time">-</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderInnerContent2(innerProps: any) {
    let splitTag = innerProps.event.groupId.split(':');
    let id = splitTag[0];
    return (
      <div
        className="fc-event-main-frame"
        onClick={() => toggleShowAvailableSlotReservation(innerProps.event)}
      >
        {innerProps.event.groupId !== 'alreadyBooked' &&
          id !== 'myBooks' &&
          id !== 'openSlots' &&
          rescheduleActive === true && (
            <div
              style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 99 }}
            >
              <button
                type="button"
                onClick={(e) => console.log(innerProps.event)}
                style={{ padding: 1 }}
                id="btnDeleteEvent"
              >
                X
              </button>
            </div>
          )}
        {innerProps.timeText && (
          <div className="fc-event-time">{innerProps.timeText}</div>
        )}
        <div className="fc-event-title-container">
          {innerProps.event.groupId === '' ||
          id === 'myBooks' ||
          innerProps.event.groupId === 'alreadyBooked' ? (
            <div className="fc-event-title fc-sticky">
              {innerProps.event.title || <>&nbsp;</>}
            </div>
          ) : (
            <div
              style={{
                fontSize: '14px',
                color: '#fff',
                padding: 5,
                borderRadius: 7,
              }}
              className="fc-event-title fc-sticky"
            >
              {innerProps.event.title || <>&nbsp;</>}
            </div>
          )}
        </div>
      </div>
    );
  }

  function getNextWeekDay(startDate: any, dayOfWeek: any) {
    var dayOffset =
      dayOfWeek > startDate.getDay()
        ? dayOfWeek - startDate.getDay()
        : dayOfWeek - startDate.getDay() + 7;
    startDate.setDate(startDate.getDate() + dayOffset);
    return startDate;
  }

  const onEventRemove = (event: any) => {
    const api = calendarRef.current.getApi();
    var calevents = api.getEvents();
    const id = event;
    const { defId } = event;
    const calEventsToDelete = calevents.filter(
      (eve: any, index: number) => eve._def.defId === event._def.defId
    );
    const calendarID = calEventsToDelete[0].id;
    const eventToDelete = api.getEventById(calEventsToDelete[0].id);
    set_newBooking({
      uniqueID: '',
      start: '',
      end: '',
      startRecur: '',
      endRecur: '',
      is_recurring: false,
    });
    event.remove();
  };

  const handleStudentSlotRemove = (event: any) => {
    //console.log(event)
    const { defId, extendedProps } = event._def;
    const { start, end } = event;
    //console.log(extendedProps.uniqueID)
    let eventObj: any = {
      start: start,
      end: end,
      uniqueID: extendedProps.uniqueID,
      event: event,
    };
    set_activeBookingToDelete(eventObj);
    set_deleteSlotConfirmModalOpen(true);
  };

  const handleDeleteUserPreferenceSlot = (bookingToDelete: any) => {
    dispatch(deleteUserPreferenceSlot(bookingToDelete.uniqueID));
  };

  const handleCancelDeleteUserPreferenceSlot = () => {
    set_activeBookingToDelete({
      start: '',
      end: '',
      uniqueID: '',
      startRecur: '',
      endRecur: '',
      is_recurring: false,
      event: null,
    });
    set_deleteSlotConfirmModalOpen(false);
  };

  const handleReserveOpenSlot = (selectedOpenReservation: any) => {
    console.log(selectedOpenReservation);
    dispatch(
      createComputerReservationSlot({
        unique_id: selectedOpenReservation.uniqueID,
        mentor: user.pk,
        conferenceType: selectedConferenceType,
        start_time: selectedOpenReservation.start,
        end_time: selectedOpenReservation.end,
        notes: selectedOpenReservationNotes,
      })
    );
  };

  const handleCancelReserveOpenSlot = () => {
    setSelectedOpenReservation({
      start: '',
      end: '',
      startRecur: '',
      endRecur: '',
      uniqueID: '',
      event: null,
    });
    setSlotReservationModalOpen(false);
  };

  const onEventAdded = (event: any) => {
    const api = calendarRef.current.getApi();
    //const apiEvent = api.addEvent(event);
    //setEventsForCheckout(eventsForCheckout => [...eventsForCheckout,event] );
    var calevents = api.getEvents();
    var allowed_area: any = [];
    calevents.forEach(function (evt: any) {
      if (evt.groupId === 'openSlots') {
        if (evt.start <= event.start && evt.end >= event.end) {
          // console.log(apiEvent)
          // console.log(apiEvent._def.defId)
          //const { defId } = apiEvent._def;
          const { extendedProps, defId } = evt._def;

          const { start, end } = event;
          console.log(extendedProps);
          //console.log(event)
          let eventObj: any = {
            start: start,
            end: end,
            eventId: evt.id,
            defId: defId,
            is_recurring: false,
            startRecur: '',
            endRecur: '',
            libComputerSlotID: extendedProps.uniqueID,
          };
          set_newBooking(eventObj);
          set_createUserSlotModalOpen(true);
          //setOffersForCheckout(eventsForCheckout => [...eventsForCheckout,eventObj] );
        }
      }
    });
  };

  const allowedSelection = (event: any) => {
    const api = calendarRef.current.getApi();
    var calevents = api.getEvents();
    var allowed_area: any = [];
    calevents.forEach(function (evt: any) {
      if (evt.groupId === 'openSlots') {
        if (evt.start <= event.start && evt.end >= event.end) {
          allowed_area.push(evt);
        }
      }
    });

    console.log(event);
    return allowed_area.length > 0;
  };

  const allowedSelectionMentor = (event: any) => {
    const api = calendarRef.current.getApi();
    var calevents = api.getEvents();
    var allowed_area: any = [];
    calevents.forEach(function (evt: any) {
      if (evt.groupId === 'myBooks') {
        if (evt.start <= event.start && evt.end >= event.end) {
          allowed_area.push(evt);
        }
      }
    });

    console.log(event);
    return allowed_area.length > 0;
  };

  const allowedDrop = (event: any) => {
    const api = calendarRef.current.getApi();
    var calevents = api.getEvents();
    var allowed_area: any = [];

    calevents.forEach(function (evt: any) {
      if (evt.groupId === 'openSlots') {
        if (evt.start <= event.start && evt.end >= event.end) {
          allowed_area.push(evt);
        }
      }
    });

    console.log(allowed_area);

    return allowed_area.length > 0;
  };

  const selectOverlap = (event: any) => {
    let splitTag = event.groupId.split(':');
    let id = splitTag[0];
    console.log(event);
    return event.groupId === 'openSlots' && id !== 'myBooks';
  };

  const selectOverlapMentor = (event: any) => {
    let splitTag = event.groupId.split(':');
    let id = splitTag[0];
    console.log(event);
    return event.groupId === 'openSlots' && id !== 'myBooks';
  };

  const eventOverlap = (event: any) => {
    let splitTag = event.groupId.split(':');
    let id = splitTag[0];
    console.log(id);
    return event.groupId === 'openSlots';
  };

  const handleCreateUserPreferenceSlot = (event: any) => {
    //console.log(event)
    let payloadObj = {};
    if (
      event.startRecur &&
      event.endRecur &&
      event.startRecur !== '' &&
      event.endRecur !== ''
    ) {

      var endDte = event.endRecur.split('-');
      //console.log(endDte)
      var endDateRecurr = new Date(endDte[0], endDte[1] - 1, endDte[2]);

      payloadObj = {
        startTime: event.start,
        endTime: event.end,
        start_recurring: event.start,
        end_recurring: endDateRecurr,
        lib_computer_slot: event.libComputerSlotID,
        conferenceType: selectedConferenceType,
        mentor: user.pk,
      };
    } else {
      payloadObj = {
        startTime: event.start,
        endTime: event.end,
        lib_computer_slot: event.libComputerSlotID,
        conferenceType: selectedConferenceType,
        mentor: user.pk,
      };
    }
    console.log(payloadObj);
    dispatch(createUserPreferenceSlot(payloadObj));
  };

  const toggleShowAvailableSlotReservation = (event: any) => {
    if (event.groupId !== 'myBooks') {
      return;
    }
    //console.log(event)
    const { defId, extendedProps } = event._def;
    const { start, end } = event;
    let eventObj: any = {
      start: start,
      end: end,
      uniqueID: extendedProps.uniqueID,
      event: event,
    };
    setSelectedOpenReservation(eventObj);
    setSlotReservationModalOpen(true);
  };

  return (
    <>
      <BasicModal
        open={createUserSlotModalOpen}
        onClose={() => set_createUserSlotModalOpen(false)}
        title={'Create Open Time Slot'}
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
            Are you sure you want to create this open slot? Your librarian will be able
            to schedule student 1:1 video calls with you based on your timeslot.
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Timeslot Details:{' '}
            <b>
              {newBooking
                ? `${newBooking.start} - ${newBooking.end}`
                : `No timeslot details...`}
            </b>
          </Typography>

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value={newBooking.is_recurring}
                control={
                  <Checkbox
                    onChange={(e) =>
                      set_newBooking({
                        ...newBooking,
                        is_recurring: !newBooking.is_recurring,
                        startRecur: newBooking.is_recurring === true ? '' : todayDate.toISOString().split('T')[0]                      })
                    }
                  />
                }
                label="Make this timeslot reccurring weekly."
              />
            </RadioGroup>
          </FormControl>
          {newBooking.is_recurring ? (
            <Box display="flex" flexWrap="wrap" alignItems="center">
              <FormControl>
                <TextField
                  id="date"
                  label="Recurring End Date"
                  type="date"
                  sx={{ width: 220 }}
                  inputProps={{ min: nextWeekDate.toISOString().split('T')[0] }}
                  value={newBooking.endRecur}
                  onChange={(e) =>
                    set_newBooking({
                      ...newBooking,
                      startRecur: newBooking.start,
                      endRecur: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <Typography
                ml={2}
                mt={1}
                variant="body1"
                alignSelf="flex-start"
                color={scss_variables.primary_color}
              >
                <b>Recommended End Date:</b> {futureRecurrDate.toISOString().split('T')[0]}
              </Typography>
            </Box>
          ) : null}


          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            You confirm that you will be commited to the given timeslot each
            week for the forseeable future, and meet with students consistently.
          </Typography>

          <Box display="flex" justifyContent="flex-start" width="100%">
            <FormControlLabel
              control={<Checkbox />}
              label="I Agree"
              sx={{ align: 'center' }}
            />
          </Box>

          <Typography variant="h6" mt={1}>Select Your Conference Type</Typography>

          <Box display="flex" alignItems="center">
            <PhotoCameraFront sx={{ mr: 2 }} />
            <RadioGroup
              row
              aria-labelledby="meeting-type"
              name="meetingType"
              value={selectedConferenceType}
              defaultValue="google"
              onChange={(e:any) =>
                set_selectedConferenceType(e.target.value)
              }
            >
              <FormControlLabel
                value="ms-teams"
                control={<Radio />}
                label="Microsoft Teams"
              />
              <FormControlLabel
                value="google"
                control={<Radio />}
                label="Google Meet"
              />
          </RadioGroup>
          </Box>





          <Button
            onClick={() => handleCreateUserPreferenceSlot(newBooking)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? <CircularProgress /> : `Create Timeslot`}
          </Button>
        </Box>
      </BasicModal>

      <BasicModal
        open={deleteSlotConfirmModalOpen}
        onClose={() => set_deleteSlotConfirmModalOpen(false)}
        title={'Delete Open Slot'}
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
            Are you sure you want to delete this open slot? No mentors will be
            able to book a session during this time.
          </Typography>
          <Typography
            mt={1}
            mb={1}
            variant="body1"
            alignSelf="flex-start"
            color={scss_variables.primary_color}
          >
            Timeslot Details:{' '}
            <b>
              {activeBookingToDelete
                ? `${activeBookingToDelete.start} - ${activeBookingToDelete.end}`
                : `No timeslot details...`}
            </b>
          </Typography>

          <Button
            onClick={() =>
              handleDeleteUserPreferenceSlot(activeBookingToDelete)
            }
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? <CircularProgress /> : `Yes, delete this slot.`}
          </Button>
          <Button
            onClick={() => handleCancelDeleteUserPreferenceSlot()}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            No, cancel.
          </Button>
        </Box>
      </BasicModal>

      <BasicModal
        open={slotReservationModalOpen}
        onClose={() => setSlotReservationModalOpen(false)}
        title={'Reserve Student Slot'}
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
            Are you sure you want to reserve this open slot?
          </Typography>

          {selectedOpenReservation ? (
            <MentorBookingModal
              eventOrSlot={selectedOpenReservation.event}
              selectedConferenceType={selectedConferenceType}
              set_selectedConferenceType={set_selectedConferenceType}
              selectedOpenReservationNotes={selectedOpenReservationNotes}
              set_selectedOpenReservationNotes={set_selectedOpenReservationNotes}
              onClose={() => null}
            />
          ) : null}

          <Button
            onClick={() => handleReserveOpenSlot(selectedOpenReservation)}
            variant="contained"
            color="info"
            sx={{ mt: 2 }}
          >
            {appState.loading ? (
              <CircularProgress />
            ) : (
              `Yes, reserve this slot.`
            )}
          </Button>
          <Button
            onClick={() => handleCancelReserveOpenSlot()}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            No, cancel.
          </Button>
        </Box>
      </BasicModal>

      <PageLayout>
        <MainCardLayoutWithSideMenu>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={9} lg={9}>
              <div className="card-container">
                <div className="card-header">
                  <Typography
                    variant="h6"
                    alignSelf="flex-start"
                    color={scss_variables.primary_color}
                  >
                    Your Library
                  </Typography>
                </div>
                <div className="card-body">
                  <Box
                    display={'flex'}
                    width={'100%'}
                    flexDirection={'column'}
                    justifyContent={'flex-start'}
                  >
                    {activeLibrary !== null ? (
                      <>
                        <Typography
                          variant="body1"
                          alignSelf="flex-start"
                          color={scss_variables.primary_color}
                        >
                          Library:{' '}
                          <b>
                            {activeLibrary.name
                              ? activeLibrary.name
                              : 'No library assigned...'}
                          </b>
                          <br />
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="body1"
                          alignSelf="flex-start"
                          color={scss_variables.primary_color}
                        >
                          Library: <b>{'No library assigned...'}</b>
                          <br />
                        </Typography>
                      </>
                    )}
                  </Box>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9}>
              <div className="card-container">
                <div className="card-header">
                  <Typography
                    variant="h6"
                    alignSelf="flex-start"
                    color={scss_variables.primary_color}
                  >
                    Bookings
                  </Typography>
                </div>
                <div className="card-body">
                  <Grid container spacing={1} mb={3}>
                    <Grid item xs={9}>
                      <Typography variant="body1" alignSelf="center">
                        View open library hours, modify your open time slots for
                        mentoring/computer reservation, or remove a slot.
                      </Typography>
                    </Grid>

                    {user && user.studentProfile !== null ? (
                      <Grid item xs={3}>
                        <Button
                          onClick={() => setRescheduleActive(!rescheduleActive)}
                          variant="contained"
                          color={rescheduleActive ? `error` : `info`}
                        >
                          {rescheduleActive ? `Cancel` : `Modify My Open Slots`}
                        </Button>
                      </Grid>
                    ) : user && user.mentorProfile !== null ? (
                      <Grid item xs={3}>
                        <Button
                          onClick={() => setRescheduleActive(!rescheduleActive)}
                          variant="contained"
                          color={rescheduleActive ? `error` : `info`}
                        >
                        {rescheduleActive ? `Cancel` : `Modify My Open Slots`}
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                  <Box
                    display={'flex'}
                    width={'100%'}
                    justifyContent={'center'}
                  >
                    {user &&
                    user.mentorProfile &&
                    scheduleEvents &&
                    scheduleEvents.length > 0 ? (
                      <FullCalendar
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        ref={calendarRef}
                        initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
                        defaultTimedEventDuration={'1:00:00'}
                        selectable={rescheduleActive ? true : false}
                        slotDuration={'00:60:00'}
                        editable={false}
                        aspectRatio={1}
                        contentHeight={'auto'}
                        headerToolbar={{
                          left: 'prev,next today',
                          center: 'title',
                          right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        titleFormat={
                          isMobile
                            ? {
                                month: 'short',
                                year: '2-digit',
                                day: 'numeric',
                                weekday: 'short',
                              }
                            : {
                                month: 'long',
                                year: 'numeric',
                                day: 'numeric',
                                weekday: 'long',
                              }
                        }
                        events={rescheduleActive ? scheduleEvents : events}
                        select={onEventAdded}
                        selectOverlap={selectOverlap}
                        selectAllow={allowedSelection}
                        eventContent={renderInnerContent}
                        eventOverlap={eventOverlap}
                        eventAllow={allowedDrop}
                        validRange={{
                          start: Date.now(),
                        }}
                      />
                    ) : user &&
                      user.studentProfile &&
                      scheduleEvents &&
                      scheduleEvents.length > 0 ? (
                      <FullCalendar
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        ref={calendarRef}
                        initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
                        defaultTimedEventDuration={'1:00:00'}
                        selectable={rescheduleActive ? true : false}
                        slotDuration={'00:60:00'}
                        editable={false}
                        aspectRatio={1}
                        contentHeight={'auto'}
                        headerToolbar={{
                          left: 'prev,next today',
                          center: 'title',
                          right: 'timeGridWeek,timeGridDay',
                        }}
                        titleFormat={
                          isMobile
                            ? {
                                month: 'short',
                                year: '2-digit',
                                day: 'numeric',
                                weekday: 'short',
                              }
                            : {
                                month: 'long',
                                year: 'numeric',
                                day: 'numeric',
                                weekday: 'long',
                              }
                        }
                        events={rescheduleActive ? scheduleEvents : events}
                        select={onEventAdded}
                        selectOverlap={selectOverlap}
                        selectAllow={allowedSelection}
                        eventContent={renderInnerContent}
                        eventOverlap={eventOverlap}
                        eventAllow={allowedDrop}
                        validRange={{
                          start: Date.now(),
                        }}
                      />
                    ) : user &&
                      user.mentorProfile &&
                      scheduleEvents &&
                      scheduleEvents.length === 0 ? (
                      <h6>No open hours found for this library.</h6>
                    ) : (
                      <CircularProgress />
                    )}
                  </Box>
                </div>
              </div>
            </Grid>
          </Grid>
        </MainCardLayoutWithSideMenu>
      </PageLayout>
    </>
  );
};
export default Bookings;
