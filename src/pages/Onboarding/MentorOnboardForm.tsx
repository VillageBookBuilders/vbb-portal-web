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
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ListItemText,
  OutlinedInput
} from '@mui/material';

import OpportunityDropdown from '../../components/shared/OpportunityDropdown';
import LanguageDropdown from '../../components/shared/LanguageDropdown';
import CareerDropdown from '../../components/shared/CareerDropdown';
import SubjectDropdown from '../../components/shared/SubjectDropdown';
import TimezonesDropdown from '../../components/shared/TimezoneSelect';

import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer';
import { PageLayout, MainCardLayout } from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions';
import { BasicModal } from '../../components/Modals';
import { OnboardProps } from '.';
import moment from 'moment-timezone';

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

const defaultForm = {
  careers: [] as number[],
  subjects: [] as number[],
  mentoringLanguages: [] as number[],
  // should be a list from all subjects in the backend
  gender: '',
  applicationVideoUrl: '',
  meetProvider: '',
  corporateCode: '',
  timezone: '',
  opportunities: [] as number[],
  canMeetConsistently: false,
  crimesOrMisdemeanor: false,
  crimesOrMisdemeanorResponses: '',
  agreedToTerms: false,
};

const MentorOnboardForm = ({ handleSubmit }: OnboardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appState = useSelector((store: AppState) => store.appState);
  const user = useSelector((store: AppState) => store.user);
  const taskState = useSelector((state: AppState) => state.addTaskNo);
  const checkState = useSelector((state: AppState) => state.onboardingSteps);

  const [isCorporate, setIsCorporate] = React.useState(false);

  const incTaskNo = (indexOfOnboardingStep: number) => {
    if (taskState < 6 && !checkState[indexOfOnboardingStep]) {
      dispatch(actions.addTask());
      dispatch(actions.updateOnboardingStep(indexOfOnboardingStep));
    }
  };

  const [formValue, setFormValue] = React.useState(defaultForm);
  const [open, setOpen] = React.useState(false);
  const userTimzezone = moment.tz.guess();

  const handleSetTimezone = (timezone: string) => {
    setFormValue({ ...formValue, timezone: timezone });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    //navigate('/mentor/onboarding');
  };

  React.useEffect(() => {
    if (user.mentorProfile && user.mentorProfile?.organization) {
      setIsCorporate(true);
    }
  }, []);

  return (
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
            Please upload a 2-3 mins video teaching or describing your mentoring
            experience:
          </Typography>
          <Typography variant="body1" mt={2}>
            <i>
              Need a place to upload? Use any of the links below to upload a
              video and copy and paste the link.
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
            onChange={(e) =>
              setFormValue({
                ...formValue,
                applicationVideoUrl: e.target.value,
              })
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

        <Grid item xs={12} sm={6} sx={{ mt: 0 }}>
          <Typography variant="h6">Careers areas I’m interested in</Typography>
          <CareerDropdown
            selectedCareers={formValue.careers}
            isRequired={true}
            handleSelectCareers={(careerIds) =>
              setFormValue({ ...formValue, careers: careerIds })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
          <Typography variant="h6">Subjects I’m interested in</Typography>
          <SubjectDropdown
            selectedSubjects={formValue.subjects}
            isRequired={true}
            handleSelectSubjects={(subjectIds) =>
              setFormValue({ ...formValue, subjects: subjectIds })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
          <Typography variant="h6">What languages do you speak?</Typography>
          <LanguageDropdown
            selectedLanguages={formValue.mentoringLanguages}
            isRequired={true}
            handleSelectLanguages={(languageIds) =>
              setFormValue({ ...formValue, mentoringLanguages: languageIds })
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
              setFormValue({ ...formValue, opportunities: opportunityIds })
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
              Please indicate whether you would like to mentor via Microsoft
              Teams or Google Meets
            </Typography>
            <FormGroup></FormGroup>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="GoogleMeet"
              name="radio-buttons-group"
              onChange={(e) =>
                setFormValue({ ...formValue, meetProvider: e.target.value })
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
              Once you book a mentoring session, will you be able to meet with
              your student consistently every week for at least 6 months?
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value={formValue.canMeetConsistently}
                control={
                  <Checkbox
                    required
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        canMeetConsistently: !formValue.canMeetConsistently,
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
                value={formValue.crimesOrMisdemeanor}
                control={
                  <Checkbox
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        crimesOrMisdemeanor: !formValue.crimesOrMisdemeanor,
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

        <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value={formValue.agreedToTerms}
                control={
                  <Checkbox
                    required
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        agreedToTerms: !formValue.agreedToTerms,
                      })
                    }
                  />
                }
                label="I agree to the Village Book Terms and Conditions and its Privacy Policy."
              />
              <a href="https://villagebookbuilders.org/privacy-policy">Privacy Policy</a>
              <a href="https://villagebookbuilders.org/">Terms and Services</a>
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 5, mb: 3 }}>
          <Button variant="contained" sx={{ ml: 2 }} type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default MentorOnboardForm;
