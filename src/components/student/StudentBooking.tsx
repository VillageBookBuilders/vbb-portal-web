import { useState, ReactNode } from 'react';
import { Calendar, Views, luxonLocalizer, SlotInfo } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { Box } from '@mui/material';
import { Computer as ComputerIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { CalendarEvent, isCalendarEvent } from '../../utils/CalendarEvent';
import StudentBookingModal from './StudentBookingModal';

//TODO: 1. MOVE ALL SHARED INTERFACES, 2. Create Session Interface

export interface SlotSessions {
  id: string;
  start: Date;
  end: Date;
  availableSessions: CalendarEvent[];
}

////Dummy Data
const events: CalendarEvent[] = [
  {
    id: '0',
    color: '#9eded0',
    title: (
      <Box display="flex" alignItems="center">
        <ComputerIcon /> 2
      </Box>
    ),
    start: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
    end: DateTime.now()
      .set({ hour: 12, minute: 0 })
      .plus({ hour: 1 })
      .toJSDate(),
      computerID: '1'
  },
  {
    id: '1',
    color: '#d6e2f0',
    title: (
      <Box display="flex" alignItems="center">
        <ComputerIcon /> 1
      </Box>
    ),
    start: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
    end: DateTime.now()
      .set({ hour: 12, minute: 0 })
      .plus({ hour: 1 })
      .toJSDate(),
      computerID: '3'
  },
]

interface EventComponenetProps {
  event: CalendarEvent[]; 
  title?:string;
}


////Custom Components 
const customComponents = {
  event: (event:CalendarEvent) => {
    return (
      <Box display="flex" alignItems="center">
        <ComputerIcon sx={{m:'1px'}}/> <Typography variant="button" marginLeft='10px'>{event.id}</Typography>
      </Box>
    )
  }, 
}

////formats
const formats = {
  eventTimeRangeFormat: () => { 
    return '';
  },
};

const localizer = luxonLocalizer(DateTime);


const StudentBooking = () => {
  const [selSessions, setEvent] = useState<CalendarEvent | SlotInfo | null>(null);

  return (
    <Box p={2}>
      <Calendar<CalendarEvent>
        localizer={localizer}
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.DAY, Views.AGENDA]}
        events={events}
        eventPropGetter={(sessions, start, end, isSelected) => ({
          style: { backgroundColor: '#9eded0', color: 'black' },
        })}
        onSelectEvent={setEvent}
        onSelectSlot={setEvent}
        selectable
        startAccessor='start'
        endAccessor='end'
        style={{ height: 700 }}
        //components={customComponents}
        formats={formats}
      />
      <StudentBookingModal sessions={selSessions} onClose={() => setEvent(null)}/>
    </Box>
  );
};

export default StudentBooking;
