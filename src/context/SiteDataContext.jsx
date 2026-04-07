import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSiteData } from '../data/defaultSiteData';
import { siteRepository } from '../data/siteRepository';
import { isSupabaseConfigured, SITE_CONTENT_SLUG, SITE_CONTENT_TABLE, supabase } from '../lib/supabaseClient';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [siteDataLoading, setSiteDataLoading] = useState(true);
  const [siteDataError, setSiteDataError] = useState(null);

  const refreshSiteData = async () => {
    setSiteDataLoading(true);
    setSiteDataError(null);

    try {
      const nextData = await siteRepository.load();
      setSiteData(nextData);
      return nextData;
    } catch (error) {
      setSiteDataError(error);
      throw error;
    } finally {
      setSiteDataLoading(false);
    }
  };

  useEffect(() => {
    refreshSiteData().catch((error) => {
      console.error('Failed to hydrate site data:', error);
      setSiteData(defaultSiteData);
      setSiteDataLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const channel = supabase
      .channel('site-content-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: SITE_CONTENT_TABLE,
          filter: `slug=eq.${SITE_CONTENT_SLUG}`
        },
        (payload) => {
          const nextPayload = payload.new?.payload;
          if (!nextPayload) {
            return;
          }

          setSiteData(siteRepository.normalize(nextPayload));
          setSiteDataError(null);
          setSiteDataLoading(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const saveSiteData = async (nextValue) => {
    setSiteDataError(null);
    const savedValue = await siteRepository.save(nextValue);
    setSiteData(savedValue);
    return savedValue;
  };

  const resetSiteData = async () => {
    setSiteDataError(null);
    const resetValue = await siteRepository.reset();
    setSiteData(resetValue);
    return resetValue;
  };

  const value = useMemo(
    () => ({
      defaultSiteData,
      siteData,
      siteDataLoading,
      siteDataError,
      saveSiteData,
      resetSiteData,
      refreshSiteData
    }),
    [siteData, siteDataLoading, siteDataError]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const context = useContext(SiteDataContext);

  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider.');
  }

  return context;
}
