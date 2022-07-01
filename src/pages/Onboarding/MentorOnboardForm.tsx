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
  Checkbox
} from '@mui/material';

import OpportunityDropdown from '../../components/shared/OpportunityDropdown';
import LanguageDropdown from '../../components/shared/LanguageDropdown';
import CareerDropdown from '../../components/shared/CareerDropdown';
import SubjectDropdown from '../../components/shared/SubjectDropdown';
import TimezonesDropdown from '../../components/shared/TimezoneSelect';

import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../../redux/rootReducer'
import { PageLayout, MainCardLayout} from '../../components/layout/Page';
import scss_variables from '../../styles/_variables.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions';
import { BasicModal } from '../../components/Modals';
import { OnboardProps } from '.';


const defaultForm = {
  careers: [] as number[],
  subjects: [] as number[],
  mentoringLanguages: [] as number[],
  // should be a list from all subjects in the backend
  applicationVideoUrl: '',
  meetProvider: '',
  corporateCode: '',
  timezone: '',
  opportunities: [] as number[],
  canMeetConsistently: false,
  crimesOrMisdemanors: false,
  crimesOrMisdemanorsResponses: '',
  agreedToTerms: false
};

const MentorOnboardForm = ({handleSubmit}:OnboardProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const appState = useSelector((store: AppState) => store.appState);
    const user = useSelector((store: AppState) => store.user);
    const taskState = useSelector((state: AppState) => state.addTaskNo);
    const checkState = useSelector((state: AppState) => state.onboardingSteps);

    const incTaskNo = (indexOfOnboardingStep: number) => {
      if (taskState < 6 && !checkState[indexOfOnboardingStep]) {
        dispatch(actions.addTask());
        dispatch(actions.updateOnboardingStep(indexOfOnboardingStep));
      }
    };

    const [formValue, setFormValue] = React.useState(defaultForm);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      //navigate('/mentor/onboarding');
    };

    React.useEffect(() => {

    }, []);


    return(
      <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Video Upload</Typography>
          <Typography variant="body1">
            Please upload a 2-3 mins video teaching or describing your mentoring experience:
          </Typography>
          <Typography variant="body1" mt={2}>
            <i>Need a place to upload? Use any of the links below to upload a video and copy and paste the link.</i>
          </Typography>
          <Grid container spacing={3} sx={{mt:0}}>
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
          <TextField id="standard-basic"
            label="URL:"
            variant="standard"
            onChange={(e) =>
              setFormValue({ ...formValue, applicationVideoUrl: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6">
            Enter Your Corporate/Organization Code (if any)
          </Typography>
          <TextField id="standard-basic"
                     label="Corporate Code:"
                     variant="standard"
                     onChange={(e:any) =>
                       setFormValue({ ...formValue, corporateCode: e.target.value })
                     }/>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 0 }}>
          <Typography variant="h6">
            Careers areas I’m interested in Mentoring/Teaching
          </Typography>
          <CareerDropdown
            selectedCareers={formValue.careers}
            handleSelectCareers={(careerIds) =>
              setFormValue({ ...formValue, careers: careerIds })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
          <Typography variant="h6">
            Subjects I’m interested in mentoring/teaching:
          </Typography>
          <SubjectDropdown
            selectedSubjects={formValue.subjects}
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
          <TimezonesDropdown
            selectedTimezone={formValue.timezone}
            handleSelectTimezone={(timezone) =>
              setFormValue({ ...formValue, timezone: timezone })
            }
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
              <FormControlLabel
                value="Zoom"
                control={<Radio />}
                label="Zoom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
          <FormControl>
            <Typography variant="h6">
              Once you book a mentoring session, will you be able to meet with
              your student consistently every week for at least 3 months?
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value={formValue.crimesOrMisdemanors} control={<Checkbox onChange={(e)=> setFormValue({ ...formValue, canMeetConsistently: !formValue.canMeetConsistently })} />} label="Yes, I can meet consistently." />
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
              <FormControlLabel value={formValue.crimesOrMisdemanors} control={<Checkbox onChange={(e)=> setFormValue({ ...formValue, crimesOrMisdemanors: !formValue.crimesOrMisdemanors })} />} label="Yes, I have prior crimes & misdemeanors." />
            </RadioGroup>
            {formValue && formValue.crimesOrMisdemanors === true &&
              (<>
                <Typography variant="body1" mt={2}>
                  If YES, please list every record:
                </Typography>
                <TextField id="standard-basic"
                    variant="standard"
                    fullWidth
                    multiline
                    onChange={(e:any) =>
                      setFormValue({ ...formValue, crimesOrMisdemanorsResponses: e.target.value })
                    }
                    />
              </>)
            }

          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value={formValue.agreedToTerms} control={<Checkbox onChange={(e)=> setFormValue({ ...formValue, agreedToTerms: !formValue.agreedToTerms })} />} label="I agree to the Village Book Terms and Conditions and its Privacy Policy." />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 5, mb:3}}>
          <Button
            variant="contained"
            sx={{ml:2}}
            onClick={(e) => {
              handleSubmit(e, formValue)
              console.log(formValue)
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      </>
  );
}
export default MentorOnboardForm;
