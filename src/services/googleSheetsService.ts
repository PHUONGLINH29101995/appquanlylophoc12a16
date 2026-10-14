import { ClassStudent, SchoolRuleItem, GoogleSheetConfig } from '../types/edtech';

// Chuẩn hóa tiêu đề cột tiếng Việt
export function normalizeHeader(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Phân tích dòng CSV đa định dạng hỗ trợ dấu ngoặc kép và ngắt dòng
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim().replace(/^"|"$/g, ''));
    rows.push(row);
  }
  return rows;
}

// Phân tích Danh Sách Học Sinh từ Google Sheet CSV
export function parseStudentsCsv(csvText: string): ClassStudent[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  // Tìm dòng tiêu đề (Header row)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const norm = rows[i].map(normalizeHeader);
    if (norm.some(h => h.includes('ten') || h.includes('hoc sinh') || h.includes('ma hs') || h.includes('ho va ten'))) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = rows[headerRowIndex].map(normalizeHeader);
  const findCol = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const colCode = findCol(['ma hs', 'ma hoc sinh', 'mshs', 'stt', 'code', 'id']);
  const colName = findCol(['ho va ten', 'ho ten', 'ten hoc sinh', 'ten', 'name']);
  const colDob = findCol(['ngay sinh', 'nam sinh', 'dob', 'sinh']);
  const colGender = findCol(['gioi tinh', 'phai', 'gender', 'nam nu']);
  const colGroup = findCol(['to', 'nhom', 'group']);
  const colRole = findCol(['chuc vu', 'vai tro', 'role', 'nhiem vu']);
  const colKarma = findCol(['karma', 'diem karma', 'diem ren luyen', 'exp', 'diem']);
  const colStreak = findCol(['chuyen can', 'chuoi chuyen can', 'streak', 'ngay']);
  const colConduct = findCol(['hanh kiem', 'xep loai', 'conduct']);
  const colParentName = findCol(['phu huynh', 'ten phu huynh', 'ho ten phu huynh', 'cha me']);
  const colParentPhone = findCol(['sdt', 'dien thoai', 'so dien thoai', 'phone', 'lien he']);
  const colAddress = findCol(['dia chi', 'noi o', 'address', 'cu tru']);
  const colNote = findCol(['ghi chu', 'nhan xet', 'danh gia', 'note']);

  const parsedStudents: ClassStudent[] = [];

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const name = (colName !== -1 && row[colName]) ? row[colName].trim() : '';
    if (!name && (colCode === -1 || !row[colCode])) continue;

    const studentIdx = parsedStudents.length + 1;
    const rawCode = (colCode !== -1 && row[colCode]) ? row[colCode].trim() : '';
    const studentCode = rawCode.startsWith('12A16-') 
      ? rawCode 
      : (rawCode ? `12A16-${rawCode.replace(/[^0-9]/g, '').padStart(2, '0')}` : `12A16-${String(studentIdx).padStart(2, '0')}`);

    const rawGender = (colGender !== -1 && row[colGender]) ? row[colGender].trim().toLowerCase() : '';
    const gender: 'Nam' | 'Nữ' = rawGender.includes('nu') || rawGender.includes('f') || rawGender.includes('g') ? 'Nữ' : 'Nam';

    const rawGroup = (colGroup !== -1 && row[colGroup]) ? parseInt(row[colGroup].replace(/[^0-9]/g, ''), 10) : NaN;
    const group = !isNaN(rawGroup) && rawGroup >= 1 && rawGroup <= 4 ? rawGroup : ((studentIdx - 1) % 4) + 1;

    const rawKarma = (colKarma !== -1 && row[colKarma]) ? parseInt(row[colKarma].replace(/[^0-9]/g, ''), 10) : NaN;
    const karmaPoints = !isNaN(rawKarma) && rawKarma > 0 ? rawKarma : 1200 + ((studentIdx * 37) % 500);

    const rawStreak = (colStreak !== -1 && row[colStreak]) ? parseInt(row[colStreak].replace(/[^0-9]/g, ''), 10) : NaN;
    const streakDays = !isNaN(rawStreak) && rawStreak > 0 ? rawStreak : 10 + (studentIdx % 20);

    const role = (colRole !== -1 && row[colRole]) ? row[colRole].trim() : (studentIdx === 1 ? 'Lớp Trưởng' : studentIdx === 2 ? 'Bí Thư Chi Đoàn' : 'Học sinh');
    const dob = (colDob !== -1 && row[colDob]) ? row[colDob].trim() : `${10 + (studentIdx % 20)}/${(studentIdx % 12) + 1}/2009`;
    const conduct = (colConduct !== -1 && row[colConduct]) ? (row[colConduct].includes('Khá') ? 'Khá' : 'Tốt') : 'Tốt';

    const parentName = (colParentName !== -1 && row[colParentName]) ? row[colParentName].trim() : `Phụ huynh em ${name || studentCode}`;
    const parentPhone = (colParentPhone !== -1 && row[colParentPhone]) ? row[colParentPhone].trim() : `09${10 + studentIdx}.${100 + studentIdx}.${100 + studentIdx}`;
    const address = (colAddress !== -1 && row[colAddress]) ? row[colAddress].trim() : 'Bình Chánh, TP. Hồ Chí Minh';
    const note = (colNote !== -1 && row[colNote]) ? row[colNote].trim() : `Học sinh Lớp 12A16 - GVCN: Cô Phương Linh.`;

    parsedStudents.push({
      id: `st-${String(studentIdx).padStart(2, '0')}`,
      studentCode,
      name: name || `Học sinh ${studentCode}`,
      dob,
      gender,
      group,
      role,
      parentName,
      parentPhone,
      address,
      karmaPoints,
      streakDays,
      conduct: conduct as 'Tốt' | 'Khá' | 'Đạt',
      status: 'active',
      note,
    });
  }

  return parsedStudents;
}

