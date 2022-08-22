import { AxiosResponse } from 'axios';
import { takeLatest, put } from 'redux-saga/effects';
import {
  GET_LIBRARY,
  GET_LIBRARY_ANNOUNCEMENTS,
  GET_LIBRARY_COMPUTERS,
  GET_LIBRARY_MENTORS,
  SET_ACTIVE_LIBRARY_COMPUTER,
  CREATE_LIBRARY_COMPUTER,
  GetLibraryAction,
  GetLibraryAnnouncementsAction,
  GetLibraryComputersAction,
  GetLibraryStudentsAction,
  GetLibraryMentorsAction,
  CreateLibraryComputerAction,
  SET_LIBRARY,
  SET_LIBRARY_ANNOUNCEMENTS,
  SET_LIBRARY_COMPUTERS,
  SET_LIBRARY_STUDENTS,
  SET_LIBRARY_MENTORS,
  GET_LIBRARY_STUDENTS,
  SetLibraryAction,
  SetLibraryAnnouncementsAction,
  SetLibraryComputersAction,
  SetLibraryStudentsAction,
  SetLibraryMentorsAction,
  SetActiveLibraryComputerAction,
  Library,
} from './library.types';
import * as libraryTypes from './library.types';

import { vbbAPIV1 } from '../../services/api';
import { renderAPIMsg } from '../../utils/api';
import {
  apiRequest,
  apiSuccessful,
  apiFailed,
  setAppAlert,
} from '../app/app.actions';

export const setLibrary = (payload: Library): SetLibraryAction => ({
  type: SET_LIBRARY,
  payload,
});

// get languages from api
export const getLibrary = (uniqueID: string): GetLibraryAction => ({
  type: GET_LIBRARY,
  uniqueID,
});

export function* watchGetLibrary() {
  yield takeLatest(GET_LIBRARY, handleGetLibrary);
}
function* handleGetLibrary(action: GetLibraryAction) {
  try {
    const url = `library/${action.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status === 200) {
      yield put(setLibrary(res.data));
    } else {
      console.error('Error getting library');
    }
  } catch (e) {
    console.error('Failed to get libraries', { e });
  }
}

export const setLibraryAnnouncements = (
  payload: Library
): SetLibraryAnnouncementsAction => ({
  type: SET_LIBRARY_ANNOUNCEMENTS,
  payload,
});

// get languages from api
export const getLibraryAnnouncements = (
  uniqueID: string
): GetLibraryAnnouncementsAction => ({
  type: GET_LIBRARY_ANNOUNCEMENTS,
  uniqueID,
});

export function* watchGetAnnouncements() {
  yield takeLatest(GET_LIBRARY_ANNOUNCEMENTS, handleGetAnnouncements);
}
function* handleGetAnnouncements(action: GetLibraryAnnouncementsAction) {
  try {
    const url = `library/announcements/${action.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status === 200) {
      yield put(setLibraryAnnouncements(res.data));
    } else {
      console.error('Error getting announcements');
    }
  } catch (e) {
    console.error('Failed to get announcements', { e });
  }
}

export const setActiveAnnouncement = (
  payload: any
): libraryTypes.SetActiveLibraryAnnouncementAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_ANNOUNCEMENT,
  payload,
});

//Create Computer
export const createAnnouncement = (
  payload: any
): libraryTypes.CreateLibraryAnnouncementAction => ({
  type: libraryTypes.CREATE_LIBRARY_ANNOUNCEMENT,
  payload,
});

