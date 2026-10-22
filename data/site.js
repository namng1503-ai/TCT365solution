// Thông tin công ty — sửa tại đây, toàn bộ website tự cập nhật.
// Mục ghi "[CẦN BỔ SUNG]" là thông tin chưa có, cần chủ doanh nghiệp cung cấp.
export const site = {
  name: 'Công ty TNHH TCT365',
  shortName: 'TCT365',
  tagline: 'Đại lý thuế · Kế toán · Tư vấn doanh nghiệp',
  description:
    'TCT365 là đại lý thuế cung cấp dịch vụ kế toán thuế trọn gói, kê khai và quyết toán thuế, lập báo cáo tài chính, cấp giấy phép doanh nghiệp và đào tạo kế toán.',
  // Địa chỉ website đang chạy. Dùng cho ảnh xem trước khi chia sẻ link (Facebook, Zalo), sitemap và RSS.
  // Khi tên miền tct365-tax.com được trỏ về Vercel thì đổi lại thành 'https://tct365-tax.com'.
  url: 'https://tct365.vercel.app',
  address: '432 Phạm Văn Đồng, Phường Đông Ngạc, TP Hà Nội',
  hotline: '0942 125 266',
  hotlineContact: 'Ms. Đào',
  email: 'support@tct365-tax.com',
  zalo: 'https://zalo.me/0942125266',
  facebook: 'https://www.facebook.com/TCT365',
  taxCode: '[CẦN BỔ SUNG]',
  workingHours: '[CẦN BỔ SUNG]',
  slogan: 'Thuế của bạn, kỹ năng của chúng tôi',
  motto: ['Tận tâm', 'Chuyên nghiệp', 'Thành công'],
};

export const telHref = `tel:${site.hotline.replace(/\s/g, '')}`;
export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&hl=vi&z=16&output=embed`;
export const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;

export const about = {
  intro:
    'TCT365 là đại lý thuế được cơ quan thuế cấp phép hoạt động trong lĩnh vực kê khai và tư vấn thuế. Bên cạnh dịch vụ thuế, chúng tôi hỗ trợ doanh nghiệp và cá nhân về giấy phép kinh doanh, xây dựng hệ thống kế toán – thuế nội bộ và đào tạo nhân sự kế toán.',
  pillars: [
    {
      title: 'Tầm nhìn',
      text: 'Trở thành nhà cung cấp dịch vụ thuế và đào tạo kế toán hàng đầu, giúp doanh nghiệp tiết kiệm chi phí và tuân thủ đúng pháp luật.',
    },
    {
      title: 'Sứ mệnh',
      text: 'Cung cấp dịch vụ tư vấn và đào tạo thuế toàn diện, giúp doanh nghiệp và cá nhân hiểu rõ nghĩa vụ thuế để ra quyết định tài chính đúng đắn.',
    },
    {
      title: 'Phương châm',
      text: 'An toàn – Trách nhiệm – Sẻ chia. Tư vấn chất lượng với mức phí hợp lý, bảo vệ quyền và lợi ích hợp pháp của khách hàng.',
    },
  ],
  facts: [
    { label: 'Năm thành lập', value: '[CẦN BỔ SUNG]' },
    { label: 'Mã số thuế', value: site.taxCode },
    { label: 'Số khách hàng đang phục vụ', value: '[CẦN BỔ SUNG]' },
  ],
};

export const processSteps = [
  { title: 'Tiếp nhận nhu cầu', text: 'Trao đổi qua hotline, Zalo, email hoặc tại văn phòng để nắm rõ tình hình doanh nghiệp.' },
  { title: 'Tư vấn phương án', text: 'Đề xuất phương án phù hợp, nêu rõ hồ sơ cần chuẩn bị, thời gian và chi phí.' },
  { title: 'Ủy quyền thực hiện', text: 'TCT365 chuẩn bị, soạn thảo và nộp hồ sơ thay doanh nghiệp theo ủy quyền.' },
  { title: 'Theo dõi và cập nhật', text: 'Cập nhật tình trạng hồ sơ cho khách hàng trong suốt quá trình xử lý.' },
  { title: 'Bàn giao kết quả', text: 'Bàn giao kết quả, hồ sơ gốc và hỗ trợ các thủ tục tiếp theo.' },
];

// Bài thuộc chuyên mục này hiện ở /tuyen-dung, không lẫn vào Tin tức.
export const jobCategory = 'Tuyển dụng';
export const newsCategories = ['Thuế', 'Kế toán', 'Tài chính', 'Doanh nghiệp', 'Bảo hiểm'];
export const postCategories = [...newsCategories, jobCategory];
export const isJob = p => p.category === jobCategory;