// Phân tích Nội Quy Nhà Trường từ Google Sheet CSV
export function parseRulesCsv(csvText: string): SchoolRuleItem[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const norm = rows[i].map(normalizeHeader);
    if (norm.some(h => h.includes('noi quy') || h.includes('quy dinh') || h.includes('diem tru') || h.includes('hanh vi'))) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = rows[headerRowIndex].map(normalizeHeader);
  const findCol = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const colCode = findCol(['ma noi quy', 'ma nq', 'ma', 'code', 'stt']);
  const colCat = findCol(['danh muc', 'nhom', 'loai', 'linh vuc', 'category']);
  const colTitle = findCol(['hanh vi quy dinh', 'noi dung vi pham', 'quy dinh', 'hanh vi', 'tieu de', 'noi quy', 'title']);
  const colDesc = findCol(['mo ta', 'chi tiet', 'dien giai', 'description']);
  const colPoints = findCol(['muc diem tru', 'diem tru', 'tru diem', 'diem', 'points']);
  const colSeverity = findCol(['muc do', 'tinh chat', 'nghiem trong', 'severity']);
  const colRemediation = findCol(['phuong phap khac phuc', 'bien phap khac phuc', 'khac phuc', 'chuoc loi', 'remediation']);

  const parsedRules: SchoolRuleItem[] = [];

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const title = (colTitle !== -1 && row[colTitle]) ? row[colTitle].trim() : '';
    if (!title && (colCode === -1 || !row[colCode])) continue;

    const ruleIdx = parsedRules.length + 1;
    const rawCode = (colCode !== -1 && row[colCode]) ? row[colCode].trim() : '';
    const code = rawCode.startsWith('NQ-') ? rawCode : (rawCode ? `NQ-${rawCode.replace(/[^0-9]/g, '').padStart(2, '0')}` : `NQ-${String(ruleIdx).padStart(2, '0')}`);

    const rawCategory = (colCat !== -1 && row[colCat]) ? row[colCat].trim() : '';
    let category: SchoolRuleItem['category'] = 'Chuyên Cần & Giờ Giấc';
    const normCat = normalizeHeader(rawCategory);
    if (normCat.includes('dong phuc') || normCat.includes('tac phong')) {
      category = 'Đồng Phục & Tác Phong';
    } else if (normCat.includes('hoc tap') || normCat.includes('thi cu') || normCat.includes('ky luat')) {
      category = 'Kỷ Luật Học Tập';
    } else if (normCat.includes('ve sinh') || normCat.includes('co so vat chat')) {
      category = 'Vệ Sinh & Cơ Sở Vật Chất';
    } else if (normCat.includes('ung xu') || normCat.includes('van hoa') || normCat.includes('so')) {
      category = 'Ứng Xử & Văn Hóa Số';
    }

    const rawPoints = (colPoints !== -1 && row[colPoints]) ? parseInt(row[colPoints].replace(/[^0-9]/g, ''), 10) : NaN;
    const deductionPoints = !isNaN(rawPoints) && rawPoints > 0 ? rawPoints : 10;

    const rawSeverity = (colSeverity !== -1 && row[colSeverity]) ? row[colSeverity].trim() : '';
    let severity: SchoolRuleItem['severity'] = 'Nhẹ';
    if (rawSeverity.toLowerCase().includes('nghiem trong') || deductionPoints >= 35) {
      severity = 'Nghiêm Trọng';
    } else if (rawSeverity.toLowerCase().includes('vua') || deductionPoints >= 20) {
      severity = 'Vừa';
    }

    const description = (colDesc !== -1 && row[colDesc]) ? row[colDesc].trim() : `Quy định về ${title} đối với học sinh lớp 12A16.`;
    const remediationMethod = (colRemediation !== -1 && row[colRemediation]) ? row[colRemediation].trim() : `Rèn luyện tích cực và hoàn thành nhiệm vụ bù điểm Karma trong tuần.`;

    parsedRules.push({
      id: `rule-${ruleIdx}`,
      code,
      category,
      title: title || `Quy định ${code}`,
      description,
      deductionPoints,
      severity,
      remediationMethod,
    });
  }

  return parsedRules;
}

