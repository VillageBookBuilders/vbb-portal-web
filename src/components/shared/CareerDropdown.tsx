import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';
import * as actions from '../../redux/actions';
import { Career } from '../../redux/careers/careers.types';

const careerOptions = (careers: Career[]) =>
  careers.map((career) => (
    <MenuItem key={career.id} value={career.id}>
      <ListItemText primary={`${career.name}`} />
    </MenuItem>
  ));

interface Props {
  selectedCareers: number[];
  handleSelectCareers: (careerIds: number[]) => void;
  isRequired?: boolean;
}
const CareerDropdown = ({
  selectedCareers,
  handleSelectCareers,
  isRequired,
}: Props) => {
  const careers = useSelector((state: AppState) => state.careers);
  const dispatch = useDispatch();
  const [actvieCareerOptions, setActvieCareerOptions] = useState<any>([]);

  useEffect(() => {
    dispatch(actions.getCareers());
  }, [dispatch]);

  useEffect(() => {
    if (careers !== undefined && careers !== null) {
      var tempArr: any = [];
      careers.forEach((element) => {
        tempArr.push({ id: element.id, name: element.name, value: element.id });
      });
      setActvieCareerOptions(tempArr);
    }
  }, [careers]);

  const handleSelect = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value;
    if (Array.isArray(value)) {
      handleSelectCareers(value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="multi-career-select">Select Your Careers</InputLabel>
      <Select
        label="Select Your Careers"
        labelId="multi-career-select"
        id="select-careers-dropdown"
        multiple
        required={isRequired ? true : false}
        value={selectedCareers}
        onChange={handleSelect}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {actvieCareerOptions.length > 0 && selected.map((id) => (
              <Chip
                key={id}
                label={actvieCareerOptions?.find((e: any) => e.id === id).name}
              />
            ))}
          </Box>
        )}
      >
        {careerOptions(actvieCareerOptions)}
      </Select>
    </FormControl>
  );
};

export default CareerDropdown;
