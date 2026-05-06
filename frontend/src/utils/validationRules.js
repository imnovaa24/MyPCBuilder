/**
 * Tập hợp các quy tắc kiểm tra tương thích linh kiện
 * Được sử dụng bởi hook useCompatibilityCheck và BuilderPage
 */

// Constants
export const INTEL_SOCKETS = ['lga1851', 'lga1700', 'lga1200', 'lga1151', 'lga1150'];
export const AMD_SOCKETS = ['am5', 'am4', 'am3+', 'am3'];

export const TIER_ALLOWED = {
  i3: ['H', 'B'],
  i5: ['H', 'B', 'Z'],
  i7: ['B', 'Z'],
  i9: ['Z'],
  ryzen3: ['A'],
  ryzen5: ['A', 'B', 'X'],
  ryzen7: ['B', 'X'],
  ryzen9: ['X'],
};

// ── Helper Functions ──────────────────────────────────────────────────────
export const getCpuSeries = (cpu) => {
  if (!cpu) return null;
  const fullName = `${cpu.brand} ${cpu.name}`.toLowerCase();
  if (/core i9|i9[-\s]/i.test(fullName)) return 'i9';
  if (/core i7|i7[-\s]/i.test(fullName)) return 'i7';
  if (/core i5|i5[-\s]/i.test(fullName)) return 'i5';
  if (/core i3|i3[-\s]/i.test(fullName)) return 'i3';
  if (/ryzen 9/i.test(fullName)) return 'ryzen9';
  if (/ryzen 7/i.test(fullName)) return 'ryzen7';
  if (/ryzen 5/i.test(fullName)) return 'ryzen5';
  if (/ryzen 3/i.test(fullName)) return 'ryzen3';
  return null;
};

export const getMainTier = (main) => {
  if (!main) return null;
  const name = main.name.toUpperCase();
  if (/\bZ\d{3}/.test(name)) return 'Z';
  if (/\bB\d{3}/.test(name)) return 'B';
  if (/\bH\d{3}/.test(name)) return 'H';
  if (/\bX\d{3}/.test(name)) return 'X';
  if (/\bA\d{3}/.test(name)) return 'A';
  return null;
};

export const isTierOk = (cpuSeries, tier) => {
  if (!cpuSeries || !tier) return true;
  return TIER_ALLOWED[cpuSeries]?.includes(tier) ?? true;
};

export const isIntelSocket = (socket) => INTEL_SOCKETS.includes(socket?.toLowerCase());
export const isAmdSocket = (socket) => AMD_SOCKETS.includes(socket?.toLowerCase());

// ── Validation Rules (Kiểm tra xung đột) ──────────────────────────────────
/**
 * Kiểm tra linh kiện trước khi thêm vào build
 * @param {Object} item - Linh kiện cần kiểm tra
 * @param {String} category - Loại linh kiện (cpu, mainboard, ram, vga, cooler, psu, case)
 * @param {Object} currentBuild - Cấu hình hiện tại
 * @returns {Object} { valid: boolean, message: string, severity: 'error'|'warning' }
 */