// Client-side helper tải CSV từ Google Sheet
export async function fetchGoogleSheetCsvClient(
  sheetId: string,
  sheetName?: string,
  overrideUrl?: string
): Promise<{ success: boolean; csv?: string; error?: string; isAuthRequired?: boolean }> {
  let targetId = sheetId;
  let targetGid: string | null = null;

  if (overrideUrl) {
    const idMatch = overrideUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (idMatch) targetId = idMatch[1];
    const gidMatch = overrideUrl.match(/[#&?]gid=([0-9]+)/);
    if (gidMatch) targetGid = gidMatch[1];
  }

  if (!targetId || targetId.length < 15 || targetId.includes('12A16_GOOGLE_SHEET_DATABASE')) {
    return { success: false, error: 'Chưa cấu hình Google Sheet ID thực tế' };
  }

  const urlsToTry: string[] = [];
  if (targetGid) {
    urlsToTry.push(`https://docs.google.com/spreadsheets/d/${targetId}/export?format=csv&gid=${targetGid}`);
  }
  if (sheetName) {
    urlsToTry.push(`https://docs.google.com/spreadsheets/d/${targetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`);
  }
  urlsToTry.push(`https://docs.google.com/spreadsheets/d/${targetId}/export?format=csv`);
  urlsToTry.push(`https://docs.google.com/spreadsheets/d/${targetId}/gviz/tq?tqx=out:csv`);

  for (const url of urlsToTry) {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const text = await resp.text();
        if (text && (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('accounts.google.com'))) {
          return {
            success: false,
            isAuthRequired: true,
            error: 'Google Sheet đang ở chế độ Riêng tư (Private). Vui lòng đổi quyền chia sẻ sang "Bất kỳ ai có đường liên kết đều có thể xem" (Viewer).',
          };
        }
        if (text && text.trim().length > 10 && text.includes(',')) {
          return { success: true, csv: text };
        }
      }
    } catch (_e) {
      // Tiếp tục thử URL khác
    }
  }

  return {
    success: false,
    error: 'Không thể kết nối đến Google Sheet. Vui lòng đảm bảo bảng tính đã bật chia sẻ "Bất kỳ ai có liên kết".',
  };
}

// Đồng bộ tổng hợp cả Client-Side và Server-Side
export async function syncGoogleSheetData(
  config: GoogleSheetConfig
): Promise<{
  success: boolean;
  isLive: boolean;
  students?: ClassStudent[];
  rules?: SchoolRuleItem[];
  message: string;
  timestamp: string;
}> {
  const timestamp = new Date().toLocaleString('vi-VN');

  // 1. Thử gọi API Express backend trước (nếu đang chạy local)
  try {
    const resp = await fetch('/api/google-sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetId: config.sheetId,
        sheetUrl: config.sheetUrl,
        studentsSheetUrl: config.studentsSheetUrl,
        rulesSheetUrl: config.rulesSheetUrl,
        sheetNames: config.sheetNames,
      }),
    });
    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
  } catch (_e) {
    // Không kết nối được server (chế độ tĩnh Vercel), chạy tiếp client-side
  }

  // 2. Chế độ Client-Side Sync trực tiếp từ Google Sheet
  const sheetId = config.sheetId;
  const sheetNames = config.sheetNames || {
    students: 'DANH_SACH_HOC_SINH',
    rules: 'NOI_QUY_NHA_TRUONG',
  };

  const studentsRes = await fetchGoogleSheetCsvClient(
    sheetId,
    sheetNames.students,
    config.studentsSheetUrl || config.sheetUrl
  );

  const rulesRes = await fetchGoogleSheetCsvClient(
    sheetId,
    sheetNames.rules,
    config.rulesSheetUrl || config.sheetUrl
  );

  let parsedStudents: ClassStudent[] | undefined = undefined;
  let parsedRules: SchoolRuleItem[] | undefined = undefined;

  if (studentsRes.success && studentsRes.csv) {
    const list = parseStudentsCsv(studentsRes.csv);
    if (list.length > 0) parsedStudents = list;
  }

  if (rulesRes.success && rulesRes.csv) {
    const list = parseRulesCsv(rulesRes.csv);
    if (list.length > 0) parsedRules = list;
  }

  const isLive = Boolean(parsedStudents || parsedRules);
  const message = isLive
    ? `Đồng bộ trực tuyến thành công từ Google Sheet! Cập nhật ${parsedStudents?.length || 0} học sinh và ${parsedRules?.length || 0} nội quy.`
    : `Dữ liệu Google Sheet mô phỏng chuẩn hóa của Lớp 12A16 (Cô Phương Linh) đã sẵn sàng. Khi liên kết Google Sheet thật, dữ liệu sẽ tự động cập nhật thời gian thực.`;

  return {
    success: true,
    isLive,
    students: parsedStudents,
    rules: parsedRules,
    message,
    timestamp,
  };
}
