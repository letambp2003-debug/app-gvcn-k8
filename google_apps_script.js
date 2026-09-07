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
  
  // 1. Sheet Tài Khoản (Bổ sung assigned_group cho Tổ Trưởng)
  let userSheet = ss.getSheetByName(SHEETS.USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEETS.USERS);
    userSheet.appendRow(['username', 'password', 'fullname', 'role', 'assigned_class', 'assigned_group', 'status']);
    // Tài khoản Admin mẫu & GVCN mẫu
    userSheet.appendRow(['admin', 'admin123', 'Ban Giám Hiệu', 'admin', '*', '*', 'active']);
    userSheet.appendRow(['gv_8a6', '123456', 'Lê Tâm (GVCN 8A6)', 'teacher', 'class_8a6', '*', 'active']);
    userSheet.appendRow(['gv_8a1', '123456', 'Nguyễn Văn A (GVCN 8A1)', 'teacher', 'class_8a1', '*', 'active']);
    // Tài khoản Tổ Trưởng mẫu lớp 8A6 (Mã PIN mặc định: 1234)
    userSheet.appendRow(['totruong_8a6_t1', '1234', 'Tổ Trưởng Tổ 1 (8A6)', 'group_leader', 'class_8a6', 'Tổ 1', 'active']);
    userSheet.appendRow(['totruong_8a6_t2', '1234', 'Tổ Trưởng Tổ 2 (8A6)', 'group_leader', 'class_8a6', 'Tổ 2', 'active']);
    userSheet.appendRow(['totruong_8a6_t3', '1234', 'Tổ Trưởng Tổ 3 (8A6)', 'group_leader', 'class_8a6', 'Tổ 3', 'active']);
    userSheet.appendRow(['totruong_8a6_t4', '1234', 'Tổ Trưởng Tổ 4 (8A6)', 'group_leader', 'class_8a6', 'Tổ 4', 'active']);
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

  // 5. Sheet Thi Đua Tuần & Nề Nếp (Có cột status chờ duyệt và submitted_by)
  let compSheet = ss.getSheetByName(SHEETS.COMPETITION);
  if (!compSheet) {
    compSheet = ss.insertSheet(SHEETS.COMPETITION);
    compSheet.appendRow(['id', 'class_id', 'date', 'week_start', 'student_id', 'student_name', 'criterion_id', 'category', 'label', 'points', 'note', 'time', 'status', 'submitted_by']);
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
      case 'approve_competition_events':
        return handleApproveCompetitionEvents(payload);
      case 'get_group_pins':
        return handleGetGroupPins(payload);
      case 'update_group_pins':
        return handleUpdateGroupPins(payload);
      case 'save_config':
        return handleSaveConfig(payload);
      case 'get_all_classes':
        return handleGetAllClasses(payload);
      case 'import_classes':
        return handleImportClasses(payload);
      case 'save_class':
        return handleSaveClass(payload);
      case 'delete_class':
        return handleDeleteClass(payload);
      case 'get_all_accounts':
        return handleGetAllAccounts(payload);
      case 'save_account':
        return handleSaveAccount(payload);
      case 'update_teacher_password':
        return handleUpdateTeacherPassword(payload);
      case 'assign_teacher_to_class':
        return handleAssignTeacherToClass(payload);
      case 'delete_account':
        return handleDeleteAccount(payload);
      default:
        return createJsonResponse({ status: 'error', message: 'Hành động không hợp lệ: ' + action });
    }
  } catch (error) {
    return createJsonResponse({ status: 'error', message: 'Lỗi máy chủ: ' + error.toString() });
  }
}

/**
 * 1. XỬ LÝ ĐĂNG NHẬP (HỖ TRỢ ADMIN, GVCN & TỔ TRƯỞNG BẰNG MÃ PIN)
 */