export const validateBeforeAdding = (item, category, currentBuild) => {
  // CPU vs Mainboard: socket phải khớp
  if (category === 'cpu' && currentBuild.mainboard) {
    if (item.specifications.socket !== currentBuild.mainboard.specifications.socket) {
      return {
        valid: false,
        message: `❌ Socket không khớp! CPU ${item.name} dùng socket ${item.specifications.socket}, nhưng Mainboard của bạn dùng ${currentBuild.mainboard.specifications.socket}.`,
        severity: 'error',
      };
    }
  }

  // Mainboard vs CPU: socket phải khớp
  if (category === 'mainboard' && currentBuild.cpu) {
    if (item.specifications.socket !== currentBuild.cpu.specifications.socket) {
      return {
        valid: false,
        message: `❌ Socket không khớp! Mainboard ${item.name} dùng socket ${item.specifications.socket}, nhưng CPU của bạn dùng ${currentBuild.cpu.specifications.socket}.`,
        severity: 'error',
      };
    }
  }

  // RAM vs Mainboard: loại RAM phải khớp
  if (category === 'ram' && currentBuild.mainboard) {
    if (item.specifications.ram_type !== currentBuild.mainboard.specifications.ram_type) {
      return {
        valid: false,
        message: `❌ Loại RAM không khớp! RAM ${item.name} là ${item.specifications.ram_type}, nhưng Mainboard của bạn chỉ hỗ trợ ${currentBuild.mainboard.specifications.ram_type}.`,
        severity: 'error',
      };
    }
  }

  // Cooler vs CPU: socket support
  if (category === 'cooler' && currentBuild.cpu) {
    const socketSupport = item.specifications.socket_support || [];
    if (!socketSupport.includes(currentBuild.cpu.specifications.socket)) {
      return {
        valid: false,
        message: `❌ Tản nhiệt không hỗ trợ! Tản nhiệt ${item.name} không hỗ trợ socket ${currentBuild.cpu.specifications.socket} của CPU của bạn.`,
        severity: 'error',
      };
    }
  }

  // PSU vs CPU + GPU công suất
  if (category === 'psu' && (currentBuild.cpu || currentBuild.vga)) {
    const totalTdp = 100 + (currentBuild.cpu?.specifications.tdp || 0) + (currentBuild.vga?.specifications.tdp || 0);
    const psuWattage = item.specifications.wattage;
    if (psuWattage < totalTdp) {
      return {
        valid: false,
        message: `❌ Công suất không đủ! PSU ${psuWattage}W không đủ cho tổng tải ${totalTdp}W (CPU + GPU + hệ thống).`,
        severity: 'error',
      };
    } else if (psuWattage < totalTdp + 150) {
      return {
        valid: true,
        message: `⚠️ Công suất hạn chế! PSU ${psuWattage}W khá sát tải. Khuyến nghị ≥ ${totalTdp + 150}W để an toàn.`,
        severity: 'warning',
      };
    }
  }

  // Case vs Mainboard form factor
  if (category === 'case' && currentBuild.mainboard) {
    const ORDER = ['ATX', 'mATX', 'ITX'];
    const mbForm = currentBuild.mainboard.specifications.form_factor;
    const caseForm = item.specifications.form_factor;
    const mbIdx = ORDER.indexOf(mbForm);
    const caseIdx = ORDER.indexOf(caseForm);
    if (mbIdx !== -1 && caseIdx !== -1 && caseIdx > mbIdx) {
      return {
        valid: false,
        message: `❌ Kích thước không vừa! Mainboard ${mbForm} của bạn lớn hơn Case ${caseForm}.`,
        severity: 'error',
      };
    }
  }

  // GPU vs Case chiều dài
  if (category === 'vga' && currentBuild.case) {
    const vgaLen = item.specifications.length;
    const maxLen = currentBuild.case.specifications.max_gpu_length;
    if (vgaLen && maxLen && vgaLen > maxLen) {
      return {
        valid: false,
        message: `❌ Quá dài! GPU ${vgaLen}mm dài hơn khoảng trống tối đa ${maxLen}mm của Case.`,
        severity: 'error',
      };
    }
  }

  return { valid: true, message: null };
};

// ── Health Check (Kiểm tra sức khỏe cấu hình) ──────────────────────────────
/**
 * Kiểm tra tất cả xung đột trong cấu hình hiện tại
 * @param {Object} build - Cấu hình PC hiện tại
 * @returns {Array} Mảng chứa các alerts { id, type, text }
 */
