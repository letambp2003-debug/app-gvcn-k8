/**
 * ============================================================================
 * HỆ THỐNG QUẢN LÝ LỚP HỌC TOÀN TRƯỜNG - BACKEND GOOGLE APPS SCRIPT
 * Phiên bản: 5.4 Cloud Edition (Google Sheets Backend)
 * Tác giả: AI Studio Pro / Hệ thống Quản trị THCS
 * ============================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (3 BƯỚC):
 * 1. Tạo 1 file Google Sheets mới trên Google Drive (Ví dụ đặt tên: 'CSDL_QuanLyLopHoc_ToanTruong').
 * 2. Vào menu 'Tiện ích mở rộng' (Extensions) -> 'Apps Script'.
 * 3. Xóa hết mã cũ trong Code.gs, dán toàn bộ nội dung file này vào và bấm 'Lưu' (Ctrl + S).
 * 4. Chọn hàm 'initialSetup' trên thanh công cụ và bấm 'Chạy' (Run).
 *    (Cấp quyền truy cập cho Script khi Google hỏi).
 * 5. Bấm nút 'Triển khai' (Deploy) -> 'Lượt triển khai mới' (New deployment):
 *    - Loại: 'Ứng dụng web' (Web app)
 *    - Thực thi dưới dạng: 'Tôi' (Me)
 *    - Ai có quyền truy cập: 'Bất kỳ ai' (Anyone)
 *    -> Bấm 'Triển khai' và copy đường dẫn Web App URL dán vào Webapp.
 * ============================================================================
 */

// Tên các bảng (Sheets) trong CSDL
const SHEETS = {
  USERS: 'TaiKhoan',
  CLASSES: 'LopHoc',
  STUDENTS: 'HocSinh',
  ATTENDANCE: 'DiemDanh',
  COMPETITION: 'ThiDua',
  CONFIG: 'CauHinh'
};

/**
 * HÀM KHỞI TẠO HỆ THỐNG LẦN ĐẦU (Chạy 1 lần duy nhất để tạo cấu trúc bảng mẫu)
 */
