# Hệ Thống Quản Trị Lớp Học & Giáo Viên Chủ Nhiệm Toàn Trường (V5.4 Cloud Edition)

> **Giải pháp Chuyển đổi số Giáo dục Toàn diện · Miễn phí 100% · Bền vững · Cơ sở dữ liệu Google Sheets & Google Apps Script**

---

## 🌟 Giới Thiệu

**Hệ thống Quản trị Lớp học & Giáo viên Chủ nhiệm (GVCN)** là ứng dụng web hiện đại, trực quan dành cho các trường học (Tiểu học, THCS, THPT). Ứng dụng giúp số hóa toàn bộ nghiệp vụ chủ nhiệm lớp: quản lý hồ sơ học sinh (bao gồm Số định danh / CCCD 12 số), điểm danh chuyên cần, thi đua tuần 100 điểm/tuần, sơ đồ chỗ ngồi 2D/3D, trò chơi tương tác (Vòng quay, Cuộn phim may mắn), công cụ Chống Ồn lớp học và báo cáo thống kê đa chiều xuất Excel/PDF.

Hệ thống sử dụng **Google Sheets** làm cơ sở dữ liệu đám mây và **Google Apps Script** làm API trung gian, giúp nhà trường không tốn bất kỳ chi phí mua máy chủ hay thuê dịch vụ đám mây nào.

---

## ✨ Tính Năng Nổi Bật

### 1. Phân quyền & Quản lý Toàn trường
- **Tài khoản Giáo viên chủ nhiệm**: Đăng nhập và tự động khóa vào đúng lớp được phân công, bảo mật tuyệt đối dữ liệu lớp khác.
- **Tài khoản Quản trị viên (Admin / Ban Giám Hiệu)**: Quản lý, xem và chuyển đổi linh hoạt giữa tất cả các lớp trong trường.

### 2. Hồ sơ Học sinh Chuẩn hóa & Bảo vệ CCCD 12 số
- Chuẩn hóa 5 trường thông tin: **STT, Họ và tên, Ngày sinh, Giới tính, Căn cước công dân (CCCD)**.
- Thuật toán tự động bảo toàn số `0` ở đầu của số CCCD (tránh lỗi Excel tự biến số 0 đầu thành số).
- Cơ chế che 4 số giữa của CCCD trên giao diện thẻ học sinh (`0793••••1234`) để đảm bảo quyền riêng tư.

### 3. Nhập Excel (.xlsx) Thông Minh & Linh Hoạt
- Tải file Excel mẫu chuẩn trực tiếp từ hệ thống.
- Kéo thả file Excel; tự động nhận diện tiêu đề cột linh hoạt (hỗ trợ nhiều cách viết hoa, viết thường, có dấu hoặc không dấu).
- Bảng xem trước (Preview) kiểm tra tính hợp lệ của CCCD và ngày sinh trước khi lưu.
- Hỗ trợ 2 chế độ: **Ghi đè** hoặc **Thêm tiếp**.

### 4. Điểm danh & Liên thông Thi đua 100 điểm/tuần
- Điểm danh nhanh: *Có mặt, Đi muộn, Có phép, Không phép*.
- Tự động quy đổi trạng thái chuyên cần vào bảng điểm thi đua tuần (mỗi học sinh bắt đầu với 100 điểm gốc).
- Ghi nhận nề nếp theo các tiêu chí (Học tập, Nề nếp, Tác phong, Vệ sinh, Trách nhiệm, Bảo vệ tài sản).
- Xếp hạng cá nhân, xếp hạng tổ, chốt tuần và xuất báo cáo Excel/PDF.

### 5. Bộ Tiện Ích Phòng Học Tương Tác
- **Sơ đồ chỗ ngồi**: Hỗ trợ chế độ 2D và 3D chân thực; xếp ngẫu nhiên, xếp xen kẽ Nam-Nữ, xếp theo tổ; xuất sơ đồ dạng ảnh PNG độ nét cao.
- **Trò chơi ngẫu nhiên**: *Vòng quay may mắn* và *Cuộn phim may mắn* phục vụ kiểm tra bài cũ, sinh hoạt lớp, phát biểu nhận thưởng.
- **Công cụ Chống Ồn**: Cảnh báo tức thì toàn màn hình, đếm ngược im lặng và phát hiện tiếng ồn tự động qua Microphone.
- **Đồng hồ đếm ngược**: Đếm ngược làm bài tập với chuông báo và âm thanh tick 10 giây cuối.
- **Cửa hàng đổi quà**: Dùng xu tích lũy từ học tập để đổi quà thưởng.