function handleLogin(payload) {
  const isPin = !!payload.isPinLogin;
  const username = String(payload.username || '').trim().toLowerCase();
  const password = String(payload.password || payload.pin || '').trim();
  const targetClass = String(payload.targetClass || payload.classId || '').trim();
  const targetGroup = String(payload.targetGroup || '').trim();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Chưa khởi tạo bảng tài khoản.' });

  // 1.1 Nếu là đăng nhập bằng mã PIN dành cho Tổ Trưởng
  if (isPin) {
    if (targetClass) ensureGroupLeaders(targetClass);
    const refreshedData = sheet.getDataRange().getValues();
    for (let i = 1; i < refreshedData.length; i++) {
      const row = refreshedData[i];
      let p = String(row[1] || '').trim();
      if (p.startsWith("'")) p = p.slice(1);
      const fullname = String(row[2]);
      const role = String(row[3]);
      const assignedClass = String(row[4]);
      const assignedGroup = String(row[5] || '');
      const status = String(row[6] || row[5]);

      if (role === 'group_leader' && assignedClass === targetClass && assignedGroup === targetGroup && p === password) {
        if (status === 'locked') {
          return createJsonResponse({ status: 'error', message: 'Tài khoản tổ trưởng đang bị khóa.' });
        }
        const token = Utilities.base64Encode('pin:' + row[0] + ':' + Date.now());
        return createJsonResponse({
          status: 'success',
          message: 'Đăng nhập Tổ trưởng thành công!',
          user: {
            username: String(row[0]),
            fullname: fullname,
            role: 'group_leader',
            assignedClass: assignedClass,
            assignedGroup: assignedGroup,
            token: token
          }
        });
      }
    }
    return createJsonResponse({ status: 'error', message: 'Mã PIN không chính xác cho ' + targetGroup + ' (' + targetClass + ').' });
  }

  // 1.2 Đăng nhập chuẩn (Username & Password) cho Admin, GVCN, hoặc Tổ Trưởng
  const cleanInput = username.replace(/^gv[_]?/, '').replace(/^class[_]?/, '');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const u = String(row[0] || '').trim().toLowerCase();
    let p = String(row[1] || '').trim();
    if (p.startsWith("'")) p = p.slice(1);
    const fullname = String(row[2]);
    const role = String(row[3]);
    const assignedClass = String(row[4]);
    const assignedGroup = String(row[5] || '*');
    const status = String(row[6] || row[5]);

    const cleanU = u.replace(/^gv[_]?/, '').replace(/^class[_]?/, '');
    const isUserMatch = (u === username) || (cleanInput && cleanU === cleanInput && (role === 'teacher' || role === 'admin'));

    if (isUserMatch && p === password) {
      if (status === 'locked') {
        return createJsonResponse({ status: 'error', message: 'Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.' });
      }

      const token = Utilities.base64Encode(u + ':' + Date.now());

      return createJsonResponse({
        status: 'success',
        message: 'Đăng nhập thành công!',
        user: {
          username: u,
          fullname: fullname,
          role: role,
          assignedClass: assignedClass,
          assignedGroup: assignedGroup,
          token: token
        }
      });
    }
  }

  return createJsonResponse({ status: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
}

/**
 * 2. LẤY DỮ LIỆU CỦA LỚP ĐƯỢC PHÂN CÔNG (LỌC BẢO MẬT THEO VAI TRÒ)
 */
function handleGetClassData(payload) {
  const classId = payload.classId;
  const userRole = String(payload.role || '');
  const assignedGroup = String(payload.assignedGroup || '');
  if (!classId) return createJsonResponse({ status: 'error', message: 'Thiếu classId' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Đọc cấu hình lớp trước để lấy phân tổ
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

  const groupMap = (configs.groupAssignments && typeof configs.groupAssignments === 'object') ? configs.groupAssignments : {};

  // Đọc học sinh của lớp
  const studentSheet = ss.getSheetByName(SHEETS.STUDENTS);
  let students = [];
  if (studentSheet && studentSheet.getLastRow() > 1) {
    const sData = studentSheet.getDataRange().getValues();
    for (let i = 1; i < sData.length; i++) {
      const r = sData[i];
      if (String(r[1]) === classId) {
        const sid = String(r[0]);
        const sGroup = groupMap[sid] || '';

        // BẢO MẬT CẤP MÁY CHỦ CHO TỔ TRƯỞNG:
        if (userRole === 'group_leader') {
          if (assignedGroup && sGroup && sGroup !== assignedGroup) {
            continue; // Không gửi học sinh ngoài tổ
          }
          // XÓA BỎ HOÀN TOÀN CCCD VÀ NGÀY SINH TRƯỚC KHI TRẢ VỀ CHO HỌC SINH
          students.push({
            id: sid,
            classId: String(r[1]),
            stt: Number(r[2]) || 0,
            name: String(r[3]),
            dob: '', // SECURED
            gender: String(r[5]),
            cccd: '', // SECURED (Không bao giờ lộ số định danh)
            coins: Number(r[7]) || 0,
            note: ''
          });
        } else {
          // Ban Giám Hiệu & GVCN nhận đầy đủ
          students.push({
            id: sid,
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
    }
    students.sort((a, b) => a.stt - b.stt);
  }

  // Đọc điểm danh (Tổ trưởng không cần thông tin chuyên cần nhạy cảm)
  const attSheet = ss.getSheetByName(SHEETS.ATTENDANCE);
  const attendance = {};
  if (userRole !== 'group_leader' && attSheet && attSheet.getLastRow() > 1) {
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

  // Đọc thi đua: Tách thành events (đã duyệt) và pendingEvents (chờ GVCN duyệt)
  const compSheet = ss.getSheetByName(SHEETS.COMPETITION);
  const events = [];
  const pendingEvents = [];
  if (compSheet && compSheet.getLastRow() > 1) {
    const cData = compSheet.getDataRange().getValues();
    for (let i = 1; i < cData.length; i++) {
      const r = cData[i];
      if (String(r[1]) === classId) {
        const sid = String(r[4]);
        const sGroup = groupMap[sid] || '';
        if (userRole === 'group_leader' && assignedGroup && sGroup && sGroup !== assignedGroup) {
          continue;
        }
        const evStatus = String(r[12] || 'approved');
        const evObj = {
          id: String(r[0]),
          classId: String(r[1]),
          date: formatDateStr(r[2]),
          weekStart: formatDateStr(r[3]),
          studentId: sid,
          studentName: String(r[5]),
          criterionId: String(r[6]),
          category: String(r[7]),
          label: String(r[8]),
          points: Number(r[9]) || 0,
          note: String(r[10] || ''),
          time: String(r[11]),
          status: evStatus,
          submittedBy: String(r[13] || 'gv')
        };
        if (evStatus === 'pending') {
          pendingEvents.push(evObj);
        } else if (evStatus !== 'rejected') {
          events.push(evObj);
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
    pendingEvents: pendingEvents,
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
 * 7. LƯU GHI NHẬN NỀ NẾP THI ĐUA (HỖ TRỢ TRẠNG THÁI CHỜ DUYỆT TỪ TỔ TRƯỞNG)
 */
function handleSaveCompetitionEvent(payload) {
  const ev = payload.event;
  if (!ev || !ev.classId) return createJsonResponse({ status: 'error', message: 'Thiếu dữ liệu nề nếp.' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COMPETITION);
  const id = ev.id || ('ce_' + Date.now().toString(36));

  const role = String(payload.role || '');
  const username = String(payload.username || '');
  // Nếu là tổ trưởng gửi lên thì mặc định là 'pending' chờ GVCN duyệt, GVCN/Admin tạo thì 'approved' ngay
  const status = ev.status || (role === 'group_leader' ? 'pending' : 'approved');
  const submittedBy = ev.submittedBy || username || (role === 'group_leader' ? 'totruong' : 'gv');

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
    ev.time || new Date().toISOString(),
    status,
    submittedBy
  ]);

  return createJsonResponse({
    status: 'success',
    message: status === 'pending' ? 'Đã gửi ghi nhận điểm, đang chờ GVCN duyệt!' : 'Đã lưu ghi nhận thi đua!',
    id: id,
    eventStatus: status
  });
}

/**
 * 8. XÓA GHI NHẬN NỀ NẾP THI ĐUA (KIỂM TRA BẢO MẬT THEO VAI TRÒ)
 */
function handleDeleteCompetitionEvent(payload) {
  const id = payload.id;
  const role = String(payload.role || '');
  const username = String(payload.username || '');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COMPETITION);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      const rowStatus = String(data[i][12] || 'approved');
      const submittedBy = String(data[i][13] || '');
      // Nếu là tổ trưởng thì chỉ được rút lại bản ghi do chính tổ mình gửi khi còn ở trạng thái pending
      if (role === 'group_leader') {
        if (rowStatus !== 'pending' || (submittedBy && username && submittedBy !== username)) {
          return createJsonResponse({ status: 'error', message: 'Tổ trưởng chỉ được rút lại bản ghi đang chờ duyệt của chính mình.' });
        }
      }
      sheet.deleteRow(i + 1);
      return createJsonResponse({ status: 'success', message: 'Đã xóa ghi nhận thi đua!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Không tìm thấy bản ghi cần xóa.' });
}

/**
 * 8.1 PHÊ DUYỆT HOẶC TỪ CHỐI GHI NHẬN THI ĐUA TỪ TỔ TRƯỞNG (DÀNH CHO GVCN / ADMIN)
 */
function handleApproveCompetitionEvents(payload) {
  const eventIds = Array.isArray(payload.eventIds) ? payload.eventIds : (payload.id ? [payload.id] : []);
  const actionType = String(payload.decision || 'approve'); // 'approve' hoặc 'reject'
  const newStatus = actionType === 'reject' ? 'rejected' : 'approved';

  if (eventIds.length === 0) {
    return createJsonResponse({ status: 'error', message: 'Chưa chọn bản ghi nào để phê duyệt.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COMPETITION);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Không tìm thấy bảng ThiDua.' });

  const data = sheet.getDataRange().getValues();
  let updatedCount = 0;

  for (let i = 1; i < data.length; i++) {
    const rowId = String(data[i][0]);
    if (eventIds.includes(rowId)) {
      // Cột 13 (index 12): status
      sheet.getRange(i + 1, 13).setValue(newStatus);
      updatedCount++;
    }
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã ${newStatus === 'approved' ? 'phê duyệt' : 'từ chối'} ${updatedCount} bản ghi nề nếp!`,
    updatedCount: updatedCount,
    newStatus: newStatus
  });
}

/**
 * 8.2 LẤY DANH SÁCH MÃ PIN 4 TỔ TRƯỞNG CỦA LỚP (CHỈ GVCN CỦA LỚP ĐÓ HOẶC ADMIN ĐƯỢC XEM)
 */
function handleGetGroupPins(payload) {
  const classId = payload.classId;
  if (!classId) return createJsonResponse({ status: 'error', message: 'Thiếu classId' });

  ensureGroupLeaders(classId);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();

  const pins = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const username = String(row[0]);
    let pin = String(row[1] || '').trim();
    if (pin.startsWith("'")) pin = pin.slice(1);
    const fullname = String(row[2]);
    const role = String(row[3]);
    const assignedClass = String(row[4]);
    const assignedGroup = String(row[5] || '');
    const status = String(row[6] || 'active');

    if (role === 'group_leader' && assignedClass === classId) {
      pins.push({
        username: username,
        group: assignedGroup,
        pin: pin,
        fullname: fullname,
        status: status
      });
    }
  }

  pins.sort((a, b) => a.group.localeCompare(b.group, 'vi'));

  return createJsonResponse({
    status: 'success',
    classId: classId,
    pins: pins
  });
}

/**
 * 8.3 CẬP NHẬT MÃ PIN CHO TỔ TRƯỞNG (GVCN / ADMIN ĐỔI PIN)
 */
function handleUpdateGroupPins(payload) {
  const classId = payload.classId;
  const updates = payload.updates; // Mảng [{ group: 'Tổ 1', pin: '1234' }, ...] hoặc Object { 'Tổ 1': '1234' }
  if (!classId || !updates) return createJsonResponse({ status: 'error', message: 'Thiếu thông tin đổi PIN' });

  ensureGroupLeaders(classId);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();

  const updateMap = {};
  if (Array.isArray(updates)) {
    updates.forEach(u => { if (u.group && u.pin) updateMap[u.group] = String(u.pin).trim(); });
  } else if (typeof updates === 'object') {
    Object.entries(updates).forEach(([k, v]) => { updateMap[k] = String(v).trim(); });
  }

  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const role = String(row[3]);
    const assignedClass = String(row[4]);
    const assignedGroup = String(row[5] || '');

    if (role === 'group_leader' && assignedClass === classId && updateMap[assignedGroup]) {
      const newPin = updateMap[assignedGroup];
      sheet.getRange(i + 1, 2).setNumberFormat('@').setValue(String(newPin));
      count++;
    }
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã cập nhật mã PIN cho ${count} tổ trưởng!`,
    updatedCount: count
  });
}

/**
 * 8.4 ĐẢM BẢO TỰ ĐỘNG TẠO 4 TÀI KHOẢN TỔ TRƯỞNG NẾU LỚP CHƯA CÓ
 */
function ensureGroupLeaders(classId) {
  if (!classId) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const existingGroups = new Set();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[3]) === 'group_leader' && String(row[4]) === classId) {
      existingGroups.add(String(row[5] || ''));
    }
  }

  const cleanClassSuffix = classId.replace(/^class_/, '').toLowerCase();
  const rowsToAdd = [];
  ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].forEach((grp, idx) => {
    if (!existingGroups.has(grp)) {
      const tNum = idx + 1;
      const u = `totruong_${cleanClassSuffix}_t${tNum}`;
      rowsToAdd.push([u, '1234', `Tổ Trưởng ${grp} (${cleanClassSuffix.toUpperCase()})`, 'group_leader', classId, grp, 'active']);
    }
  });

  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
  }
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
 * 11. NHẬP NHIỀU LỚP HỌC TỪ EXCEL (ADMIN)
 * Hỗ trợ tạo hàng loạt lớp học từ mẫu Excel STT | LỚP | GVCN
 */
function handleImportClasses(payload) {
  const list = payload.classes || [];
  const mode = payload.mode || 'merge'; // 'merge' hoặc 'overwrite'
  if (!list.length) {
    return createJsonResponse({ status: 'error', message: 'Danh sách lớp học trống!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.CLASSES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.CLASSES);
    sheet.appendRow(['class_id', 'class_name', 'grade', 'academic_year', 'teacher_name']);
    formatHeader(sheet);
  }

  let userSheet = ss.getSheetByName(SHEETS.USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEETS.USERS);
    userSheet.appendRow(['username', 'password', 'fullname', 'role', 'assigned_class', 'assigned_group', 'status']);
    formatHeader(userSheet);
  }

  // Nếu mode === 'overwrite', xóa các dòng lớp học cũ (giữ lại header)
  if (mode === 'overwrite') {
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
  }

  const existingData = sheet.getDataRange().getValues();
  const classRowMap = {}; // class_id -> rowIndex (1-indexed)
  for (let i = 1; i < existingData.length; i++) {
    const cid = String(existingData[i][0]).trim();
    if (cid) classRowMap[cid] = i + 1;
  }

  const rowsToAdd = [];
  let updatedCount = 0;
  let addedCount = 0;

  list.forEach(item => {
    const rawName = String(item.name || '').trim();
    if (!rawName) return;
    const cleanSuffix = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const classId = item.id || ('class_' + cleanSuffix);
    const grade = item.grade || inferGradeFromName(rawName);
    const year = item.year || '2026 - 2027';
    const teacherName = String(item.teacherName || '').trim();

    if (classRowMap[classId]) {
      // Cập nhật lớp đã có
      const rowIdx = classRowMap[classId];
      sheet.getRange(rowIdx, 1, 1, 5).setValues([[classId, rawName, grade, year, teacherName]]);
      updatedCount++;
    } else {
      // Thêm lớp mới
      rowsToAdd.push([classId, rawName, grade, year, teacherName]);
      addedCount++;
    }

    // Tự động tạo/cập nhật tài khoản GVCN trong TaiKhoan
    ensureTeacherAccount(classId, rawName, teacherName);

    // Tự động tạo 4 tài khoản Tổ trưởng cho lớp
    ensureGroupLeaders(classId);
  });

  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, 5).setValues(rowsToAdd);
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã nạp thành công: ${addedCount} lớp mới, cập nhật ${updatedCount} lớp!`,
    addedCount: addedCount,
    updatedCount: updatedCount,
    total: addedCount + updatedCount
  });
}

/**
 * Đảm bảo tài khoản GVCN được tạo hoặc cập nhật khi thêm/sửa lớp
 */
function ensureTeacherAccount(classId, className, teacherName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return;

  const cleanSuffix = classId.replace(/^class_/, '').toLowerCase();
  const username = `gv_${cleanSuffix}`;
  const defaultDisplayName = teacherName ? `${teacherName} (GVCN ${className})` : `GVCN ${className}`;

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username.toLowerCase() || 
       (String(data[i][3]) === 'teacher' && String(data[i][4]) === classId)) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    if (teacherName) {
      sheet.getRange(foundRow, 3).setValue(defaultDisplayName);
    }
  } else {
    // Tạo tài khoản mới: username, password, fullname, role, assigned_class, assigned_group, status
    sheet.appendRow([username, '123456', defaultDisplayName, 'teacher', classId, '*', 'active']);
    sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('@');
  }
}

/**
 * 12. LƯU / CẬP NHẬT 1 LỚP HỌC ĐƠN LẺ
 */
function handleSaveClass(payload) {
  const classData = payload.classData || payload;
  const rawName = String(classData.name || '').trim();
  if (!rawName) {
    return createJsonResponse({ status: 'error', message: 'Tên lớp không được để trống!' });
  }

  const cleanSuffix = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const classId = classData.id || ('class_' + cleanSuffix);
  const grade = classData.grade || inferGradeFromName(rawName);
  const year = classData.year || '2026 - 2027';
  const teacherName = String(classData.teacherName || '').trim();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.CLASSES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.CLASSES);
    sheet.appendRow(['class_id', 'class_name', 'grade', 'academic_year', 'teacher_name']);
    formatHeader(sheet);
  }

  const data = sheet.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === classId) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, 5).setValues([[classId, rawName, grade, year, teacherName]]);
  } else {
    sheet.appendRow([classId, rawName, grade, year, teacherName]);
  }

  ensureTeacherAccount(classId, rawName, teacherName);
  ensureGroupLeaders(classId);

  return createJsonResponse({
    status: 'success',
    message: `Đã lưu lớp ${rawName} thành công!`,
    class: { id: classId, name: rawName, grade: grade, year: year, teacherName: teacherName }
  });
}

/**
 * 13. XÓA 1 LỚP HỌC
 */
function handleDeleteClass(payload) {
  const classId = payload.classId;
  if (!classId) {
    return createJsonResponse({ status: 'error', message: 'Thiếu mã lớp cần xóa!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.CLASSES);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Không tìm thấy bảng Lớp học!' });
  }

  const data = sheet.getDataRange().getValues();
  let deleted = false;
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === classId) {
      sheet.deleteRow(i + 1);
      deleted = true;
      break;
    }
  }

  return createJsonResponse({
    status: deleted ? 'success' : 'error',
    message: deleted ? 'Đã xóa lớp học thành công!' : 'Không tìm thấy lớp học cần xóa!'
  });
}

/**
 * Tự động đoán khối từ tên lớp (ví dụ: '6A1' -> 'Khối 6', '8A6' -> 'Khối 8', '10A2' -> 'Khối 10')
 */
function inferGradeFromName(name) {
  const m = String(name || '').match(/(\d+)/);
  if (m) {
    return `Khối ${m[1]}`;
  }
  return 'Khối 6';
}

/**
 * 14. LẤY TẤT CẢ TÀI KHOẢN (DÀNH CHO ADMIN)
 */
function handleGetAllAccounts(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Không tìm thấy bảng Tài khoản!' });

  const data = sheet.getDataRange().getValues();
  const accounts = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const username = String(row[0] || '').trim();
    if (!username) continue;
    let pwd = String(row[1] || '').trim();
    if (pwd.startsWith("'")) pwd = pwd.slice(1);
    accounts.push({
      username: username,
      password: pwd,
      fullname: String(row[2] || ''),
      role: String(row[3] || 'teacher'),
      assignedClass: String(row[4] || '*'),
      assignedGroup: String(row[5] || '*'),
      status: String(row[6] || 'active')
    });
  }

  return createJsonResponse({
    status: 'success',
    accounts: accounts,
    total: accounts.length
  });
}

/**
 * 15. LƯU / CẬP NHẬT TÀI KHOẢN (ADMIN)
 */
function handleSaveAccount(payload) {
  const acc = payload.accountData || payload;
  const username = String(acc.username || '').trim().toLowerCase();
  if (!username) {
    return createJsonResponse({ status: 'error', message: 'Tên đăng nhập không được để trống!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.USERS);
    sheet.appendRow(['username', 'password', 'fullname', 'role', 'assigned_class', 'assigned_group', 'status']);
    formatHeader(sheet);
  }

  const fullname = String(acc.fullname || username);
  const role = String(acc.role || 'teacher');
  const assignedClass = String(acc.assignedClass || '*');
  const assignedGroup = String(acc.assignedGroup || '*');
  const status = String(acc.status || 'active');
  let password = String(acc.password || '').trim();

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === username) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 3).setValue(fullname);
    sheet.getRange(foundRow, 4).setValue(role);
    sheet.getRange(foundRow, 5).setValue(assignedClass);
    sheet.getRange(foundRow, 6).setValue(assignedGroup);
    sheet.getRange(foundRow, 7).setValue(status);
    if (password) {
      sheet.getRange(foundRow, 2).setNumberFormat('@').setValue(String(password));
    }
  } else {
    if (!password) password = '123456';
    sheet.appendRow([username, String(password), fullname, role, assignedClass, assignedGroup, status]);
    sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('@');
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã lưu tài khoản ${username} thành công!`,
    account: { username, fullname, role, assignedClass, assignedGroup, status }
  });
}

/**
 * 16. CẬP NHẬT MẬT KHẨU GIÁO VIÊN (ADMIN)
 */
function handleUpdateTeacherPassword(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  let newPassword = String(payload.newPassword || payload.password || '').trim();
  if (!username) {
    return createJsonResponse({ status: 'error', message: 'Thiếu tên đăng nhập!' });
  }
  if (!newPassword) {
    return createJsonResponse({ status: 'error', message: 'Mật khẩu mới không được để trống!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Không tìm thấy bảng Tài khoản!' });

  const data = sheet.getDataRange().getValues();
  let updated = false;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === username) {
      sheet.getRange(i + 1, 2).setNumberFormat('@').setValue(String(newPassword));
      updated = true;
      break;
    }
  }

  // Tự động tạo mới tài khoản nếu chưa có trên Sheet
  if (!updated) {
    const fullname = String(payload.fullname || username);
    const role = String(payload.role || 'teacher');
    const assignedClass = String(payload.assignedClass || '*');
    const assignedGroup = String(payload.assignedGroup || '*');
    sheet.appendRow([username, String(newPassword), fullname, role, assignedClass, assignedGroup, 'active']);
    sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('@').setValue(String(newPassword));
    updated = true;
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã cập nhật mật khẩu cho tài khoản ${username} thành công!`
  });
}

/**
 * 17. PHÂN CÔNG GIÁO VIÊN CHỦ NHIỆM CHO LỚP (ADMIN)
 */
function handleAssignTeacherToClass(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  const classId = String(payload.classId || '').trim();
  const teacherName = String(payload.teacherName || '').trim();

  if (!classId) {
    return createJsonResponse({ status: 'error', message: 'Thiếu mã lớp học để phân công!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEETS.USERS);
  const classSheet = ss.getSheetByName(SHEETS.CLASSES);

  // Cập nhật assigned_class trong TaiKhoan
  if (userSheet && username) {
    const userData = userSheet.getDataRange().getValues();
    for (let i = 1; i < userData.length; i++) {
      if (String(userData[i][0]).trim().toLowerCase() === username) {
        userSheet.getRange(i + 1, 5).setValue(classId);
        break;
      }
    }
  }

  // Cập nhật teacher_name trong LopHoc
  if (classSheet) {
    const classData = classSheet.getDataRange().getValues();
    for (let i = 1; i < classData.length; i++) {
      if (String(classData[i][0]).trim() === classId) {
        if (teacherName) {
          classSheet.getRange(i + 1, 5).setValue(teacherName);
        }
        break;
      }
    }
  }

  return createJsonResponse({
    status: 'success',
    message: `Đã phân công GVCN thành công cho lớp ${classId}!`
  });
}

/**
 * 18. XÓA TÀI KHOẢN (ADMIN)
 */
function handleDeleteAccount(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  if (!username) {
    return createJsonResponse({ status: 'error', message: 'Thiếu tên đăng nhập cần xóa!' });
  }
  if (username === 'admin') {
    return createJsonResponse({ status: 'error', message: 'Không thể xóa tài khoản Quản trị viên (admin)!' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return createJsonResponse({ status: 'error', message: 'Không tìm thấy bảng Tài khoản!' });

  const data = sheet.getDataRange().getValues();
  let deleted = false;
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]).trim().toLowerCase() === username) {
      sheet.deleteRow(i + 1);
      deleted = true;
      break;
    }
  }

  return createJsonResponse({
    status: deleted ? 'success' : 'error',
    message: deleted ? `Đã xóa tài khoản ${username} thành công!` : `Không tìm thấy tài khoản ${username}!`
  });
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