function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Tài Khoản
  let userSheet = ss.getSheetByName(SHEETS.USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEETS.USERS);
    userSheet.appendRow(['username', 'password', 'fullname', 'role', 'assigned_class', 'status']);
    // Tài khoản Admin mẫu & GVCN mẫu
    userSheet.appendRow(['admin', 'admin123', 'Ban Giám Hiệu', 'admin', '*', 'active']);
    userSheet.appendRow(['gv_8a6', '123456', 'Lê Tâm (GVCN 8A6)', 'teacher', 'class_8a6', 'active']);
    userSheet.appendRow(['gv_8a1', '123456', 'Nguyễn Văn A (GVCN 8A1)', 'teacher', 'class_8a1', 'active']);
    formatHeader(userSheet);
  }

  // 2. Sheet Lớp Học
  let classSheet = ss.getSheetByName(SHEETS.CLASSES);
  if (!classSheet) {
    classSheet = ss.insertSheet(SHEETS.CLASSES);
    classSheet.appendRow(['class_id', 'class_name', 'grade', 'academic_year', 'teacher_name']);
    classSheet.appendRow(['class_8a6', '8A6', 'Khối 8', '2026 - 2027', 'Lê Tâm']);
    classSheet.appendRow(['class_8a1', '8A1', 'Khối 8', '2026 - 2027', 'Nguyễn Văn A']);
    formatHeader(classSheet);
  }

  // 3. Sheet Học Sinh (Chuẩn hóa đầy đủ 5 trường: STT, Họ tên, Ngày sinh, Giới tính, CCCD)
  let studentSheet = ss.getSheetByName(SHEETS.STUDENTS);
  if (!studentSheet) {
    studentSheet = ss.insertSheet(SHEETS.STUDENTS);
    studentSheet.appendRow(['id', 'class_id', 'stt', 'fullname', 'dob', 'gender', 'cccd', 'coins', 'note', 'updated_at']);
    // Dữ liệu mẫu 8A6
    studentSheet.appendRow(['s1', 'class_8a6', 1, 'Lê Nguyễn Thùy An', '15/04/2012', 'Nữ', '079312001234', 0, '', new Date().toISOString()]);
    studentSheet.appendRow(['s2', 'class_8a6', 2, 'Lê Phương Tuấn Anh', '20/09/2012', 'Nam', '079212005678', 0, '', new Date().toISOString()]);
    formatHeader(studentSheet);
    // Định dạng cột CCCD là Text để không mất số 0 đầu
    studentSheet.getRange('G:G').setNumberFormat('@');
  }

  // 4. Sheet Điểm Danh
  let attSheet = ss.getSheetByName(SHEETS.ATTENDANCE);
  if (!attSheet) {
    attSheet = ss.insertSheet(SHEETS.ATTENDANCE);
    attSheet.appendRow(['id', 'class_id', 'date', 'student_id', 'status', 'updated_at']);
    formatHeader(attSheet);
  }

  // 5. Sheet Thi Đua Tuần & Nề Nếp
  let compSheet = ss.getSheetByName(SHEETS.COMPETITION);
  if (!compSheet) {
    compSheet = ss.insertSheet(SHEETS.COMPETITION);
    compSheet.appendRow(['id', 'class_id', 'date', 'week_start', 'student_id', 'student_name', 'criterion_id', 'category', 'label', 'points', 'note', 'time']);
    formatHeader(compSheet);
  }

  // 6. Sheet Cấu Hình (Sơ đồ lớp, Thời khóa biểu, Cài đặt)
  let configSheet = ss.getSheetByName(SHEETS.CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEETS.CONFIG);
    configSheet.appendRow(['class_id', 'config_key', 'config_value', 'updated_at']);
    formatHeader(configSheet);
  }

  Logger.log('ĐÃ KHỞI TẠO THÀNH CÔNG HỆ THỐNG CƠ SỞ DỮ LIỆU TOÀN TRƯỜNG!');
}

function formatHeader(sheet) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  header.setBackground('#0d9488')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

/**
 * TIẾP NHẬN REQUEST GET (Kiểm tra trạng thái máy chủ)
 */
function doGet(e) {
  return createJsonResponse({
    status: 'success',
    message: 'API Quản Lý Lớp Học Toàn Trường đang hoạt động tốt!',
    timestamp: new Date().toISOString()
  });
}

/**
 * TIẾP NHẬN TOÀN BỘ REQUEST POST TỪ WEBAPP
 */
function doPost(e) {
  try {
    const rawContent = e.postData ? e.postData.contents : '';
    const payload = JSON.parse(rawContent);
    const action = payload.action;

    switch (action) {
      case 'login':
        return handleLogin(payload);
      case 'get_class_data':
        return handleGetClassData(payload);
      case 'import_students':
        return handleImportStudents(payload);
      case 'save_student':
        return handleSaveStudent(payload);
      case 'delete_student':
        return handleDeleteStudent(payload);
      case 'save_attendance':
        return handleSaveAttendance(payload);
      case 'save_competition_event':
        return handleSaveCompetitionEvent(payload);
      case 'delete_competition_event':
        return handleDeleteCompetitionEvent(payload);
      case 'save_config':
        return handleSaveConfig(payload);
      case 'get_all_classes':
        return handleGetAllClasses(payload);
      default:
        return createJsonResponse({ status: 'error', message: 'Hành động không hợp lệ: ' + action });
    }
  } catch (error) {
    return createJsonResponse({ status: 'error', message: 'Lỗi máy chủ: ' + error.toString() });
  }
}

/**
 * 1. XỬ LÝ ĐĂNG NHẬP
 */
