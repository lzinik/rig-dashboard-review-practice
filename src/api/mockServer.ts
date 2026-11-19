/**
 * Mock backend for the sandbox. Simulates the platform REST API.
 * NOT PART OF THE PR UNDER REVIEW.
 */
import type { Note, Well } from '../types';

const now = () => Math.floor(Date.now() / 1000);

const WELLS: Well[] = [
  { id: 101, name: 'Permian 14-2H', rig: 'H&P 512', status: 'drilling', timezone: 'America/Chicago' },
  { id: 102, name: 'Eagle Ford 7-1H', rig: 'Patterson 291', status: 'drilling', timezone: 'America/Chicago' },
  { id: 103, name: 'Bakken 22-4H', rig: 'Nabors X31', status: 'tripping', timezone: 'America/Denver' },
  { id: 104, name: 'Vaca Muerta LCav-18', rig: 'DLS 4168', status: 'drilling', timezone: 'America/Argentina/Buenos_Aires' },
  { id: 105, name: 'Marcellus 3-9H', rig: 'Precision 607', status: 'idle', timezone: 'America/New_York' },
];

const NOTES: Note[] = [
  {
    id: 'n1',
    wellId: 101,
    createdAt: now() - 3600 * 5,
    author: { name: 'J. Ramirez' },
    body: 'Started curve section at 9,850 ft. Holding 45 klbf WOB.',
  },
  {
    id: 'n2',
    wellId: 101,
    createdAt: now() - 3600 * 3,
    author: null,
    body: 'Mud motor spec sheet: https://docs.example.test/motors/7-8-lobe.pdf',
  },
  {
    id: 'n3',
    wellId: 101,
    createdAt: now() - 3600,
    author: { name: 'K. Okafor' },
    body: 'Connection times creeping up, avg 6 min. Talk to crew at tour change.',
  },
  {
    id: 'n4',
    wellId: 102,
    createdAt: now() - 7200,
    author: { name: 'M. Chen' },
    body: 'SPP spike to 3,600 psi at 11,200 ft, back to normal after 2 min.',
  },
  {
    id: 'n5',
    wellId: 104,
    createdAt: now() - 1800,
    author: { name: 'L. Fernández' },
    body: 'Cambio de trépano programado para las 18:00.',
  },
];

function delay(min: number, max: number) {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function mockFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = new URL(input);
  await delay(150, 1200);

  if (url.pathname === '/v1/wells') {
    return json(WELLS);
  }

  const notesMatch = url.pathname.match(/^\/v1\/wells\/(\d+)\/notes$/);
  if (notesMatch) {
    const wellId = Number(notesMatch[1]);

    if (init?.method === 'POST') {
      if (Math.random() < 0.2) {
        return json({ error: 'Service unavailable' }, 503);
      }
      const payload = JSON.parse(String(init.body));
      const note: Note = {
        id: crypto.randomUUID(),
        wellId,
        createdAt: now(),
        author: { name: 'You' },
        body: payload.body,
      };
      NOTES.push(note);
      return json(note, 201);
    }

    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    return json(NOTES.filter((n) => n.wellId === wellId && n.body.toLowerCase().includes(q)));
  }

  return json({ error: 'Not found' }, 404);
}