export function* watchCreateAnnouncement() {
  yield takeLatest(
    libraryTypes.CREATE_LIBRARY_ANNOUNCEMENT,
    handleCreateAnnouncement
  );
}
function* handleCreateAnnouncement(
  action: libraryTypes.CreateLibraryAnnouncementAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `library/announcements/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(setActiveAnnouncement(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Announcement created successfully!`,
          alertSeverity: 'success',
        })
      );
    } else {
      console.error('Error creating library announcement');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not create announcement. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to create library announcement', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not create announcement...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

export const updateAnnouncement = (
  payload: any
): libraryTypes.UpdateLibraryAnnouncementAction => ({
  type: libraryTypes.UPDATE_LIBRARY_ANNOUNCEMENT,
  payload,
});

export function* watchUpdateAnnouncement() {
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_ANNOUNCEMENT,
    handleUpdateAnnouncement
  );
}
function* handleUpdateAnnouncement(
  action: libraryTypes.UpdateLibraryAnnouncementAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `library/announcements/${action.payload.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.patch<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(setActiveAnnouncement(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Announcement updated successfully!`,
          alertSeverity: 'success',
        })
      );
    } else {
      console.error('Error creating library announcement');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not updated announcement. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to updated library announcement', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not updated announcement...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

export const deleteAnnouncement = (
  payload: any
): libraryTypes.DeleteLibraryAnnouncementAction => ({
  type: libraryTypes.DELETE_LIBRARY_ANNOUNCEMENT,
  payload,
});

export function* watchDeleteAnnouncement() {
  yield takeLatest(
    libraryTypes.DELETE_LIBRARY_ANNOUNCEMENT,
    handleDeleteAnnouncement
  );
}
function* handleDeleteAnnouncement(
  action: libraryTypes.DeleteLibraryAnnouncementAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `library/announcements/${action.payload.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(setActiveAnnouncement(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Announcement deleted successfully!`,
          alertSeverity: 'success',
        })
      );
    } else {
      console.error('Error deleting library announcement');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not delete announcement. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to delete library announcement', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete announcement...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

/**
 * Library Computers
 **/

export const setLibraryComputers = (
  payload: Library
): SetLibraryComputersAction => ({
  type: SET_LIBRARY_COMPUTERS,
  payload,
});

// get languages from api
export const getLibraryComputers = (
  uniqueID: string
): GetLibraryComputersAction => ({
  type: GET_LIBRARY_COMPUTERS,
  uniqueID,
});

export function* watchGetLibraryComputers() {
  yield takeLatest(GET_LIBRARY_COMPUTERS, handleGetLibraryComputers);
}
function* handleGetLibraryComputers(action: GetLibraryComputersAction) {
  try {
    const url = `library/all-computers/${action.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(setLibraryComputers(res.data));
    } else {
      console.error('Error getting library computers');
    }
  } catch (e) {
    console.error('Failed to get library computers', { e });
  }
}

export const setActiveLibraryComputer = (
  payload: any
): SetActiveLibraryComputerAction => ({
  type: SET_ACTIVE_LIBRARY_COMPUTER,
  payload,
});

//Create Computer
export const createLibraryComputer = (
  payload: any
): CreateLibraryComputerAction => ({
  type: CREATE_LIBRARY_COMPUTER,
  payload,
});

export const updateLibraryComputer = (
  payload: any,
  uniqueID: string
): libraryTypes.UpdateLibraryComputerAction => ({
  type: libraryTypes.UPDATE_LIBRARY_COMPUTER,
  uniqueID,
  payload,
});

export const deleteLibraryComputer = (
  uniqueID: any
): libraryTypes.DeleteLibraryComputerAction => ({
  type: libraryTypes.DELETE_LIBRARY_COMPUTER,
  uniqueID,
});

export function* watchCreateLibraryComputers() {
  yield takeLatest(
    libraryTypes.CREATE_LIBRARY_COMPUTER,
    handleCreateLibraryComputers
  );
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_COMPUTER,
    handleUpdateLibraryComputer
  );
  yield takeLatest(
    libraryTypes.DELETE_LIBRARY_COMPUTER,
    handleDeleteLibraryComputer
  );
}

function* handleCreateLibraryComputers(action: CreateLibraryComputerAction) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `library/computers/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(setActiveLibraryComputer(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer created successfully!`,
          alertSeverity: 'success',
        })
      );
    } else {
      console.error('Error create library computers');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not create computer. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to create library computers', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not create computer...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleUpdateLibraryComputer(
  action: libraryTypes.UpdateLibraryComputerAction
) {
  try {
    const data = action.payload;
    const uniqueID = action.uniqueID;
    yield put(apiRequest(data));
    const url = `library/computers/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.patch<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer updated successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryComputer(res.data));
    } else {
      console.error('Error updating library computer');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could update library computer. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create library computer.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could update library computer....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteLibraryComputer(
  action: libraryTypes.DeleteLibraryComputerAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(uniqueID));
    const url = `library/computers/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer deleted successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryComputer(res.data));
    } else {
      console.error('Error deleted library computer');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not deleted library computer. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could not delete library computer.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete library computer....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

/**
 * Library Students
 **/

export const setLibraryStudents = (
  payload: Library
): SetLibraryStudentsAction => ({
  type: SET_LIBRARY_STUDENTS,
  payload,
});

// get languages from api
export const getLibraryStudents = (
  uniqueID: string
): GetLibraryStudentsAction => ({
  type: GET_LIBRARY_STUDENTS,
  uniqueID,
});

export function* watchGetLibraryStudents() {
  yield takeLatest(GET_LIBRARY_STUDENTS, handleGetLibraryStudents);
}
function* handleGetLibraryStudents(action: GetLibraryStudentsAction) {
  try {
    const url = `library/all-students/${action.uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(setLibraryStudents(res.data));
    } else {
      console.error('Error getting library students');
    }
  } catch (e) {
    console.error('Failed to get library students', { e });
  }
}

export const setLibraryMentors = (
  payload: Library
): SetLibraryMentorsAction => ({
  type: SET_LIBRARY_MENTORS,
  payload,
});

// get languages from api
export const getLibraryMentors = (
  uniqueID: string
): GetLibraryMentorsAction => ({
  type: GET_LIBRARY_MENTORS,
  uniqueID,
});

export function* watchGetLibraryMentors() {
  yield takeLatest(GET_LIBRARY_MENTORS, handleGetLibraryMentors);
}
function* handleGetLibraryMentors(action: GetLibraryMentorsAction) {
  try {
    const url = `library/all-mentors/${action.uniqueID}`;
    yield put(apiRequest(action.uniqueID));
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(setLibraryMentors(res.data));
    } else {
      console.error('Error getting library mentors');
      yield put(apiFailed(res.data));
    }
  } catch (e:any) {
    yield put(apiFailed(e.response.data));
    console.error('Failed to get library mentors', { e });
  }
}

/**
 * Library STUDENTS
 **/
export const updateStudentStatus = (
  payload: any
): libraryTypes.ChangeStudentStatusAction => ({
  type: libraryTypes.UPDATE_LIBRARY_STUDENT_STATUS,
  payload,
});

export const deleteLibraryStudent = (
  id: number
): libraryTypes.DeleteStudentAction => ({
  type: libraryTypes.DELETE_LIBRARY_STUDENT,
  id,
});

export const deleteLibraryMentor = (
  id: number
): libraryTypes.DeleteMentorAction => ({
  type: libraryTypes.DELETE_LIBRARY_MENTOR,
  id,
});

export function* watchChangeStudentStatus() {
  yield takeLatest(libraryTypes.DELETE_LIBRARY_STUDENT, handleDeleteStudent);
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_STUDENT_STATUS,
    handleChangeStudentStatus
  );
}