function handleLogin(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  const password = String(payload.password || '').trim();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Chưa khởi tạo bảng tài khoản.' });

  const data = sheet.getDataRange().getValues();
  // Bỏ dòng tiêu đề
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const u = String(row[0]).trim().toLowerCase();
    const p = String(row[1]).trim();
    const fullname = String(row[2]);
    const role = String(row[3]);
    const assignedClass = String(row[4]);
    const status = String(row[5]);

    if (u === username && p === password) {
      if (status !== 'active') {
        return createJsonResponse({ status: 'error', message: 'Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.' });
      }

      // Tạo token session đơn giản
      const token = Utilities.base64Encode(username + ':' + Date.now());

      return createJsonResponse({
        status: 'success',
        message: 'Đăng nhập thành công!',
        user: {
          username: u,
          fullname: fullname,
          role: role,
          assignedClass: assignedClass,
          token: token
        }
      });
    }
  }

  return createJsonResponse({ status: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
}

/**
 * 2. LẤY DỮ LIỆU CỦA LỚP ĐƯỢC PHÂN CÔNG
 */
function handleGetClassData(payload) {
  const classId = payload.classId;
  if (!classId) return createJsonResponse({ status: 'error', message: 'Thiếu classId' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Đọc học sinh của lớp
  const studentSheet = ss.getSheetByName(SHEETS.STUDENTS);
  const students = [];
  if (studentSheet && studentSheet.getLastRow() > 1) {
    const sData = studentSheet.getDataRange().getValues();
    for (let i = 1; i < sData.length; i++) {
      const r = sData[i];
      if (String(r[1]) === classId) {
        students.push({
          id: String(r[0]),
          classId: String(r[1]),
          stt: Number(r[2]) || 0,
          name: String(r[3]),
          dob: formatDobString(r[4]),
          gender: String(r[5]),
          cccd: formatCccdString(r[6]),
          coins: Number(r[7]) || 0,
          note: String(r[8] || '')
        });
      }
    }
    // Sắp xếp theo STT
    students.sort((a, b) => a.stt - b.stt);
  }

  // Đọc điểm danh của lớp
  const attSheet = ss.getSheetByName(SHEETS.ATTENDANCE);
  const attendance = {};
  if (attSheet && attSheet.getLastRow() > 1) {
    const aData = attSheet.getDataRange().getValues();
    for (let i = 1; i < aData.length; i++) {
      const r = aData[i];
      if (String(r[1]) === classId) {
        const dateStr = formatDateStr(r[2]);
        const sid = String(r[3]);
        const status = String(r[4]);
        const key = classId + '_' + dateStr;
        if (!attendance[key]) attendance[key] = {};
        attendance[key][sid] = status;
      }
    }
  }

  // Đọc thi đua tuần của lớp
  const compSheet = ss.getSheetByName(SHEETS.COMPETITION);
  const events = [];
  if (compSheet && compSheet.getLastRow() > 1) {
    const cData = compSheet.getDataRange().getValues();
    for (let i = 1; i < cData.length; i++) {
      const r = cData[i];
      if (String(r[1]) === classId) {
        events.push({
          id: String(r[0]),
          classId: String(r[1]),
          date: formatDateStr(r[2]),
          weekStart: formatDateStr(r[3]),
          studentId: String(r[4]),
          studentName: String(r[5]),
          criterionId: String(r[6]),
          category: String(r[7]),
          label: String(r[8]),
          points: Number(r[9]) || 0,
          note: String(r[10] || ''),
          time: String(r[11])
        });
      }
    }
  }

  // Đọc cấu hình lớp (sơ đồ, thời khóa biểu)
  const configSheet = ss.getSheetByName(SHEETS.CONFIG);
  const configs = {};
  if (configSheet && configSheet.getLastRow() > 1) {
    const cfgData = configSheet.getDataRange().getValues();
    for (let i = 1; i < cfgData.length; i++) {
      const r = cfgData[i];
      if (String(r[0]) === classId) {
        try {
          configs[String(r[1])] = JSON.parse(r[2]);
        } catch(e) {
          configs[String(r[1])] = r[2];
        }
      }
    }
  }

  return createJsonResponse({
    status: 'success',
    classId: classId,
    students: students,
    attendance: attendance,
    events: events,
    configs: configs
  });
}

/**
 * 3. IMPORT HỌC SINH TỪ EXCEL (GHI ĐÈ HOẶC THÊM MỚI)
 */
function handleImportStudents(payload) {
  const classId = payload.classId;
  const list = payload.students;
  const mode = payload.mode || 'overwrite'; // 'overwrite' hoặc 'append'

  if (!classId || !Array.isArray(list)) {
    return createJsonResponse({ status: 'error', message: 'Dữ liệu không hợp lệ.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.STUDENTS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Không tìm thấy Sheet học sinh.' });

  const data = sheet.getDataRange().getValues();
  const nowStr = new Date().toISOString();

  if (mode === 'overwrite') {
    // Xóa các dòng cũ của lớp này
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][1]) === classId) {
        sheet.deleteRow(i + 1);
      }
    }
  }

  // Thêm các học sinh mới
  const rowsToAdd = [];
  list.forEach((st, idx) => {
    const id = st.id || ('s_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6));
    const stt = Number(st.stt) || (idx + 1);
    const name = String(st.name || st.fullname || '').trim();
    const dob = formatDobString(st.dob || '');
    const gender = String(st.gender || '').trim();
    // Đảm bảo CCCD dạng chuỗi giữ số 0
    let cccd = String(st.cccd || '').trim();
    if (cccd.length > 0 && cccd.length < 12 && /^\d+$/.test(cccd)) {
      cccd = cccd.padStart(12, '0');
    }
    const coins = Number(st.coins) || 0;
    const note = String(st.note || '').trim();

    rowsToAdd.push([id, classId, stt, name, dob, gender, "'" + cccd, coins, note, nowStr]);
  });

  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
  }

  return createJsonResponse({
    status: 'success',
    message: 'Đã nhập thành công ' + rowsToAdd.length + ' học sinh!',
    count: rowsToAdd.length
  });
}

