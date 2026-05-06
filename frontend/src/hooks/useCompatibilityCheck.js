/**
 * Custom Hook: useCompatibilityCheck
 * Quản lý logic kiểm tra tương thích linh kiện
 * 
 * Ưu điểm:
 * - Tái sử dụng ở nhiều component
 * - Tách biệt logic khỏi UI
 * - Dễ test và maintain
 */

import { useState, useCallback } from 'react';
import { validateBeforeAdding, runHealthCheck } from '../utils/validationRules';

export const useCompatibilityCheck = (initialBuild) => {
  const [build, setBuild] = useState(initialBuild);
  const [validationMessage, setValidationMessage] = useState(null);
  const [healthAlerts, setHealthAlerts] = useState([]);

  // Cập nhật health alerts mỗi khi build thay đổi
  const updateHealthAlerts = useCallback(() => {
    const alerts = runHealthCheck(build);
    setHealthAlerts(alerts);
  }, [build]);

  // Thêm linh kiện với validation
  const addComponent = useCallback(
    (item, category) => {
      // Kiểm tra xung đột trước
      const validation = validateBeforeAdding(item, category, build);

      if (!validation.valid) {
        setValidationMessage(validation);
        return false;
      }

      // Nếu là warning, cho phép nhưng hiển thị message
      if (validation.message && validation.severity === 'warning') {
        setValidationMessage(validation);
        // Trả về warning để component có thể xử lý (ví dụ hỏi confirm)
        return 'warning';
      }

      // Thêm thành công
      const newBuild = { ...build, [category]: item };
      setBuild(newBuild);
      setValidationMessage(null);
      
      // Cập nhật health alerts sau khi thêm
      const alerts = runHealthCheck(newBuild);
      setHealthAlerts(alerts);
      
      return true;
    },
    [build]
  );

  // Loại bỏ linh kiện
  const removeComponent = useCallback((slotKey) => {
    const newBuild = { ...build, [slotKey]: null };
    setBuild(newBuild);
    setValidationMessage(null);
    
    // Cập nhật health alerts
    const alerts = runHealthCheck(newBuild);
    setHealthAlerts(alerts);
  }, [build]);

  // Đặt lại validation message
  const clearValidationMessage = useCallback(() => {
    setValidationMessage(null);
  }, []);

  // Bắt buộc cập nhật health alerts (dùng khi cần refresh)
  const refreshHealthAlerts = useCallback(() => {
    updateHealthAlerts();
  }, [updateHealthAlerts]);

  return {
    // State
    build,
    setBuild,
    validationMessage,
    healthAlerts,

    // Methods
    addComponent,
    removeComponent,
    clearValidationMessage,
    refreshHealthAlerts,
  };
};
