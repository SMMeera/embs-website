import { apiGet } from './api.js';

async function _getAll() {
  const res = await apiGet('/podcasts');
  const episodes = res.data || res;
  return episodes.sort((a, b) => (b.episodeNumber || 0) - (a.episodeNumber || 0));
}

export async function getAllEpisodes() {
  return _getAll();
}

export async function getLatestEpisodes(count = 6) {
  const all = await _getAll();
  return all.slice(0, count);
}

export async function getEpisode(id) {
  const all = await _getAll();
  return all.find(e => e._id === id) || null;
}