function* handleChangeStudentStatus(
  action: libraryTypes.ChangeStudentStatusAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `students/status-update/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Status changed successfully!`,
          alertSeverity: 'success',
        })
      );

      //yield put(setLibraryComputers(res.data));
    } else {
      console.error('Error change student status');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change student status. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to create library computers', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not change student status...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteStudent(action: libraryTypes.DeleteStudentAction) {
  try {
    const id = action.id;
    yield put(apiRequest(id));
    const url = `library/students/${id}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Student deleted successfully!`,
          alertSeverity: 'success',
        })
      );

      //yield put(setLibraryComputers(res.data));
    } else {
      console.error('Error deleting student');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not delete student. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to delete student', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete student...${renderAPIMsg(e.response.data)}`,
        alertSeverity: 'error',
      })
    );
  }
}

//Create Computer
export const updateMentorStatus = (
  payload: any
): libraryTypes.ChangeMentorStatusAction => ({
  type: libraryTypes.UPDATE_LIBRARY_MENTOR_STATUS,
  payload,
});

export function* watchChangeMentorStatus() {
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_MENTOR_STATUS,
    handleChangeMentorStatus
  );
  yield takeLatest(libraryTypes.DELETE_LIBRARY_MENTOR, handleDeleteMentor);
}

function* handleChangeMentorStatus(
  action: libraryTypes.ChangeMentorStatusAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(action.payload));
    const url = `mentors/status-update/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Status changed successfully!`,
          alertSeverity: 'success',
        })
      );

      //yield put(setLibraryComputers(res.data));
    } else {
      console.error('Error change mentor status');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change student status. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to change mentor status', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not change student status...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteMentor(action: libraryTypes.DeleteMentorAction) {
  try {
    const id = action.id;
    yield put(apiRequest(id));
    const url = `library/mentors/${id}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Mentor deleted successfully!`,
          alertSeverity: 'success',
        })
      );

      //yield put(setLibraryComputers(res.data));
    } else {
      console.error('Error deleting mentor');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not delete mentor. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Failed to delete mentor', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete mentor...${renderAPIMsg(e.response.data)}`,
        alertSeverity: 'error',
      })
    );
  }
}

