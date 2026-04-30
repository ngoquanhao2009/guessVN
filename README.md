# guessVN

Trò chơi đoán vị trí ở Việt Nam theo kiểu GeoGuessr, nhưng dùng ảnh thật theo từng địa điểm và được đóng gói bằng Vite để dễ chạy, build và deploy.

## Cách chạy

```bash
npm install
npm run dev
```

## Đăng lên GitHub Pages

Repo này đã có workflow GitHub Pages. Chỉ cần đẩy lên nhánh `main`, rồi vào Settings -> Pages của repo và chọn Source là `GitHub Actions` nếu GitHub chưa tự bật sẵn.

## Build

```bash
npm run build
```

## Tính năng

- 8 vòng chơi ngẫu nhiên với địa điểm trên khắp Việt Nam
- Ảnh thật theo từng địa điểm để tăng cảm giác GeoGuessr hơn
- Bản đồ vệ tinh để đặt ghim đoán
- Chấm điểm theo khoảng cách đến vị trí thật
- Hiệu ứng tổng kết, kỷ lục cá nhân và gợi ý theo từng vòng
