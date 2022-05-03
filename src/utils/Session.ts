import { DateTime } from 'luxon';

  export interface Session {
    id:string;
    start:Date;
    end:Date;
    libraryID:string;
    mentorID?:string;
    studentID?:string;
    meetingLink?: string;
  }

  export const Sessions: Session[] =[
    {
      id:'0',
      start: DateTime.local(2022, 4, 28, 8).toJSDate(),
      end: DateTime.local(2022, 7, 28, 8).toJSDate(),
      libraryID:'1',
      mentorID:'1',
      studentID: '0'
    },
    {
      id:'1',
      start: DateTime.local(2022, 4, 28, 8).toJSDate(),
      end: DateTime.local(2022, 7, 28, 8).toJSDate(),
      libraryID:'1',
      mentorID:'2',
      studentID: '4'
    },
    {
      id:'2',
      start: DateTime.local(2022, 4, 28, 8).toJSDate(),
      end: DateTime.local(2022, 7, 28, 8).toJSDate(),
      libraryID:'1',
      mentorID:'1',
      studentID: '5'
    },
  ]