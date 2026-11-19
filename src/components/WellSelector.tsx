import { useEffect, useState } from 'react';
import { ListSubheader, MenuItem, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { wellSelected } from '../store/wellsSlice';

export default function WellSelector() {
  const dispatch = useDispatch();
  const wells = useSelector((state: any) => state.wells.list);
  const selectedId = useSelector((state: any) => state.wells.selectedId);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(wells);

  useEffect(() => {
    setFiltered(wells.filter((w: any) => w.name.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  return (
    <TextField
      select
      size="small"
      label="Well"
      value={selectedId ?? ''}
      onChange={(e) => dispatch(wellSelected(Number(e.target.value)))}
      sx={{ minWidth: 260 }}
    >
      <ListSubheader>
        <TextField
          size="small"
          placeholder="Search wells…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          fullWidth
        />
      </ListSubheader>
      {filtered.map((well: any) => (
        <MenuItem key={well.id} value={well.id}>
          {well.name} — {well.rig}
        </MenuItem>
      ))}
    </TextField>
  );
}
