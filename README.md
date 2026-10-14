<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# LỚP 12A16 - CÔ PHƯƠNG LINH
## Hệ Thống Quản Lý Giáo Dục Thông Minh & Cơ Sở Dữ Liệu Google Sheet Trực Tuyến

Ứng dụng quản lý lớp chủ nhiệm **LỚP 12A16 - CÔ PHƯƠNG LINH (Niên khóa 2026 - 2027)**, tích hợp cơ sở dữ liệu trực tuyến hai chiều kết nối với Google Sheet:
- **1. Danh Sách Lớp Học & Tổng Quan 12A16:** Quản lý sĩ số (42 học sinh), tỷ lệ nam/nữ, ban cán sự lớp (Lớp trưởng, Bí thư, các Lớp phó, 4 Tổ trưởng) và hội đồng giáo viên bộ môn.
- **2. Hồ Sơ & Thông Tin Học Sinh Chi Tiết:** Quản lý mã học sinh (12A16-01 đến 12A16-42), ngày sinh, giới tính, số điện thoại, thông tin liên lạc phụ huynh, địa chỉ, điểm rèn luyện Karma và chuỗi chuyên cần.
- **3. Học Bạ Điểm Số Chi Tiết Lớp 10 & Lớp 11:**
  - Bảng điểm chi tiết 10 môn học (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, GDCD, Tin học) của cả năm lớp 10 và lớp 11.
  - Phân tích xu hướng tiến bộ (↗ Tăng / ➔ Ổn định / ↘ Cần hỗ trợ), xếp loại học lực và dự báo kết quả kỳ thi Tốt nghiệp THPT 2027.
  - Đánh giá tổ hợp xét tuyển Đại học (D01, A00, A01, B00, C00) và ngành học định hướng.
- **4. Nội Quy Nhà Trường Chuẩn Hóa & Khung Điểm Trừ:**
  - 12 quy định phân theo 5 nhóm: Chuyên cần & giờ giấc, Đồng phục & tác phong, Kỷ luật học tập & thi cử, Vệ sinh & cơ sở vật chất, Ứng xử văn hóa số.
  - Mức điểm trừ cụ thể kèm theo **cơ chế khắc phục tích cực (chuộc lỗi bằng điểm Karma EXP, trực nhật bù hoặc thử thách học tập)**.
- **5. Quản Lý Điểm Trừ & Nhật Ký Vi Phạm:**
  - Sổ theo dõi vi phạm theo thời gian thực, ghi nhận hành vi vi phạm và trừ điểm rèn luyện tự động.
  - Chức năng "Chuộc lỗi / Khắc phục" giúp học sinh hoàn nguyên điểm trừ khi hoàn thành rèn luyện.
- **6. Trung Tâm Cấu Hình & Tải File Mẫu Google Sheet:**
  - Nhập Google Sheet ID hoặc đường dẫn chia sẻ để đồng bộ tự động.
  - Tải về trọn bộ 5 file CSV mẫu chuẩn cho lớp 12A16 để cô Phương Linh chỉ cần tải lên Google Drive của mình.
  - Hỗ trợ xuất dữ liệu thời gian thực (Live Export) cho danh sách 42 học sinh và sổ kỷ luật ra tệp `.csv`.
- **7. Gia Sư AI Socrate Ngữ Văn 12 (Chống Văn Mẫu & Rèn Tư Duy Phản Biện):**
  - Đồng hành cùng học sinh lớp 12 theo phương pháp Socrate: đặt 3 câu hỏi gợi mở bản chất, ma trận kết cấu đoạn văn 200 chữ và từ vựng đặc sắc thay vì làm bài hộ.
- **8. Đồng Hồ Đếm Ngược Thi Tốt Nghiệp THPT 2027 & Quản Lý Nguyện Vọng:**
  - Đếm ngược chính xác từng ngày tới Kỳ thi Tốt nghiệp THPT Quốc gia (25/06/2027).
  - Lộ trình 6 mốc thời gian quan trọng và sổ lưu trữ 3 nguyện vọng Đại học mơ ước.
- **9. Hộp Công Cụ Sư Phạm Dành Riêng Cho Cô Phương Linh:**
  - *Trợ lý Zalo Phụ Huynh:* Tự động tổng hợp dữ liệu chuyên cần và điểm rèn luyện Karma để tạo tin nhắn Zalo gửi phụ huynh trong 1 chạm.
  - *Soạn Kế Hoạch Sinh Hoạt Lớp (CV 5512):* Tạo kịch bản giáo dục 45 phút chuẩn 4 hoạt động của Bộ GD&ĐT.
  - *Ma Trận Phân Hóa Năng Lực 42 Học Sinh:* Tự động gom nhóm: Chiến lược Top đầu, Tăng tốc toàn diện, và Đồng hành chăm sóc.
- **10. Sổ Nhật Ký Khen Thưởng Karma (Audit Trail):**
  - Ghi nhận đầy đủ lý do khen thưởng, người trao, thời gian thực và tự động cập nhật điểm rèn luyện.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện:
```bash
npm install
# hoặc
bun install
```

### 2. Cấu hình biến môi trường:
Tạo file `.env` (hoặc copy từ `.env.example`) và điền `GEMINI_API_KEY`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Chạy ứng dụng ở chế độ phát triển (Development):
```bash
npm run dev
# hoặc
bun run dev
```
Truy cập trình duyệt tại: `http://localhost:3000`

---

## 📊 Hướng Dẫn Kết Nối Google Sheet Của Cô Phương Linh

1. Mở Google Sheet trên Google Drive cá nhân.
2. Tạo 5 trang tính (Tabs) với tên:
   - `DANH_SACH_HOC_SINH`
   - `DIEM_SO_LOP_10_11`
   - `NOI_QUY_NHA_TRUONG`
   - `DIEM_TRU_VI_PHAM`
   - `THONG_TIN_LOP_12A16`
3. Trong ứng dụng, bấm vào nút **"Database Google Sheet"** -> Tab **"Cấu Hình & Tải Mẫu"** -> bấm tải các file CSV mẫu về máy để tải nhanh lên Google Sheet.
4. Bấm nút **Chia Sẻ (Share)** trên Google Sheet -> chọn **"Bất kỳ ai có đường liên kết đều có thể xem (Viewer)"**.
5. Dán đường dẫn hoặc ID vào phần Cấu hình trong ứng dụng và bấm **"Đồng Bộ Ngay"**.

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel (Production)

Ứng dụng được tối ưu hóa toàn diện cho việc triển khai trên nền tảng **Vercel**:
1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com) và chọn **"Add New Project"** -> Chọn repository vừa tải lên.
3. Cấu hình cài đặt trên Vercel:
   - **Framework Preset:** `Vite`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. Bấm **Deploy**.
5. Khi truy cập trang web đã triển khai:
   - Bấm vào nút màu đỏ nhấp nháy **"Lấy API key để sử dụng app"** trên thanh Header.
   - Nhận API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/api-keys).
   - Dán API Key vào và chọn mô hình mong muốn (`gemini-3-flash-preview` mặc định, `gemini-3-pro-preview`, hoặc `gemini-2.5-flash`). Toàn bộ tính năng AI và đồng bộ Google Sheets sẽ kích hoạt trực tuyến tức thì!