export const runHealthCheck = (build) => {
  const healthAlerts = [];
  let _aid = 0;
  const addError = (text) => healthAlerts.push({ id: ++_aid, type: 'error', text });
  const addWarn = (text) => healthAlerts.push({ id: ++_aid, type: 'warning', text });

  // 1. CPU ↔ Mainboard: socket & brand
  if (build.cpu && build.mainboard) {
    const cpuSocket = build.cpu.specifications.socket;
    const mbSocket = build.mainboard.specifications.socket;
    if (cpuSocket !== mbSocket) {
      addError(`Socket CPU (${cpuSocket}) không khớp với Mainboard (${mbSocket}).`);
    }
    const cpuIsIntel = isIntelSocket(cpuSocket);
    const cpuIsAmd = isAmdSocket(cpuSocket);
    const mbIsIntel = isIntelSocket(mbSocket);
    const mbIsAmd = isAmdSocket(mbSocket);
    if (cpuIsIntel && mbIsAmd) addError('CPU Intel không tương thích với Mainboard AMD.');
    if (cpuIsAmd && mbIsIntel) addError('CPU AMD không tương thích với Mainboard Intel.');

    // Tier chipset
    const cpuSeries = getCpuSeries(build.cpu);
    const mbTier = getMainTier(build.mainboard);
    if (cpuSeries && mbTier && !isTierOk(cpuSeries, mbTier)) {
      const tierLabel = {
        i3: 'H hoặc B',
        i7: 'B hoặc Z',
        i9: 'Z',
        ryzen3: 'A',
        ryzen7: 'B hoặc X',
        ryzen9: 'X',
      };
      const rec = tierLabel[cpuSeries];
      if (rec) {
        addWarn(`CPU ${build.cpu.name} nên ghép Mainboard dòng ${rec}. Mainboard dòng ${mbTier} không phù hợp.`);
      }
    }
  }

  // 2. Mainboard ↔ RAM: loại RAM
  if (build.mainboard && build.ram) {
    const mbRam = build.mainboard.specifications.ram_type;
    const ramType = build.ram.specifications.ram_type;
    if (mbRam !== ramType) {
      addError(`Mainboard chỉ hỗ trợ ${mbRam}, RAM đã chọn là ${ramType} — không tương thích.`);
    }
  }

  // 3. Tản nhiệt ↔ CPU socket
  if (build.cooler && build.cpu) {
    const socketSupport = build.cooler.specifications.socket_support || [];
    if (!socketSupport.includes(build.cpu.specifications.socket)) {
      addError(`Tản nhiệt ${build.cooler.name} không hỗ trợ socket ${build.cpu.specifications.socket}.`);
    }
  }

  // 4. CPU tầm thấp + VGA cao cấp → bottleneck
  if (build.cpu && build.vga) {
    const cpuSeries = getCpuSeries(build.cpu);
    const isLowCpu = ['i3', 'ryzen3'].includes(cpuSeries);
    const gpuFullName = `${build.vga.brand} ${build.vga.name}`;
    const isHighEndGpu = /rtx\s*(40[89]\d|4090|50[0-9]{2})|rx\s*(7[89][0-9]{2}|79\d{2})/i.test(gpuFullName);
    if (isLowCpu && isHighEndGpu) {
      addWarn(`CPU ${build.cpu.name} có thể gây nghẽn cổ chai (bottleneck) khi ghép với VGA ${build.vga.name} cao cấp.`);
    }
  }

  // 5. PSU ↔ Tổng công suất hệ thống
  if (build.psu) {
    const totalTdp = 100 + (build.cpu?.specifications.tdp || 0) + (build.vga?.specifications.tdp || 0);
    if (build.psu.specifications.wattage < totalTdp) {
      addError(`Công suất nguồn (${build.psu.specifications.wattage}W) không đảm bảo yêu cầu. Tổng tải ước tính: ${totalTdp}W.`);
    } else if (build.psu.specifications.wattage < totalTdp + 150) {
      addWarn(`Công suất nguồn (${build.psu.specifications.wattage}W) khá sát tải. Khuyến nghị tối thiểu ${totalTdp + 150}W để an toàn.`);
    }
  }

  // 6. Mainboard form factor ↔ Case
  if (build.mainboard && build.case) {
    const mbForm = build.mainboard.specifications.form_factor;
    const caseForm = build.case.specifications.form_factor;
    const ORDER = ['ATX', 'mATX', 'ITX'];
    const mbIdx = ORDER.indexOf(mbForm);
    const caseIdx = ORDER.indexOf(caseForm);
    if (mbIdx !== -1 && caseIdx !== -1 && caseIdx > mbIdx) {
      addError(`Kích thước Bo mạch chủ (${mbForm}) không lắp vừa Vỏ máy tính (${caseForm}).`);
    }
  }

  // 7. VGA chiều dài ↔ Case
  if (build.vga && build.case) {
    const vgaLen = build.vga.specifications.length;
    const maxLen = build.case.specifications.max_gpu_length;
    if (vgaLen && maxLen && vgaLen > maxLen) {
      addError(`Card màn hình quá dài (${vgaLen}mm) so với khoảng trống tối đa của Vỏ Case (${maxLen}mm).`);
    }
  }

  return healthAlerts;
};
