import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { api } from '../api/client';
import { formatDate, minutesAgo } from '../utils/time';
import type { Note } from '../types';

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

const linkify = (text: string) => text.replace(URL_PATTERN, '<a href="$1" target="_blank">$1</a>');

type Props = {
  wellId: number;
};

export default function NotesPanel({ wellId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getNotes(wellId, search).then((data) => {
      setNotes(data);
      setLoading(false);
    });
  }, [wellId, search]);

  const handleSubmit = async (e: FormEvent) => {
    const body = draft.trim();
    if (!body) return;

    setDraft('');

    const optimistic: Note = {
      id: 'temp',
      wellId,
      createdAt: Date.now(),
      author: { name: 'You' },
      body,
    };
    setNotes([optimistic, ...notes]);

    try {
      const saved = await api.addNote(wellId, body);
      setNotes((prev) => prev.map((n) => (n.id === 'temp' ? saved : n)));
    } catch (err) {
      setError('Could not save the note. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
        <Typography variant="h6">Drilling notes</Typography>
        <TextField
          size="small"
          placeholder="Search notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading…
        </Typography>
      ) : (
        <List dense>
          {notes.map((note) => (
            <ListItem key={note.id} divider>
              <ListItemText
                primary={<span dangerouslySetInnerHTML={{ __html: linkify(note.body) }} />}
                secondary={`${note.author?.name ?? 'Unknown'} · ${formatDate(note.createdAt)} (${minutesAgo(
                  note.createdAt
                )} min ago)`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box component="form" onSubmit={handleSubmit} display="flex" gap={1} mt={2}>
        <TextField
          size="small"
          fullWidth
          placeholder="Add a note for the next tour"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>
    </Paper>
  );
}
