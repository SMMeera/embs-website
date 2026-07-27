import { apiGet } from './api.js';

export async function getAllEvents() {
  const res = await apiGet('/events');
  return res.data || res;
}

export async function getUpcomingEvents() {
  const all = await getAllEvents();
  const now = new Date().toISOString().split('T')[0];
  return all.filter(e => (e.date || '') >= now).sort((a, b) => a.date > b.date ? 1 : -1);
}

export async function getPastEvents() {
  const all = await getAllEvents();
  const now = new Date().toISOString().split('T')[0];
  return all.filter(e => (e.date || '') < now).sort((a, b) => a.date < b.date ? 1 : -1);
}

export async function getFeaturedEvents() {
  const all = await getAllEvents();
  const now = new Date().toISOString().split('T')[0];
  const upcoming = all.filter(e => e.featured && (e.date || '') >= now).sort((a, b) => a.date > b.date ? 1 : -1);
  const past     = all.filter(e => e.featured && (e.date || '') <  now).sort((a, b) => a.date < b.date ? 1 : -1);
  return [...upcoming, ...past].slice(0, 3);
}
