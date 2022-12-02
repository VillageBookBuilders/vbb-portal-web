import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { SlotInfo } from 'react-big-calendar';
import { CalendarEvent, isCalendarEvent } from '../../utils/CalendarEvent';
import {
  AccessTime,
  Notes,
  Person,
  PhotoCameraFront,
} from '@mui/icons-material';
import { SlotSessions } from '../../utils/Session';
import { useState } from 'react';
import { BasicModal } from '../../components/Modals';
import StudentUserDropdown from '../../components/shared/StudentUserDropdown';
import moment from 'moment';

interface EventModalProps {
  eventOrSlot: any;
  open: boolean;
  title: string;
  onClose: () => void;
  set_activeUserPrefSlotForm: (data:any) => void;
  handleSubmit: (slot:any, id:number) => void;
  loading:boolean;
}

const fakeStudents = ['Student 1', 'Student 2', 'Student 3'];

const AssignStudentModal = ({ loading, eventOrSlot, set_activeUserPrefSlotForm, open, title, onClose, handleSubmit }: EventModalProps) => {
  const isEvent = isCalendarEvent(eventOrSlot);

  return (
    <BasicModal open={open} title={title} onClose={onClose}>
      <Typography variant="body1">Assign Student</Typography>
      <Typography variant="body1">Assing a student to this mentor’s preference slot.</Typography>
      <Grid container spacing={2} pt={2} pb={2} mt={2} mb={2}>
        <Grid item xs={4}>
          <Typography variant="body1">Date</Typography>
          <div style={{ flex: '0 0 150px' }}>
            <Typography variant="body1">
            {moment(eventOrSlot.startTime).format('dddd, MMMM Do')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1">Time</Typography>
          <div style={{ flex: '0 0 150px' }}>
            <Typography variant="body1">
              {moment(eventOrSlot.startTime).format('h:mm a')} -
              {moment(eventOrSlot.endTime).format('h:mm a')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1">Recurring?</Typography>
          <Typography variant="body1">
            <b>{eventOrSlot.isRecurring ? 'Yes' : 'No'}</b>
            <b>
              {eventOrSlot.isRecurring
                ? `End Date: ${moment(
                    eventOrSlot.endRecurring
                  ).format('MM/DD/YYYY')}`
                : null}
            </b>
          </Typography>
        </Grid>

        <Grid item xs={6}>
        <Typography variant="body1" mt={3}>Select A Student To Assign</Typography>
            {eventOrSlot &&
              <StudentUserDropdown
                selectedUser={eventOrSlot.student}
                isRequired={true}
                handleSelectUser={(id:number) =>
                  set_activeUserPrefSlotForm({
                    ...eventOrSlot,
                    student: id,
                  })
                }
              />
            }
        </Grid>
        <Grid item xs={12} mt={3}>
          <Typography variant="h6" mt={1}>Selected Conference Type</Typography>

          <Box display="flex" alignItems="center">
            <PhotoCameraFront sx={{ mr: 2 }} />
                <RadioGroup
                  row
                  aria-labelledby="meeting-type"
                  name="meetingType"
                  value={eventOrSlot.conferenceType}
                  defaultValue="google"
                  onChange={(e:any) =>
                    set_activeUserPrefSlotForm({
                      ...eventOrSlot,
                      conferenceType: e.target.value,
                    })
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
        </Grid>
        <Grid item xs={12} mt={3}>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                onClick={onClose}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleSubmit(eventOrSlot, eventOrSlot.student)}
                variant="contained"
                color="info"
                sx={{ mt: 2, ml: 2 }}
              >
                {loading ? <CircularProgress /> : `Assign`}
              </Button>
            </Box>
        </Grid>


      </Grid>
    </BasicModal>
  );
};

export default AssignStudentModal;