/**
 * Library User Preference SLots
 **/

export const setLibraryUserSlots = (
  payload: Library
): libraryTypes.SetLibraryUserPreferenceSlotsAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_USER_PREFERENCE_SLOTS,
  payload,
});

export const setActiveLibraryUserSlot = (
  payload: Library
): libraryTypes.SetActiveLibraryUserPreferenceSlotAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_USER_PREFERENCE_SLOT,
  payload,
});

// get languages from api
export const getLibraryUserSlots = (
  uniqueID: string
): libraryTypes.GetLibraryUserPreferenceSlotsAction => ({
  type: libraryTypes.GET_LIBRARY_USER_PREFERENCE_SLOTS,
  uniqueID,
});

export const createLibraryUserSlot = (
  payload: any
): libraryTypes.CreateLibraryUserPreferenceSlotAction => ({
  type: libraryTypes.CREATE_LIBRARY_USER_PREFERENCE_SLOT,
  payload,
});

export const updateLibraryUserSlot = (
  payload: any,
  uniqueID: string
): libraryTypes.UpdateLibraryUserPreferenceSlotAction => ({
  type: libraryTypes.UPDATE_LIBRARY_USER_PREFERENCE_SLOT,
  uniqueID,
  payload,
});

export const deleteLibraryUserSlot = (
  uniqueID: any
): libraryTypes.DeleteLibraryUserPreferenceSlotAction => ({
  type: libraryTypes.DELETE_LIBRARY_USER_PREFERENCE_SLOT,
  uniqueID,
});

export function* watchLibraryUserPreferenceSlots() {
  yield takeLatest(
    libraryTypes.GET_LIBRARY_USER_PREFERENCE_SLOTS,
    handleGetLibraryUserPreferenceSlots
  );
  yield takeLatest(
    libraryTypes.CREATE_LIBRARY_USER_PREFERENCE_SLOT,
    handleCreateLibraryUserPreferenceSlot
  );
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_USER_PREFERENCE_SLOT,
    handleUpdateLibraryUserPreferenceSlot
  );
  yield takeLatest(
    libraryTypes.DELETE_LIBRARY_USER_PREFERENCE_SLOT,
    handleDeleteLibraryUserPreferenceSlot
  );
}