/**
 * 4. LƯU / CẬP NHẬT 1 HỌC SINH
 */
function handleSaveStudent(payload) {
  const st = payload.student;
  const classId = payload.classId;
  if (!st || !classId) return createJsonResponse({ status: 'error', message: 'Thiếu thông tin' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  const nowStr = new Date().toISOString();

  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === st.id && String(data[i][1]) === classId) {
      targetRow = i + 1;
      break;
    }
  }

  let cccd = String(st.cccd || '').trim();
  if (cccd.length > 0 && cccd.length < 12 && /^\d+$/.test(cccd)) {
    cccd = cccd.padStart(12, '0');
  }

  const rowValues = [
    st.id || ('s_' + Date.now().toString(36)),
    classId,
    Number(st.stt) || 1,
    String(st.name || '').trim(),
    formatDobString(st.dob || ''),
    String(st.gender || ''),
    "'" + cccd,
    Number(st.coins) || 0,
    String(st.note || ''),
    nowStr
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return createJsonResponse({ status: 'success', message: 'Đã lưu học sinh thành công!' });
}

/**
 * 5. XÓA HỌC SINH
 */
function handleDeleteStudent(payload) {
  const studentId = payload.studentId;
  const classId = payload.classId;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === studentId && String(data[i][1]) === classId) {
      sheet.deleteRow(i + 1);
      return createJsonResponse({ status: 'success', message: 'Đã xóa học sinh!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Không tìm thấy học sinh cần xóa' });
}

/**
 * 6. LƯU ĐIỂM DANH
 */
function handleSaveAttendance(payload) {
  const classId = payload.classId;
  const date = formatDateStr(payload.date);
  const records = payload.records; // { studentId: 'present' / 'late' / ... }

  if (!classId || !date || !records) {
    return createJsonResponse({ status: 'error', message: 'Thiếu dữ liệu điểm danh.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.ATTENDANCE);
  const data = sheet.getDataRange().getValues();
  const nowStr = new Date().toISOString();

  // Xóa các bản ghi cũ của ngày và lớp đó
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][1]) === classId && formatDateStr(data[i][2]) === date) {
      sheet.deleteRow(i + 1);
    }
  }

  // Ghi các bản ghi mới
  const rows = [];
  Object.entries(records).forEach(([sid, status]) => {
    if (status && status !== 'unmarked') {
      const id = 'att_' + classId + '_' + date + '_' + sid;
      rows.push([id, classId, date, sid, status, nowStr]);
    }
  });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }

  return createJsonResponse({ status: 'success', message: 'Đã lưu điểm danh ngày ' + date });
}

