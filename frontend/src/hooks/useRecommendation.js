import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export function useRecommendation() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRecommendation = useCallback(async ({ budget, use_case, constraints }) => {
    setLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const response = await axios.post(`${API_BASE}/recommendations`, {
        budget: Number(budget),
        use_case,
        constraints: constraints || {},
      });

      setRecommendation(response.data.data);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.budget?.[0] ||
        'Không thể tạo gợi ý cấu hình. Vui lòng thử lại.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRecommendation(null);
    setError('');
  }, []);

  return { recommendation, loading, error, getRecommendation, reset };
}

export function recommendationToPresetBuild(recommendation) {
  const slotNames = {
    cpu: 'CPU',
    mainboard: 'Mainboard',
    ram: 'RAM',
    vga: 'VGA',
    storage: 'Storage',
    psu: 'PSU',
    case: 'Case',
    cooler: 'Cooler',
  };

  const components = Object.entries(recommendation.components || {}).map(([code, comp]) => ({
    category_id: comp.category_id,
    category_code: code,
    category_name: slotNames[code] || code,
    component: {
      id: comp.id,
      category_id: comp.category_id,
      brand: comp.brand,
      name: comp.name,
      min_price: comp.min_price,
      max_price: comp.max_price,
      specifications: comp.specifications,
      image_url: comp.image_url,
    },
  }));

  return {
    components,
    total_min_price: recommendation.total_min_price,
    total_max_price: recommendation.total_max_price,
  };
}
