import { defaultSiteData } from './defaultSiteData';
import { isSupabaseConfigured, SITE_CONTENT_SLUG, SITE_CONTENT_TABLE, supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'noobs-site-data-v3';
const INSTAGRAM_CANONICAL_URL = 'https://instagram.com/noobs.gr';

const normalizeInstagramUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return INSTAGRAM_CANONICAL_URL;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return INSTAGRAM_CANONICAL_URL;
  }

  if (trimmed.includes('instagram.com/noobs.gr')) {
    return INSTAGRAM_CANONICAL_URL;
  }

  return trimmed;
};

const sanitizeSiteData = (value) => {
  const merged = mergeSiteData(value);

  merged.meta = {
    ...merged.meta,
    instagramUrl: normalizeInstagramUrl(merged.meta?.instagramUrl)
  };

  merged.instagramPosts = merged.instagramPosts.map((post) => ({
    ...post,
    href: normalizeInstagramUrl(post?.href)
  }));

  return merged;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const mergeSiteData = (savedData = {}) => ({
  ...clone(defaultSiteData),
  ...savedData,
  meta: {
    ...defaultSiteData.meta,
    ...savedData?.meta
  },
  hero: {
    ...defaultSiteData.hero,
    ...savedData?.hero,
    primaryCta: {
      ...defaultSiteData.hero.primaryCta,
      ...savedData?.hero?.primaryCta
    },
    secondaryCta: {
      ...defaultSiteData.hero.secondaryCta,
      ...savedData?.hero?.secondaryCta
    }
  },
  nextMatch: {
    ...defaultSiteData.nextMatch,
    ...savedData?.nextMatch
  },
  standings: Array.isArray(savedData?.standings) ? savedData.standings : clone(defaultSiteData.standings),
  latestMatches: Array.isArray(savedData?.latestMatches) ? savedData.latestMatches : clone(defaultSiteData.latestMatches),
  upcomingMatches: Array.isArray(savedData?.upcomingMatches) ? savedData.upcomingMatches : clone(defaultSiteData.upcomingMatches),
  players: Array.isArray(savedData?.players) ? savedData.players : clone(defaultSiteData.players),
  news: Array.isArray(savedData?.news) ? savedData.news : clone(defaultSiteData.news),
  instagramPosts: Array.isArray(savedData?.instagramPosts) ? savedData.instagramPosts : clone(defaultSiteData.instagramPosts),
  sponsors: Array.isArray(savedData?.sponsors) ? savedData.sponsors : clone(defaultSiteData.sponsors)
});

const loadLocal = () => {
  if (typeof window === 'undefined') {
    return clone(defaultSiteData);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultSiteData);
    }

    return sanitizeSiteData(JSON.parse(raw));
  } catch (error) {
    console.error('Failed to load local site data:', error);
    return clone(defaultSiteData);
  }
};

const saveLocal = (nextValue) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
};

export const siteRepository = {
  normalize(value) {
    return sanitizeSiteData(value);
  },

  async load() {
    if (typeof window === 'undefined') {
      return clone(defaultSiteData);
    }

    if (!isSupabaseConfigured || !supabase) {
      return loadLocal();
    }

    try {
      const { data, error } = await supabase
        .from(SITE_CONTENT_TABLE)
        .select('payload')
        .eq('slug', SITE_CONTENT_SLUG)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data?.payload) {
        return clone(defaultSiteData);
      }

      const merged = sanitizeSiteData(data.payload);
      saveLocal(merged);
      return merged;
    } catch (error) {
      console.error('Failed to load site data from Supabase:', error);
      return loadLocal();
    }
  },

  async save(nextValue) {
    const cleanValue = sanitizeSiteData(clone(nextValue));

    if (typeof window !== 'undefined') {
      saveLocal(cleanValue);
    }

    if (!isSupabaseConfigured || !supabase) {
      return cleanValue;
    }

    const { error } = await supabase
      .from(SITE_CONTENT_TABLE)
      .upsert(
        {
          slug: SITE_CONTENT_SLUG,
          payload: cleanValue,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'slug' }
      );

    if (error) {
      throw error;
    }

    return cleanValue;
  },

  async reset() {
    const resetValue = clone(defaultSiteData);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    return this.save(resetValue);
  }
};
