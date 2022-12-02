export const SUBMIT_STUDENT_REGISTRATION = 'SUBMIT_STUDENT_REGISTRATION';
export interface StudentRegistrationForm {
  libraryCode: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  username: string;
}
export interface SubmitStudentRegistrationAction {
  type: typeof SUBMIT_STUDENT_REGISTRATION;
  payload: StudentRegistrationForm;
}

export const COMPLETE_STUDENT_ONBOARD = 'COMPLETE_STUDENT_ONBOARD';
export const COMPLETE_STUDENT_ONBOARD_SUCCESS =
  'COMPLETE_STUDENT_ONBOARD_SUCCESS';
export const COMPLETE_STUDENT_ONBOARD_FAILED =
  'COMPLETE_STUDENT_ONBOARD_FAILED';

export interface StudentOnboardingForm {
  libraryCode: string;
  careers: number[];
  mentoringLanguages: number[];
  struggleSubjects: number[];
  favoriteSubjects: number[];
  favoriteGenres: number[];
  familyStatus: string;
  familySupportLevel: number;
  graduationObstacle: string;
  gradeLevel: number;
  yearOfBirth: string;
  gender: string;
  timezone: string;
}
export interface CompleteStudentOnboardAction {
  type: typeof COMPLETE_STUDENT_ONBOARD;
  payload: StudentOnboardingForm;
}

export const SUBMIT_MENTOR_SIGN_UP = 'SUBMIT_MENTOR_SIGN_UP';
export const SUBMIT_MENTOR_SIGN_UP_SUCCESS = 'SUBMIT_MENTOR_SIGN_UP_SUCCESS';
export const SUBMIT_MENTOR_SIGN_UP_FAILED = 'SUBMIT_MENTOR_SIGN_UP_FAILED';

export interface MentorSignUpForm {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  corporateCode: string;
}
export interface SubmitMentorSignUpAction {
  type: typeof SUBMIT_MENTOR_SIGN_UP;
  payload: MentorSignUpForm;
}
export interface SubmitMentorSignUpErrorResponse {
  message: string;
}

//Mentor Onboarding
export const COMPLETE_MENTOR_ONBOARD = 'COMPLETE_MENTOR_ONBOARD';
export const COMPLETE_MENTOR_ONBOARD_SUCCESS =
  'COMPLETE_MENTOR_ONBOARD_SUCCESS';
export const COMPLETE_MENTOR_ONBOARD_FAILED = 'COMPLETE_MENTOR_ONBOARD_FAILED';

export interface MentorOnboardingForm {
  careers: number[];
  mentoringLanguages: number[];
  subjects: number[];
  applicationVideoUrl: string;
  phoneNumber: string;
  secondaryEmail: string;
  gender:string;
  isOfAge: boolean;
  timezone: string;
  dateOfBirth: string;
  crimesOrMisdemeanorResponses: string;
  crimesOrMisdemeanor: boolean;
  canMeetConsistently: boolean;
  opportunities: any[];
  meetProvider: string;
  corporateCode: string;
}

export interface CompleteMentorOnboardAction {
  type: typeof COMPLETE_MENTOR_ONBOARD;
  payload: MentorOnboardingForm;
}

//Verify Email Actions
export const SUBMIT_EMAIL_VERIFY = 'SUBMIT_EMAIL_VERIFY';
export interface VerifyTokenForm {
  token: string;
}

export interface VerifyTokenAction {
  type: typeof SUBMIT_EMAIL_VERIFY;
  payload: VerifyTokenForm;
}

//
export const VERIFY_RESPONSE = 'VERIFY_RESPONSE';
export const VERIFY_RESPONSE_FAILED = 'VERIFY_RESPONSE_FAILED';

export interface VerifyResponseAction {
  type: typeof VERIFY_RESPONSE;
  payload: any;
}

export interface VerifyResponseFailedAction {
  type: typeof VERIFY_RESPONSE_FAILED;
  payload: any;
}

export type RegistrationActions =
  | VerifyResponseFailedAction
  | VerifyResponseAction
  | VerifyTokenAction
  | CompleteMentorOnboardAction
  | SubmitStudentRegistrationAction
  | SubmitMentorSignUpAction
  | CompleteStudentOnboardAction
  | CompleteMentorOnboardAction;
