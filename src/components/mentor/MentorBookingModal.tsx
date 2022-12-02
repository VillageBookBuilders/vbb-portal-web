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
} from '@mui/material';
import { SlotInfo } from 'react-big-calendar';
import Modal from '../shared/Modal';
import { CalendarEvent, isCalendarEvent } from '../../utils/CalendarEvent';
import {
  AccessTime,
  Notes,
  Person,
  PhotoCameraFront,
} from '@mui/icons-material';
import { SlotSessions } from '../../utils/Session';
import { useState } from 'react';

interface EventModalProps {
  eventOrSlot: CalendarEvent | SlotInfo | null | SlotSessions;
  selectedConferenceType:string;
  set_selectedConferenceType:(value: string) => void;
  selectedOpenReservationNotes:string;
  set_selectedOpenReservationNotes:(value: string) => void;
  onClose: () => void;
}

const fakeStudents = ['Student 1', 'Student 2', 'Student 3'];

const MentorBookingModal = ({ eventOrSlot, onClose, selectedConferenceType, set_selectedConferenceType, selectedOpenReservationNotes, set_selectedOpenReservationNotes }: EventModalProps) => {
  const isEvent = isCalendarEvent(eventOrSlot);
  const [disable, setDisable] = useState<boolean>(true);

  return (
    <>
      <Grid container spacing={2} py={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="From"
            placeholder={isEvent ? eventOrSlot.start.toString() : ''}
            value={isEvent ? eventOrSlot.start.toString() : ''}
            InputProps={{ startAdornment: <AccessTime /> }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="To"
            placeholder={isEvent ? eventOrSlot.end.toString() : ''}
            value={isEvent ? eventOrSlot.end.toString() : ''}
            InputProps={{ startAdornment: <AccessTime /> }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Declaration</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            I commit to this reservation and mentoring this individual to the
            best of my ability.
          </Typography>
        </Grid>

        <Grid item xs={12} display="flex">
          <Box display="flex" justifyContent="flex-start" width="100%">
            <FormControlLabel
              control={<Checkbox />}
              label="I Agree"
              sx={{ align: 'center' }}
              value={disable}
              onChange={() => setDisable(!disable)}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Select Your Conference Type</Typography>
        </Grid>

        <Grid item xs={12} display="flex" alignItems="center">
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Notes"
            placeholder="Notes"
            value={selectedOpenReservationNotes}
            onChange={(e:any) =>
              set_selectedOpenReservationNotes(e.target.value)
            }
            InputProps={{ startAdornment: <Notes /> }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default MentorBookingModal;
