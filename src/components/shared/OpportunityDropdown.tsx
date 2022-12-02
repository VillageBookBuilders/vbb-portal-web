import {
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  FormControl,
  Box,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';
import { getOpportunity } from '../../redux/actions';
import { Opportunity } from '../../redux/opportunity/opportunity.types';

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

const opportunityOptions = (opportunities: Opportunity[]) =>
  opportunities.map((opportunity) => (
    <MenuItem key={opportunity.id} value={opportunity.id}>
      <ListItemText primary={`${opportunity.name}`} />
    </MenuItem>
  ));
interface Props {
  selectedOpportunities: number[];
  handleSelectOpportunities: (opportunityIds: number[]) => void;
}
const OpportunityDropdown = ({
  selectedOpportunities,
  handleSelectOpportunities,
}: Props) => {
  const opportunities = useSelector((state: AppState) => state.opportunity);
  const dispatch = useDispatch();

  const [actvieOppOptions, setActvieOppOptions] = useState<any>([]);

  useEffect(() => {
    dispatch(getOpportunity());
  }, [dispatch]);

  useEffect(() => {
    if (opportunities !== undefined && opportunities !== null) {
      var tempArr: any = [];
      opportunities.forEach((element) => {
        tempArr.push({ id: element.id, name: element.name, value: element.id });
      });
      setActvieOppOptions(tempArr);
    }
  }, [opportunities]);

  const handleSelect = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value;
    if (Array.isArray(value)) {
      handleSelectOpportunities(value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-chip-label">Please Select</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={selectedOpportunities}
        onChange={handleSelect}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {actvieOppOptions.length > 0 && selected.map((id) => (
              <Chip
                key={id}
                label={actvieOppOptions?.find((e: any) => e.id === id).name}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {opportunityOptions(actvieOppOptions)}
      </Select>
    </FormControl>
  );
};

export default OpportunityDropdown;