/**
 * 7. LƯU GHI NHẬN NỀ NẾP THI ĐUA
 */
function handleSaveCompetitionEvent(payload) {
  const ev = payload.event;
  if (!ev || !ev.classId) return createJsonResponse({ status: 'error', message: 'Thiếu dữ liệu nề nếp.' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COMPETITION);
  const id = ev.id || ('ce_' + Date.now().toString(36));

  sheet.appendRow([
    id,
    ev.classId,
    formatDateStr(ev.date),
    formatDateStr(ev.weekStart),
    ev.studentId,
    ev.studentName,
    ev.criterionId,
    ev.category,
    ev.label,
    Number(ev.points) || 0,
    ev.note || '',
    ev.time || new Date().toISOString()
  ]);

  return createJsonResponse({ status: 'success', message: 'Đã lưu ghi nhận thi đua!', id: id });
}

/**
 * 8. XÓA GHI NHẬN NỀ NẾP THI ĐUA
 */
function handleDeleteCompetitionEvent(payload) {
  const id = payload.id;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COMPETITION);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      sheet.deleteRow(i + 1);
      return createJsonResponse({ status: 'success', message: 'Đã xóa ghi nhận thi đua!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Không tìm thấy bản ghi cần xóa.' });
}

/**
 * 9. LƯU CẤU HÌNH (SƠ ĐỒ, THỜI KHÓA BIỂU...)
 */
function handleSaveConfig(payload) {
  const classId = payload.classId;
  const key = payload.key;
  const value = typeof payload.value === 'object' ? JSON.stringify(payload.value) : String(payload.value);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.CONFIG);
  const data = sheet.getDataRange().getValues();
  const nowStr = new Date().toISOString();

  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === classId && String(data[i][1]) === key) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow > 0) {
    sheet.getRange(targetRow, 3, 1, 2).setValues([[value, nowStr]]);
  } else {
    sheet.appendRow([classId, key, value, nowStr]);
  }

  return createJsonResponse({ status: 'success', message: 'Đã lưu cấu hình!' });
}

/**
 * 10. LẤY DANH SÁCH TẤT CẢ LỚP HỌC (DÀNH CHO ADMIN)
 */
function handleGetAllClasses(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.CLASSES);
  const classes = [];
  if (sheet && sheet.getLastRow() > 1) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const r = data[i];
      classes.push({
        id: String(r[0]),
        name: String(r[1]),
        grade: String(r[2]),
        year: String(r[3]),
        teacherName: String(r[4] || '')
      });
    }
  }
  return createJsonResponse({ status: 'success', classes: classes });
}

/**
 * HÀM TIỆN ÍCH TRỢ GIÚP
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDateStr(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const z = n => String(n).padStart(2, '0');
    return val.getFullYear() + '-' + z(val.getMonth() + 1) + '-' + z(val.getDate());
  }
  const s = String(val).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[0];
  return s;
}

function formatDobString(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const z = n => String(n).padStart(2, '0');
    return `${z(val.getDate())}/${z(val.getMonth() + 1)}/${val.getFullYear()}`;
  }
  const s = String(val).trim();
  return s;
}

function formatCccdString(val) {
  if (!val) return '';
  let s = String(val).trim();
  if (s.startsWith("'")) s = s.slice(1);
  if (s.length > 0 && s.length < 12 && /^\d+$/.test(s)) {
    s = s.padStart(12, '0');
  }
  return s;
}
