import { json } from './_helpers';

export async function onRequestGet() {
  return json({ status: 'ok', timestamp: new Date().toISOString() });
}
