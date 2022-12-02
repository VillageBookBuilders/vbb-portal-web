import * as React from 'react';
import {
  FormControlLabel,
  FormControl,
  FormGroup,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Radio,
  RadioGroup,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer';
import {
  PageLayout,
  MainCardLayoutWithSideMenu,
} from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import OpportunityDropdown from '../../components/shared/OpportunityDropdown';
import LanguageDropdown from '../../components/shared/LanguageDropdown';
import CareerDropdown from '../../components/shared/CareerDropdown';
import SubjectDropdown from '../../components/shared/SubjectDropdown';
import TimezonesDropdown from '../../components/shared/TimezoneSelect';
import * as actions from '../../redux/actions';
import moment from 'moment-timezone';
import { updateMentorProfile } from '../../redux/user/user.actions';
import { renderAPIMsg } from '../../utils/api';
import StudentProfile from './studentProfile';

const defaultForm = {
  careers: [] as number[],
  subjects: [] as number[],
  mentoringLanguages: [] as number[],
  applicationVideoUrl: '',
  meetProvider: '',
  corporateCode: '',
  timezone: '',
  opportunities: [] as number[],
  canMeetConsistently: false,
  crimesOrMisdemeanor: false,
  crimesOrMisdemeanorResponses: '',
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const loading = useSelector((store: AppState) => store.appState.loading);

  const [formValue, setFormValue] = React.useState(defaultForm);
  const [isCorporate, setIsCorporate] = React.useState(false);

  const userTimzezone = moment.tz.guess();

  React.useEffect(() => {
    if (user.mentorProfile !== undefined && user.mentorProfile !== null) {
      if (user.mentorProfile.organization) {
        setIsCorporate(true);
      }

      var selectedCareers = user.mentorProfile.careers.map((career: any) => {
        return career.id;
      });

      var selectedSubjects = user.mentorProfile.subjects.map((sub: any) => {
        return sub.id;
      });

      var selectedMentorLangugages = user.mentorProfile.mentoringLanguages.map(
        (ml: any) => {
          return ml.id;
        }
      );

      var selectedMentorOpps = user.mentorProfile.opportunities.map(
        (opp: any) => {
          return opp.id;
        }
      );

      const userFormData = {
        careers: selectedCareers,
        subjects: selectedSubjects,
        mentoringLanguages: selectedMentorLangugages,
        // should be a list from all subjects in the backend
        applicationVideoUrl: user.mentorProfile.applicationVideoUrl,
        meetProvider: user.mentorProfile.meetProvider,
        corporateCode: user.mentorProfile.organization ? (user.mentorProfile?.organization?.corporateCode) : '',
        timezone: user.timeZone,
        opportunities: selectedMentorOpps,
        canMeetConsistently: user.mentorProfile.canMeetConsistently || true,
        crimesOrMisdemeanor: user.mentorProfile.crimesOrMisdemeanor,
        crimesOrMisdemeanorResponses:
          user.mentorProfile.crimesOrMisdemeanorResponses || '',
      };

      console.log(userFormData);

      setFormValue(userFormData);
    }
  }, [user]);

  React.useEffect(() => {}, []);

  function handleSubmit(e: any, form: any) {
    console.log(form);
    dispatch(updateMentorProfile(form));
  }

  const handleSetTimezone = (timezone: string) => {
    setFormValue({ ...formValue, timezone: timezone });
  };

  return (<>
      {user !== undefined && user !== null && !loading
      ? (
        <>
        {user.role === 0 || user.role === 1
          ? <StudentProfile/>
          : (
            <PageLayout>
              <MainCardLayoutWithSideMenu>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8} lg={8}>
                    <div className="card-container">
                      <div className="card-header">
                        <Typography
                          variant="h6"
                          alignSelf="flex-start"
                          color={scss_variables.primary_color}
                        >
                          My Profile
                        </Typography>
                      </div>
                      <div className="card-body">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(e, formValue);
                          }}
                        >
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="h6">Video Upload</Typography>
                              <Typography variant="body1">
                                Please upload a 2-3 mins video teaching or describing
                                your mentoring experience:
                              </Typography>
                              <Typography variant="body1" mt={2}>
                                <i>
                                  Need a place to upload? Use any of the links below to
                                  upload a video and copy and paste the link.
                                </i>
                              </Typography>
                              <Grid container spacing={3} sx={{ mt: 0 }}>
                                <Grid item xs={'auto'}>
                                  <Button
                                    variant="outlined"
                                    target="_blank"
                                    component="a"
                                    href="https://studio.youtube.com/channel"
                                  >
                                    YouTube
                                  </Button>
                                </Grid>
                                <Grid item xs={'auto'}>
                                  <Button
                                    variant="outlined"
                                    target="_blank"
                                    component="a"
                                    href="https://drive.google.com/drive/my-drive"
                                  >
                                    Google Drive
                                  </Button>
                                </Grid>
                                <Grid item xs={'auto'}>
                                  <Button
                                    variant="outlined"
                                    target="_blank"
                                    component="a"
                                    href="https://www.dropbox.com/home"
                                  >
                                    Drop Box
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <TextField
                                id="standard-basic"
                                label="URL:"
                                variant="standard"
                                required={isCorporate ? false : true}
                                value={formValue.applicationVideoUrl}
                                onChange={(e) =>
                                  setFormValue({
                                    ...formValue,
                                    applicationVideoUrl: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mt: 0 }}>
                              <Typography variant="h6">
                                Careers areas I’m interested in
                              </Typography>
                              <CareerDropdown
                                selectedCareers={formValue.careers}
                                isRequired={true}
                                handleSelectCareers={(careerIds) =>
                                  setFormValue({ ...formValue, careers: careerIds })
                                }
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                              <Typography variant="h6">
                                Subjects I’m interested in
                              </Typography>
                              <SubjectDropdown
                                selectedSubjects={formValue.subjects}
                                isRequired={true}
                                handleSelectSubjects={(subjectIds) =>
                                  setFormValue({ ...formValue, subjects: subjectIds })
                                }
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                              <Typography variant="h6">
                                What languages do you speak?
                              </Typography>
                              <LanguageDropdown
                                selectedLanguages={formValue.mentoringLanguages}
                                isRequired={true}
                                handleSelectLanguages={(languageIds) =>
                                  setFormValue({
                                    ...formValue,
                                    mentoringLanguages: languageIds,
                                  })
                                }
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                              <Typography variant="h6">
                                How do you find out this opportunity?
                              </Typography>
                              <OpportunityDropdown
                                selectedOpportunities={formValue.opportunities}
                                handleSelectOpportunities={(opportunityIds) =>
                                  setFormValue({
                                    ...formValue,
                                    opportunities: opportunityIds,
                                  })
                                }
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                              <Typography variant="h6">My Timezone Is</Typography>
                              <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="body1">
                                  We've detected you are in: <b>{userTimzezone}</b>
                                </Typography>
                                <Button
                                  sx={{ ml: 2 }}
                                  onClick={() => handleSetTimezone(userTimzezone)}
                                >
                                  Use Timezone
                                </Button>
                              </Box>
                              <TimezonesDropdown
                                selectedTimezone={formValue.timezone}
                                handleSelectTimezone={(timezone) =>
                                  setFormValue({ ...formValue, timezone: timezone })
                                }
                                isRequired={true}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                              <FormControl>
                                <Typography variant="h6">
                                  Please indicate whether you would like to mentor via
                                  Microsoft Teams or Google Meets
                                </Typography>
                                <FormGroup></FormGroup>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  defaultValue="GoogleMeet"
                                  name="radio-buttons-group"
                                  onChange={(e) =>
                                    setFormValue({
                                      ...formValue,
                                      meetProvider: e.target.value,
                                    })
                                  }
                                >
                                  <FormControlLabel
                                    value="GoogleMeet"
                                    control={<Radio />}
                                    label="Google Meet"
                                  />
                                  <FormControlLabel
                                    value="MicrosoftTeams"
                                    control={<Radio />}
                                    label="Microsoft Teams"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
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
                                        required
                                        checked={formValue.canMeetConsistently}
                                        onChange={(e) =>
                                          setFormValue({
                                            ...formValue,
                                            canMeetConsistently:
                                              !formValue.canMeetConsistently,
                                          })
                                        }
                                      />
                                    }
                                    label="Yes, I can meet consistently."
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
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
                                        checked={formValue.crimesOrMisdemeanor}
                                        onChange={(e) =>
                                          setFormValue({
                                            ...formValue,
                                            crimesOrMisdemeanor:
                                              !formValue.crimesOrMisdemeanor,
                                          })
                                        }
                                      />
                                    }
                                    label="Yes, I have prior crimes & misdemeanors."
                                  />
                                </RadioGroup>
                                {formValue && formValue.crimesOrMisdemeanor === true && (
                                  <>
                                    <Typography variant="body1" mt={2}>
                                      If YES, please list every record:
                                    </Typography>
                                    <TextField
                                      id="standard-basic"
                                      variant="standard"
                                      fullWidth
                                      multiline
                                      onChange={(e: any) =>
                                        setFormValue({
                                          ...formValue,
                                          crimesOrMisdemeanorResponses: e.target.value,
                                        })
                                      }
                                    />
                                  </>
                                )}
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 5, mb: 3 }}>
                              {appState.loading ? (
                                <CircularProgress />
                              ) : (
                                <>
                                  {appState.error === null ? (
                                    <>
                                      <Button
                                        variant="contained"
                                        sx={{ ml: 2 }}
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Typography
                                        mt={1}
                                        mb={1}
                                        variant="body1"
                                        alignSelf="flex-start"
                                        color={scss_variables.primary_color}
                                      >
                                        <b>{renderAPIMsg(appState.error)}</b>
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        sx={{ ml: 2 }}
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </MainCardLayoutWithSideMenu>
            </PageLayout>
          )
        }
        </>
      )
      : <CircularProgress/>
      }

    </>
  );
};
export default Profile;