### 6. Đồng bộ Hai Chiều với Google Sheets Cloud
- Lưu trữ dữ liệu an toàn trên Google Sheets.
- Hỗ trợ làm việc ngoại tuyến (Offline cache): Mất mạng vẫn hoạt động mượt mà, khi có kết nối sẽ tự động đồng bộ lên Cloud.

---

## 🛠️ Cấu Trúc Thư Mục Dự Án

```
CHATBOT-GVCN/
├── Index.html                       # Ứng dụng Webapp hoàn chỉnh (HTML5, CSS3, JS ES6)
├── google_apps_script.js            # Mã nguồn API Backend chạy trên Google Apps Script
├── huong_dan_cai_dat_google_sheets.md # Cẩm nang 5 bước cài đặt chi tiết cho Quản trị viên
├── .gitignore                       # File cấu hình bỏ qua tệp tạm khi đẩy lên Git
└── README.md                        # Tài liệu hướng dẫn sử dụng và giới thiệu dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

### Bước 1: Triển khai Backend trên Google Sheets (Dành cho Quản trị viên)
1. Mở [Google Drive](https://drive.google.com) $\to$ Tạo 1 file **Google Trang tính** mới đặt tên: `CSDL_QuanLyLopHoc_ToanTruong`.
2. Vào menu **Tiện ích mở rộng** (Extensions) $\to$ **Apps Script**.
3. Xóa code mặc định, dán toàn bộ nội dung từ file `google_apps_script.js` vào `Code.gs` và bấm **Lưu (Ctrl + S)**.
4. Chọn hàm **`initialSetup`** trên thanh công cụ và bấm ▶️ **Chạy** (cấp quyền truy cập). Hệ thống sẽ tự động tạo đủ 6 bảng chuẩn: `TaiKhoan`, `LopHoc`, `HocSinh`, `DiemDanh`, `ThiDua`, `CauHinh`.
5. Bấm **Triển khai (Deploy)** $\to$ **Lượt triển khai mới**:
   - Loại: **Ứng dụng web (Web app)**
   - Thực thi dưới dạng: **Tôi (Me)**
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)**
   - Copy đường link **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).

### Bước 2: Sử dụng Webapp
1. Mở file `Index.html` bằng trình duyệt web.
2. Ứng dụng đã được tích hợp sẵn URL Web App hoặc bạn có thể dán link mới vào mục **Cài đặt $\to$ Đường dẫn Google Apps Script Web App URL** và bấm **Lưu**.
3. Đăng nhập tài khoản mẫu:
   - **Admin**: `admin` / `admin123` (Toàn quyền quản lý tất cả các lớp).
   - **GVCN 8A6**: `gv_8a6` / `123456` (Khóa vào lớp 8A6).
   - **GVCN 8A1**: `gv_8a1` / `123456` (Khóa vào lớp 8A1).
4. Vào mục **Học sinh $\to$ Nhập từ Excel** để nạp danh sách học sinh của lớp!

---

## 🔒 Bảo Mật & Quyền Riêng Tư

- Google Apps Script chạy dưới quyền chủ sở hữu (*Execute as: Me*), giáo viên không cần quyền truy cập trực tiếp vào Google Sheet gốc.
- Thông tin nhạy cảm như CCCD được kiểm tra định dạng và che 4 số giữa trên giao diện.
- Không chia sẻ dữ liệu ra bên ngoài máy chủ Google Sheets của nhà trường.

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi đội ngũ công nghệ giáo dục phục vụ cộng đồng giáo viên Việt Nam. Hoàn toàn miễn phí cho mục đích phi thương mại trong các cơ sở giáo dục.
