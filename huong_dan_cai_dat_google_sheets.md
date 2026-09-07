# HƯỚNG DẪN CÀI ĐẶT CƠ SỞ DỮ LIỆU GOOGLE SHEETS & APPS SCRIPT
*(Dành cho Quản trị viên / Ban Giám Hiệu trường học)*

---

## BƯỚC 1: TẠO FILE GOOGLE SHEETS CƠ SỞ DỮ LIỆU
1. Mở trình duyệt, truy cập vào [Google Drive](https://drive.google.com).
2. Bấm nút **+ Mới (New)** $\to$ Chọn **Google Trang tính (Google Sheets)**.
3. Đổi tên file ở góc trên bên trái thành: `CSDL_QuanLyLopHoc_ToanTruong`.

---

## BƯỚC 2: DÁN MÃ NGUỒN VÀO GOOGLE APPS SCRIPT
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** $\to$ **Apps Script**.
2. Một tab mới sẽ mở ra với trình soạn thảo mã nguồn.
3. Xóa toàn bộ nội dung mặc định trong tệp `Code.gs`.
4. Mở tệp `google_apps_script.js` (trong thư mục dự án) hoặc copy toàn bộ nội dung trong đó dán vào `Code.gs`.
5. Bấm biểu tượng đĩa mềm 💾 **Lưu dự án (Save project)** hoặc phím tắt `Ctrl + S`.

---

## BƯỚC 3: CHẠY HÀM KHỞI TẠO BẢNG TỰ ĐỘNG (`initialSetup`)
1. Trên thanh công cụ phía trên của Apps Script, tại mục chọn hàm (cạnh nút Run/Debug), chọn hàm **`initialSetup`**.
2. Bấm nút ▶️ **Chạy (Run)**.
3. Google sẽ hiện hộp thoại yêu cầu cấp quyền:
   - Bấm **Xem xét quyền (Review Permissions)**.
   - Chọn tài khoản Google của bạn.
   - Bấm vào dòng chữ nhỏ **Nâng cao (Advanced)** ở góc dưới bên trái $\to$ Chọn **Đi tới dự án (Go to Untitled project / Không an toàn)**.
   - Bấm nút **Cho phép (Allow)**.
4. Chờ 5 giây, màn hình Execution log sẽ hiện `ĐÃ KHỞI TẠO THÀNH CÔNG HỆ THỐNG CƠ SỞ DỮ LIỆU TOÀN TRƯỜNG!`.
5. Quay lại tab Google Sheets, bạn sẽ thấy hệ thống đã tự động tạo đủ 6 sheet chuẩn:
   - **`TaiKhoan`**: Có sẵn tài khoản mẫu (`admin` / pass: `admin123`, `gv_8a6` / pass: `123456`, `gv_8a1` / pass: `123456`).
   - **`LopHoc`**: Có danh sách lớp 8A6, 8A1.
   - **`HocSinh`**: Có đủ các cột `id, class_id, stt, fullname, dob, gender, cccd, coins, note`.
   - **`DiemDanh`**, **`ThiDua`**, **`CauHinh`**.

---

## BƯỚC 4: XUẤT BẢN WEB APP (TRIỂN KHAI API)
1. Ở góc trên bên phải màn hình Apps Script, bấm nút màu xanh **Triển khai (Deploy)** $\to$ Chọn **Lượt triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng ⚙️ (chọn loại) $\to$ Chọn **Ứng dụng web (Web app)**.
3. Điền các thông tin:
   - **Mô tả (Description)**: `API Quan Ly Lop Hoc Toan Truong V5.4 - Cloud RBAC`
   - **Thực thi dưới dạng (Execute as)**: **Tôi (Me / email của bạn)** *(Rất quan trọng: giúp giáo viên và tổ trưởng thao tác được mà không cần cấp quyền vào sheet gốc)*.
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)**.
4. Bấm **Triển khai (Deploy)**.
5. Cửa sổ hiện ra sẽ cung cấp mục **URL ứng dụng web (Web app URL)** có dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`
6. Copy đường link này!

> [!TIP]
> **Cách cập nhật khi có code mới trong `google_apps_script.js`:**
> 1. Copy toàn bộ code mới từ `google_apps_script.js` dán đè vào `Code.gs` và bấm **Lưu (Ctrl + S)**.
> 2. Bấm **Triển khai (Deploy)** $\to$ **Quản lý các lượt triển khai (Manage deployments)**.
> 3. Bấm vào biểu tượng cây bút chì ✏️ (Chỉnh sửa) ở góc phải $\to$ Tại mục **Phiên bản (Version)** chọn **Phiên bản mới (New version)** $\to$ Bấm **Triển khai (Deploy)**. Đường link Web App URL sẽ giữ nguyên không đổi!

---

## BƯỚC 5: KẾT NỐI VÀO WEBAPP
1. Mở webapp trên trình duyệt (hoặc qua link Vercel).
2. Đăng nhập với tài khoản `admin` (Mật khẩu: `admin123`) hoặc tài khoản giáo viên `gv_8a6` (pass: `123456`).
3. Vào menu **Cài đặt (Settings)** $\to$ Dán link Web App URL vào ô **"URL Google Apps Script API"** và bấm **Lưu kết nối**.
4. Toàn bộ dữ liệu của trường học từ nay sẽ được đồng bộ và lưu trữ vĩnh viễn, an toàn trên Google Sheets!

---
## BƯỚC 6: HƯỚNG DẪN VẬN HÀNH PHÂN QUYỀN VÀ BẢO MẬT (RBAC)

### 1. Vai trò Quản trị viên (Admin / Ban Giám Hiệu):
- Đăng nhập bằng tài khoản `admin` / mật khẩu `admin123`.
- Có thể chuyển đổi xem và quản lý bất kỳ lớp học nào trong toàn trường (`8A6`, `8A1`...).
- Quản lý cấu hình trường, xuất báo cáo tổng thể.

### 2. Vai trò Giáo viên Chủ nhiệm (GVCN):
- Đăng nhập bằng tài khoản giáo viên được cấp (Ví dụ: `gv_8a6` / pass `123456`).
- **Khóa phạm vi:** Hệ thống cố định chỉ xem và quản lý lớp được phân công (Lớp 8A6).
- **Bảng Phê Duyệt Nề Nếp:** Khi Tổ trưởng chấm điểm, trên màn hình **Thi đua tuần** của GVCN sẽ xuất hiện hộp thông báo màu vàng:
  - GVCN có thể bấm **Duyệt** từng bản ghi, **Bác bỏ** nếu chấm sai, hoặc bấm **Duyệt tất cả** chỉ với 1 click.
- **Quản lý Mã PIN Tổ Trưởng:**
  - Bấm nút **🔑 PIN Tổ Trưởng** trên thanh công cụ Thi đua tuần.
  - GVCN có thể xem và đổi mã PIN 4 số cho từng tổ (`Tổ 1` .. `Tổ 4`) hoặc đặt lại `1234` cho tất cả.

### 3. Vai trò Tổ Trưởng (Học sinh cán sự):
- Bấm vào tab **Tổ Trưởng (Mã PIN)** tại màn hình Đăng nhập:
  - Chọn Lớp (VD: 8A6) $\to$ Chọn Tổ (VD: Tổ 1) $\to$ Nhập mã PIN 4 số (Mặc định: `1234`).
- **Bảo mật tuyệt đối (Nghị định 13/2023/NĐ-CP):**
  - Server tự động lọc sạch và xóa bỏ hoàn toàn số CCCD (12 chữ số) và Ngày sinh trước khi truyền về máy của Tổ trưởng. Dù học sinh có mở F12 DevTools cũng không thể xem trộm được thông tin định danh cá nhân!
  - Hệ thống ẩn toàn bộ các menu nhạy cảm (Danh sách học sinh, Điểm danh trường, Sơ đồ lớp, Cài đặt, Dữ liệu...).
  - Tổ trưởng chỉ thấy danh sách thành viên trong tổ của mình để chấm điểm nề nếp.
- **Cơ chế Chờ Duyệt (Pending Workflow):**
  - Điểm do Tổ trưởng chấm sẽ được gửi lên hệ thống ở trạng thái **Chờ duyệt (Pending)**.
  - Tổ trưởng có thể theo dõi danh sách đang chờ GVCN duyệt và có thể bấm **Rút lại** nếu bấm nhầm.
  - Điểm chỉ chính thức cộng/trừ vào bảng thi đua sau khi GVCN đã bấm phê duyệt.
