import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSiteData } from '../data/defaultSiteData';
import { siteRepository } from '../data/siteRepository';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(() => siteRepository.load());

  useEffect(() => {
    siteRepository.save(siteData);
  }, [siteData]);

  const resetSiteData = () => {
    const resetValue = siteRepository.reset();
    setSiteData(resetValue);
  };

  const value = useMemo(
    () => ({
      defaultSiteData,
      siteData,
      setSiteData,
      resetSiteData
    }),
    [siteData]
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
