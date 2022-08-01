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
  InputLabel,
  ListItemText,
  MenuItem,
  Chip,
  OutlinedInput,
  Select,
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
import GenreDropdown from '../../components/shared/GenreDropdown';
import * as actions from '../../redux/actions';
import moment from 'moment-timezone';
import { updateStudentProfile } from '../../redux/user/user.actions';
import { renderAPIMsg } from '../../utils/api';

const defaultForm = {
  careers: [] as number[],
  mentoringLanguages: [] as number[],
  struggleSubjects: [] as number[],
  favoriteSubjects: [] as number[],
  favoriteGenres: [] as number[],
  familyStatus: '',
  familySupportLevel: 0,
  graduationObstacle: '',
  gradeLevel: '',
  yearOfBirth: '',
  timezone: '',
  gender: '',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);

  const [formValue, setFormValue] = React.useState(defaultForm);

  const userTimzezone = moment.tz.guess();

  React.useEffect(() => {
    if (user.studentProfile !== undefined && user.studentProfile !== null) {

      var selectedCareers = user.studentProfile.careersOfInterest.map((career: any) => {
        return career.id;
      });

      var selectedSubjects = user.studentProfile.subjects.map((sub: any) => {
        return sub.id;
      });

      var selectedMentorLangugages = user.studentProfile.mentoringLanguages.map(
        (ml: any) => {
          return ml.id;
        }
      );

      // var selectedMentorOpps = user.studentProfile.opportunities.map(
      //   (opp: any) => {
      //     return opp.id;
      //   }
      // );

      const userFormData = {
        careers: selectedCareers,
        mentoringLanguages: selectedMentorLangugages,
        struggleSubjects: selectedSubjects,
        favoriteSubjects:selectedSubjects,
        favoriteGenres:selectedSubjects,
        // should be a list from all subjects in the backend
        familyStatus: user.studentProfile.familyStatus,
        familySupportLevel: user.studentProfile.familySupportLevel,
        graduationObstacle: user.studentProfile?.graduationObstacle,
        gradeLevel: user.studentProfile?.gradeLevel,
        timezone: user.timeZone,
        yearOfBirth: '',
        gender: ''
      };

      console.log(userFormData);

      setFormValue(userFormData);
    }
  }, [user]);

  React.useEffect(() => {}, []);

  function handleSubmit(e: any, form: any) {
    console.log(form);
    //dispatch(updatestudentProfile(form));
  }

  const handleSetTimezone = (timezone: string) => {
    //setFormValue({ ...formValue, timezone: timezone });
  };

  const renderGradeLevelOptions = () => {
    let renderList = [];
    for (let index = 1; index < 13; index++) {
      renderList.push(
        <MenuItem key={index} value={index}>
          <ListItemText primary={`${index}`} />
        </MenuItem>
      );
    }
    return renderList;
  };

  return (
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
                        <Typography variant="h6">What year were you born?</Typography>
                        <TextField
                          id="standard-basic"
                          label="Year of Birth:"
                          variant="standard"
                          required
                          onChange={(e: any) =>
                            setFormValue({ ...formValue, yearOfBirth: e.target.value })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">What gender are you?</Typography>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            required
                            value={formValue.gender}
                            onChange={(e: any) =>
                              setFormValue({ ...formValue, gender: e.target.value })
                            }
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={selected} />
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            <MenuItem key={0} value={'Male'}>
                              <ListItemText primary={`Male`} />
                            </MenuItem>
                            <MenuItem key={1} value={'Female'}>
                              <ListItemText primary={`Female`} />
                            </MenuItem>
                            <MenuItem key={2} value={'Other'}>
                              <ListItemText primary={`Other`} />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">Which grade are you in?</Typography>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            required
                            value={formValue.gradeLevel}
                            onChange={(e: any) =>
                              setFormValue({ ...formValue, gradeLevel: e.target.value })
                            }
                            input={<OutlinedInput id="select-single-chip" label="Chip" />}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={selected} />
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {renderGradeLevelOptions()}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 0 }}>
                        <Typography variant="h6">
                          Which careers/professional disciplines are you interested in?{' '}
                        </Typography>
                        <CareerDropdown
                          selectedCareers={formValue.careers}
                          handleSelectCareers={(careerIds) =>
                            setFormValue({ ...formValue, careers: careerIds })
                          }
                          isRequired={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          What is your family situation like?
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            required
                            value={formValue.familyStatus}
                            onChange={(e: any) =>
                              setFormValue({ ...formValue, familyStatus: e.target.value })
                            }
                            input={<OutlinedInput id="select-single-chip" label="Chip" />}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={selected} />
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            <MenuItem key={0} value={'Staying with both parents'}>
                              <ListItemText primary={`Staying with both parents`} />
                            </MenuItem>
                            <MenuItem key={1} value={'Single parent'}>
                              <ListItemText primary={`Single parent`} />
                            </MenuItem>
                            <MenuItem
                              key={2}
                              value={'Staying with an extended family member'}
                            >
                              <ListItemText
                                primary={`Staying with an extended family member`}
                              />
                            </MenuItem>
                            <MenuItem key={3} value={'Other'}>
                              <ListItemText primary={`Other`} />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          How supportive are your guardians of your schooling?
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            value={formValue.familySupportLevel}
                            required
                            onChange={(e: any) =>
                              setFormValue({
                                ...formValue,
                                familySupportLevel: e.target.value,
                              })
                            }
                            input={<OutlinedInput id="select-single-chip" label="Chip" />}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={selected} />
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            <MenuItem key={0} value={1}>
                              <ListItemText primary={`Very supportive`} />
                            </MenuItem>
                            <MenuItem key={1} value={2}>
                              <ListItemText primary={`Supportive`} />
                            </MenuItem>
                            <MenuItem key={2} value={3}>
                              <ListItemText primary={`Less supportive`} />
                            </MenuItem>
                            <MenuItem key={3} value={4}>
                              <ListItemText primary={`Not supportive at all`} />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          What obstacles would prevent you from graduating?
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            value={formValue.graduationObstacle}
                            required
                            onChange={(e: any) =>
                              setFormValue({
                                ...formValue,
                                graduationObstacle: e.target.value,
                              })
                            }
                            input={<OutlinedInput id="select-single-chip" label="Chip" />}
                            renderValue={(selected: any) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={selected} />
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            <MenuItem key={0} value={'None'}>
                              <ListItemText primary={`None`} />
                            </MenuItem>
                            <MenuItem key={1} value={'Financial'}>
                              <ListItemText primary={`Financial`} />
                            </MenuItem>
                            <MenuItem key={2} value={'Peer Influence'}>
                              <ListItemText primary={`Peer Influence`} />
                            </MenuItem>
                            <MenuItem key={3} value={'Health'}>
                              <ListItemText primary={`Health`} />
                            </MenuItem>
                            <MenuItem key={4} value={'Family'}>
                              <ListItemText primary={`Family`} />
                            </MenuItem>
                            <MenuItem key={5} value={'Required to work'}>
                              <ListItemText primary={`Required to work`} />
                            </MenuItem>
                            <MenuItem key={6} value={'Required to work'}>
                              <ListItemText primary={`Required to work`} />
                            </MenuItem>
                            <MenuItem key={7} value={'Parenting/Pregnant'}>
                              <ListItemText primary={`Parenting/Pregnant`} />
                            </MenuItem>
                            <MenuItem key={8} value={'Other'}>
                              <ListItemText primary={`Other`} />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          What subjects are your favorite in school?
                        </Typography>
                        <SubjectDropdown
                          selectedSubjects={formValue.favoriteSubjects}
                          handleSelectSubjects={(subjectIds) =>
                            setFormValue({ ...formValue, favoriteSubjects: subjectIds })
                          }
                          isRequired={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          Which subjects do you struggle with in school?
                        </Typography>
                        <SubjectDropdown
                          selectedSubjects={formValue.struggleSubjects}
                          handleSelectSubjects={(subjectIds) =>
                            setFormValue({ ...formValue, struggleSubjects: subjectIds })
                          }
                          isRequired={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">
                          What is your favorite types of book to read?
                        </Typography>
                        <GenreDropdown
                          selectedGenres={formValue.favoriteGenres}
                          handleSelectGenres={(genreIds) =>
                            setFormValue({ ...formValue, favoriteGenres: genreIds })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">Your native language(s)?</Typography>
                        <LanguageDropdown
                          selectedLanguages={formValue.mentoringLanguages}
                          handleSelectLanguages={(languageIds) =>
                            setFormValue({ ...formValue, mentoringLanguages: languageIds })
                          }
                          isRequired={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
                        <Typography variant="h6">My Timezone Is?</Typography>
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
  );
};
export default StudentProfile;
