const BASKETAKI_STANDINGS_URL = 'https://www.basketaki.com/teams/noobs/standings';
const SITE_CONTENT_TABLE = 'site_content';
const SITE_CONTENT_SLUG = 'main';
const ATHENS_TIME_ZONE = 'Europe/Athens';
const HEADER_TEAM = ['\u03bf\u03bc\u03ac\u03b4\u03b1', '\u03bf\u03bc\u03b1\u03b4\u03b1', 'team'];
const HEADER_POINTS = '\u03b2';
const HEADER_PLAYED = '\u03b1';
const HEADER_WON = '\u03bd';
const HEADER_LOST = '\u03b7';
const HEADER_STREAK = ['str', '\u03c3\u03b5\u03c1\u03b9', '\u03c3\u03c4\u03c1'];
const HEADER_SCORED = '\u03c5\u03c0';
const HEADER_CONCEDED = '\u03ba\u03c4';
const HEADER_AB = '\u03b1\u03b2';
const DEFAULT_GROUP_TITLE = '1\u03bf\u03c2 \u038c\u03bc\u03b9\u03bb\u03bf\u03c2';

const json = (response, status, body) => {
  response.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
};

const decodeHtml = (value = '') =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const stripTags = (value = '') => decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());

const toNumber = (value) => {
  const normalized = String(value || '').replace('%', '').replace(',', '.').trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const absolutizeUrl = (value) => {
  if (!value) {
    return '';
  }

  try {
    return new URL(decodeHtml(value), BASKETAKI_STANDINGS_URL).toString();
  } catch {
    return '';
  }
};

const getAthensParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: ATHENS_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);

  return {
    hour: Number(parts.find((part) => part.type === 'hour')?.value),
    minute: Number(parts.find((part) => part.type === 'minute')?.value)
  };
};

const shouldRunForSchedule = (request) => {
  if (request.query?.force === '1') {
    return true;
  }

  const { hour, minute } = getAthensParts();
  return (hour === 0 && minute >= 30) || (hour === 1 && minute <= 29);
};

const isAuthorized = (request) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
  }

  return request.headers.authorization === `Bearer ${cronSecret}`;
};

const extractCells = (rowHtml) => {
  const cells = [];
  const cellPattern = /<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi;
  let match;

  while ((match = cellPattern.exec(rowHtml)) !== null) {
    const cellHtml = match[1];
    const imageMatch = cellHtml.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);

    cells.push({
      html: cellHtml,
      text: stripTags(cellHtml),
      image: absolutizeUrl(imageMatch?.[1])
    });
  }

  return cells;
};

const getTableRows = (tableHtml) => {
  const rows = [];
  const rowPattern = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowPattern.exec(tableHtml)) !== null) {
    const cells = extractCells(match[1]);
    if (cells.length) {
      rows.push(cells);
    }
  }

  return rows;
};

const normalizeHeader = (value) => value.toLowerCase().replace(/\s+/g, '');

const findTeamColumn = (headers) =>
  headers.findIndex((header) => HEADER_TEAM.includes(normalizeHeader(header)));

const pickStandingsTable = (html) => {
  const tablePattern = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tablePattern.exec(html)) !== null) {
    const tableHtml = match[1];
    const rows = getTableRows(tableHtml);
    const header = rows.find((row) => row.some((cell) => HEADER_TEAM.includes(normalizeHeader(cell.text))));

    if (!header) {
      continue;
    }

    const headers = header.map((cell) => cell.text);
    const teamColumn = findTeamColumn(headers);
    const hasStandingsColumns = [HEADER_POINTS, HEADER_PLAYED, HEADER_WON, HEADER_LOST].every((column) =>
      headers.map(normalizeHeader).includes(column)
    );

    if (teamColumn >= 0 && hasStandingsColumns) {
      return { tableHtml, rows, headers, headerIndex: rows.indexOf(header), tableStart: match.index };
    }
  }

  return null;
};

const extractGroupTitle = (html, tableStart) => {
  const beforeTable = html.slice(0, tableStart);
  const headings = [...beforeTable.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)];
  const lastHeading = headings.at(-1)?.[1];
  return stripTags(lastHeading || '');
};

