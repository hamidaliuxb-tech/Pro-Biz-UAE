import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/api';
import { SITE, STATS } from '@/data/site';

const SiteContext = createContext({ site: SITE, stats: STATS });

export function SiteProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_site_content');
      return cached ? { site: JSON.parse(cached) } : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    axios.get(`${API}/content`, { timeout: 2500 }).then((res) => {
      if (res.data) setContent(res.data);
    }).catch(() => {});
  }, []);

  const site = { ...SITE, ...(content?.site || {}) };
  const stats = content?.stats?.length === 4 ? content.stats : STATS;

  return <SiteContext.Provider value={{ site, stats }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
