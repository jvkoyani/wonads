// Publishes src/data/services-data.js unchanged as /services-data.js for the site's browser scripts.
import source from '../data/services-data.js?raw';

export function GET() {
  return new Response(source, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
}
