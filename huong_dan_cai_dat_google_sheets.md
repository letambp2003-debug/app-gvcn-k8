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
   - **Mô tả (Description)**: `API Quan Ly Lop Hoc Toan Truong V5.4`
   - **Thực thi dưới dạng (Execute as)**: **Tôi (Me / email của bạn)** *(Rất quan trọng: giúp giáo viên thao tác được mà không cần cấp quyền vào sheet gốc)*.
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)**.
4. Bấm **Triển khai (Deploy)**.
5. Cửa sổ hiện ra sẽ cung cấp mục **URL ứng dụng web (Web app URL)** có dạng:
   `https://script.google.com/macros/s/AKfycbx.../exec`
6. Copy đường link này!

---

## BƯỚC 5: KẾT NỐI VÀO WEBAPP
1. Mở file `index.html` trên trình duyệt.
2. Đăng nhập với tài khoản `admin` (Mật khẩu: `admin123`) hoặc tài khoản giáo viên.
3. Vào menu **Cài đặt (Settings)** $\to$ Dán link Web App URL vừa copy vào ô **"URL Google Apps Script API"** và bấm **Lưu kết nối**.
4. Toàn bộ dữ liệu của trường học từ nay sẽ được đồng bộ và lưu trữ vĩnh viễn, an toàn trên Google Sheets!