function* handleGetLibraryUserPreferenceSlots(
  action: libraryTypes.GetLibraryUserPreferenceSlotsAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `library/student-slots/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      //yield put(setAppAlert({alertMsg:`Retrieved successfully!`, alertSeverity:'success'}));
      yield put(setLibraryUserSlots(res.data));
    } else {
      console.error('Error retrieve user preference slots');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not get user preference slots. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error retrieve user preference slots', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not retrieve user preference slots...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleCreateLibraryUserPreferenceSlot(
  action: libraryTypes.CreateLibraryUserPreferenceSlotAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(data));
    const url = `library/student-slots/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `User preference slot created successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryUserSlot(res.data));
    } else {
      console.error('Error creating user preference slot.');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could create user preference slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create user preference slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could create user preference slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleUpdateLibraryUserPreferenceSlot(
  action: libraryTypes.UpdateLibraryUserPreferenceSlotAction
) {
  try {
    const data = action.payload;
    const uniqueID = action.uniqueID;
    yield put(apiRequest(data));
    const url = `user-preference-slots/detail/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.patch<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `User preference slot updated successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryUserSlot(res.data));
    } else {
      console.error('Error updating user preference slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could update user preference slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could update user preference slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could update user preference slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteLibraryUserPreferenceSlot(
  action: libraryTypes.DeleteLibraryUserPreferenceSlotAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `user-preference-slots/detail/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `User Preference Slot deleted successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryUserSlot(res.data));
    } else {
      console.error('Error deleting user preference slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change user preference slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error deleting user preference slot', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete user preference slot...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

/**
 * Library Reservations Slots
 **/

export const setLibraryComputerReservationSlots = (
  payload: Library
): libraryTypes.SetLibraryComputerReservationsAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_COMPUTER_RESERVATION_SLOTS,
  payload,
});

export const setActiveLibraryComputerReservationSlot = (
  payload: Library
): libraryTypes.SetActiveLibraryComputerReservationAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_COMPUTER_RESERVATION,
  payload,
});

export const getLibraryComputerReservations = (
  uniqueID: string
): libraryTypes.GetLibraryComputerReservationsAction => ({
  type: libraryTypes.GET_LIBRARY_COMPUTER_RESERVATIONS,
  uniqueID,
});

export const createLibraryComputerReservation = (
  payload: any
): libraryTypes.CreateLibraryComputerReservationAction => ({
  type: libraryTypes.CREATE_LIBRARY_COMPUTER_RESERVATION,
  payload,
});

export const updateLibraryComputerReservation = (
  payload: any,
  uniqueID: string
): libraryTypes.UpdateLibraryComputerReservationAction => ({
  type: libraryTypes.UPDATE_LIBRARY_COMPUTER_RESERVATION,
  uniqueID,
  payload,
});

export const deleteLibraryComputerReservation = (
  uniqueID: any
): libraryTypes.DeleteLibraryComputerReservationAction => ({
  type: libraryTypes.DELETE_LIBRARY_COMPUTER_RESERVATION,
  uniqueID,
});

export function* watchLibraryComputerReservations() {
  yield takeLatest(
    libraryTypes.GET_LIBRARY_COMPUTER_RESERVATIONS,
    handleGetLibraryComputerReservations
  );
  yield takeLatest(
    libraryTypes.CREATE_LIBRARY_COMPUTER_RESERVATION,
    handleCreateLibraryComputerReservations
  );
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_COMPUTER_RESERVATION,
    handleUpdateLibraryComputerReservations
  );
  yield takeLatest(
    libraryTypes.DELETE_LIBRARY_COMPUTER_RESERVATION,
    handleDeleteLibraryComputerReservation
  );
}

function* handleGetLibraryComputerReservations(
  action: libraryTypes.GetLibraryComputerReservationsAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `library/all-computer-reservations/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      //yield put(setAppAlert({alertMsg:`Retrieved successfully!`, alertSeverity:'success'}));
      yield put(setLibraryComputerReservationSlots(res.data));
    } else {
      console.error('Error retrieve library computer slots');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change student status. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error retrieve library computer slots', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not retrieve library computer slots...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleCreateLibraryComputerReservations(
  action: libraryTypes.CreateLibraryComputerReservationAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(data));
    const url = `library/computer-reservations/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer Reservation completed successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryComputerReservationSlot(res.data));
    } else {
      console.error('Error creating library computer slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could create library computer slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create library computer slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could create library computer slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleUpdateLibraryComputerReservations(
  action: libraryTypes.UpdateLibraryComputerReservationAction
) {
  try {
    const data = action.payload;
    const uniqueID = action.uniqueID;
    yield put(apiRequest(data));
    const url = `library/computer-reservations/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.patch<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer Reservation updated successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryComputerReservationSlot(res.data));
    } else {
      console.error('Error updating library computer slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could update library computer slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create library computer slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could update library computer slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteLibraryComputerReservation(
  action: libraryTypes.DeleteLibraryComputerReservationAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `library/computer-reservations/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Computer Reservation Slot deleted successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryComputerReservationSlot(res.data));
    } else {
      console.error('Error deleting library computer slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change student status. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error deleting library computer slot', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete library computer slot...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

/**
 * Library Time Slots
 **/

export const setLibraryTimeSlots = (
  payload: any
): libraryTypes.SetLibraryTimeSlotsAction => ({
  type: libraryTypes.SET_LIBRARY_TIME_SLOTS,
  payload,
});

export const setActiveLibraryTimeSlot = (
  payload: any
): libraryTypes.SetActiveLibraryTimeSlotAction => ({
  type: libraryTypes.SET_ACTIVE_LIBRARY_TIME_SLOT,
  payload,
});

export const getLibraryTimeSlots = (
  uniqueID: string
): libraryTypes.GetLibraryTimeSlotsAction => ({
  type: libraryTypes.GET_LIBRARY_TIME_SLOTS,
  uniqueID,
});

export const createLibraryTimeSlot = (
  payload: any
): libraryTypes.CreateLibraryTimeSlotAction => ({
  type: libraryTypes.CREATE_LIBRARY_TIME_SLOT,
  payload,
});

export const updateLibraryTimeSlot = (
  payload: any,
  uniqueID: string
): libraryTypes.UpdateLibraryTimeSlotAction => ({
  type: libraryTypes.UPDATE_LIBRARY_TIME_SLOT,
  uniqueID,
  payload,
});

export const deleteLibraryTimeSlot = (
  uniqueID: any
): libraryTypes.DeleteLibraryTimeSlotAction => ({
  type: libraryTypes.DELETE_LIBRARY_TIME_SLOT,
  uniqueID,
});

export function* watchLibraryTimeSlots() {
  yield takeLatest(
    libraryTypes.GET_LIBRARY_TIME_SLOTS,
    handleGetLibraryTimeSlots
  );
  yield takeLatest(
    libraryTypes.CREATE_LIBRARY_TIME_SLOT,
    handleCreateLibraryTimeSlot
  );
  yield takeLatest(
    libraryTypes.UPDATE_LIBRARY_TIME_SLOT,
    handleUpdateLibraryTimeSlot
  );
  yield takeLatest(
    libraryTypes.DELETE_LIBRARY_TIME_SLOT,
    handleDeleteLibraryTimeSlot
  );
}

function* handleGetLibraryTimeSlots(
  action: libraryTypes.GetLibraryTimeSlotsAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `library/slots/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.get<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      //yield put(setAppAlert({alertMsg:`Retrieved successfully!`, alertSeverity:'success'}));
      yield put(setLibraryComputerReservationSlots(res.data));
    } else {
      console.error('Error retrieve library computer slots');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not change student status. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error retrieve library computer slots', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not retrieve library computer slots...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleCreateLibraryTimeSlot(
  action: libraryTypes.CreateLibraryTimeSlotAction
) {
  try {
    const data = action.payload;
    yield put(apiRequest(data));
    console.log(data)

    const url = `library-slots/`;
    const res: AxiosResponse<any> = yield vbbAPIV1.post<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Library Slot completed successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryTimeSlot(res.data));
    } else {
      console.error('Error creating library computer slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could create library computer slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create library computer slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could create library computer slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleUpdateLibraryTimeSlot(
  action: libraryTypes.UpdateLibraryTimeSlotAction
) {
  try {
    const data = action.payload;
    const uniqueID = action.uniqueID;
    yield put(apiRequest(data));
    const url = `library-slots/detail/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.patch<any>(url, data);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Library Slot updated successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryTimeSlot(res.data));
    } else {
      console.error('Error updating library computer slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could update library computer slot. ${renderAPIMsg(
            res.data
          )}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Could create library computer slot.', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could update library computer slot....${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}

function* handleDeleteLibraryTimeSlot(
  action: libraryTypes.DeleteLibraryTimeSlotAction
) {
  try {
    const uniqueID = action.uniqueID;
    yield put(apiRequest(action.uniqueID));
    const url = `library-slots/detail/${uniqueID}`;
    const res: AxiosResponse<any> = yield vbbAPIV1.delete<any>(url);
    if (res.status >= 200 && res.status < 300) {
      yield put(apiSuccessful(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Library Time Slot deleted successfully!`,
          alertSeverity: 'success',
        })
      );
      yield put(setActiveLibraryTimeSlot(res.data));
    } else {
      console.error('Error deleting library time slot');
      yield put(apiFailed(res.data));
      yield put(
        setAppAlert({
          alertMsg: `Could not delete time slot. ${renderAPIMsg(res.data)}`,
          alertSeverity: 'error',
        })
      );
    }
  } catch (e: any) {
    console.error('Error deleting library time slot', { e });
    yield put(apiFailed(e.response.data));
    yield put(
      setAppAlert({
        alertMsg: `Could not delete library time slot...${renderAPIMsg(
          e.response.data
        )}`,
        alertSeverity: 'error',
      })
    );
  }
}
