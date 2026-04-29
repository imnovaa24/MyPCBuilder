import { useEffect, useState } from 'react';
import axios from 'axios';

function useApiData(endpoint, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(endpoint);
        if (isMounted) {
          setData(response.data.data);
        }
      } catch (fetchError) {
        console.error('API load error:', fetchError);
        if (isMounted) {
          setError('Không tải được dữ liệu từ server.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, isLoading, error };
}

export default useApiData;