const parseStandings = (html) => {
  const table = pickStandingsTable(html);

  if (!table) {
    throw new Error('Could not find a Basketaki standings table.');
  }

  const normalizedHeaders = table.headers.map(normalizeHeader);
  const columnIndex = (labels) => normalizedHeaders.findIndex((header) => labels.includes(header));
  const indexes = {
    rank: columnIndex(['#', '']),
    team: findTeamColumn(table.headers),
    points: columnIndex([HEADER_POINTS]),
    played: columnIndex([HEADER_PLAYED]),
    won: columnIndex([HEADER_WON]),
    lost: columnIndex([HEADER_LOST]),
    streak: columnIndex(HEADER_STREAK),
    scored: columnIndex([HEADER_SCORED]),
    conceded: columnIndex([HEADER_CONCEDED]),
    diff: columnIndex(['+/-']),
    ab: columnIndex([HEADER_AB])
  };

  const bodyRows = table.rows.slice(table.headerIndex + 1);
  const standings = bodyRows
    .map((row, index) => {
      const teamCell = row[indexes.team];
      const team = teamCell?.text || '';

      if (!team) {
        return null;
      }

      const isNoobs = team.toLowerCase().includes('noobs');

      return {
        id: toNumber(row[indexes.rank]?.text) || index + 1,
        team,
        logo: isNoobs ? '/images/logo1.png' : teamCell.image || '/images/basketaki.png',
        points: toNumber(row[indexes.points]?.text),
        played: toNumber(row[indexes.played]?.text),
        won: toNumber(row[indexes.won]?.text),
        lost: toNumber(row[indexes.lost]?.text),
        streak: indexes.streak >= 0 ? row[indexes.streak]?.text || '' : '',
        scored: toNumber(row[indexes.scored]?.text),
        conceded: toNumber(row[indexes.conceded]?.text),
        diff: toNumber(row[indexes.diff]?.text),
        ab: toNumber(row[indexes.ab]?.text)
      };
    })
    .filter(Boolean);

  if (!standings.length) {
    throw new Error('Basketaki standings table was found, but it had no team rows.');
  }

  return {
    groupTitle: extractGroupTitle(html, table.tableStart),
    standings
  };
};

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    serviceRoleKey
  };
};

const supabaseHeaders = (serviceRoleKey) => ({
  apikey: serviceRoleKey,
  authorization: `Bearer ${serviceRoleKey}`,
  'content-type': 'application/json',
  prefer: 'return=representation'
});

const syncStandings = async () => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  const sourceResponse = await fetch(BASKETAKI_STANDINGS_URL, {
    headers: {
      'user-agent': 'NoobsBC standings sync (+https://noobs.gr)'
    }
  });

  if (!sourceResponse.ok) {
    throw new Error(`Basketaki returned ${sourceResponse.status}.`);
  }

  const sourceHtml = await sourceResponse.text();
  const parsed = parseStandings(sourceHtml);

  const rowUrl = `${supabaseUrl}/rest/v1/${SITE_CONTENT_TABLE}?slug=eq.${encodeURIComponent(SITE_CONTENT_SLUG)}&select=payload`;
  const rowResponse = await fetch(rowUrl, {
    headers: supabaseHeaders(serviceRoleKey)
  });

  if (!rowResponse.ok) {
    throw new Error(`Supabase read returned ${rowResponse.status}: ${await rowResponse.text()}`);
  }

  const rows = await rowResponse.json();
  const currentPayload = rows[0]?.payload || {};
  const nextPayload = {
    ...currentPayload,
    standings: parsed.standings,
    standingsGroupTitle: parsed.groupTitle || currentPayload.standingsGroupTitle || DEFAULT_GROUP_TITLE
  };

  const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/${SITE_CONTENT_TABLE}?on_conflict=slug`, {
    method: 'POST',
    headers: {
      ...supabaseHeaders(serviceRoleKey),
      prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify({
      slug: SITE_CONTENT_SLUG,
      payload: nextPayload,
      updated_at: new Date().toISOString()
    })
  });

  if (!upsertResponse.ok) {
    throw new Error(`Supabase write returned ${upsertResponse.status}: ${await upsertResponse.text()}`);
  }

  return {
    groupTitle: nextPayload.standingsGroupTitle,
    teams: parsed.standings.length,
    noobsRank: parsed.standings.findIndex((team) => team.team.toLowerCase().includes('noobs')) + 1
  };
};

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'POST') {
    return json(response, 405, { ok: false, error: 'Method not allowed.' });
  }

  if (!isAuthorized(request)) {
    return json(response, 401, { ok: false, error: 'Unauthorized.' });
  }

  if (!shouldRunForSchedule(request)) {
    return json(response, 200, { ok: true, skipped: true, reason: 'Outside 00:30-01:29 Europe/Athens window.' });
  }

  try {
    const result = await syncStandings();
    return json(response, 200, { ok: true, ...result });
  } catch (error) {
    return json(response, 500, { ok: false, error: error.message });
  }
}
