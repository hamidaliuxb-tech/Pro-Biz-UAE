import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/api';
import { SERVICES } from '@/data/services';

let cache = null;

export function useServices() {
  const [services, setServices] = useState(cache || SERVICES);

  useEffect(() => {
    if (cache) return;
    axios.get(`${API}/services`).then((r) => {
      cache = r.data;
      setServices(r.data);
    }).catch(() => {});
  }, []);

  return services;
}
