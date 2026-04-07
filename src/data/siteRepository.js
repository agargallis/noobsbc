import { defaultSiteData } from './defaultSiteData';

const STORAGE_KEY = 'noobs-site-data-v1';

const mergeTopLevel = (savedData) => ({
  ...defaultSiteData,
  ...savedData,
  meta: { ...defaultSiteData.meta, ...savedData?.meta },
  hero: { ...defaultSiteData.hero, ...savedData?.hero },
  nextMatch: { ...defaultSiteData.nextMatch, ...savedData?.nextMatch }
});

export const siteRepository = {
  load() {
    if (typeof window === 'undefined') {
      return defaultSiteData;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultSiteData;
      }

      return mergeTopLevel(JSON.parse(raw));
    } catch (error) {
      console.error('Failed to load site data:', error);
      return defaultSiteData;
    }
  },

  save(nextValue) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
  },

  reset() {
    if (typeof window === 'undefined') {
      return defaultSiteData;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    return defaultSiteData;
  }
};
