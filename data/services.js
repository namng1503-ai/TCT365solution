// Danh mục dịch vụ. Nội dung viết lại từ website cũ, không thêm cam kết mới.
// icon: tên icon trong components/Icons.js
export const groups = [
  { id: 'ke-toan-thue', title: 'Kế toán – Thuế', icon: 'ledger', lead: 'Sổ sách đúng chuẩn, tờ khai đúng hạn, quyết toán an toàn.' },
  { id: 'giay-phep', title: 'Giấy phép doanh nghiệp', icon: 'stamp', lead: 'Thủ tục pháp lý từ lúc thành lập đến khi thay đổi, giải thể.' },
  { id: 'dao-tao-tu-van', title: 'Đào tạo – Tư vấn', icon: 'compass', lead: 'Nâng năng lực đội kế toán và kiểm soát rủi ro thuế.' },
  { id: 'khac', title: 'Dịch vụ khác', icon: 'invoice', lead: 'Hóa đơn điện tử, chữ ký số và bảo hiểm xã hội.' },
];

export const services = [
  // ───────── Kế toán – Thuế
  {
    slug: 'ke-toan-thue-tron-goi', group: 'ke-toan-thue', icon: 'ledger',
    title: 'Dịch vụ kế toán thuế trọn gói',
    summary: 'Một đầu mối lo toàn bộ hóa đơn, sổ sách, tờ khai và quyết toán — doanh nghiệp tập trung vào kinh doanh.',
    forWhom: ['Doanh nghiệp thương mại, xây dựng, sản xuất, vận tải, dịch vụ ăn uống, du lịch, sửa chữa, gia công, lắp đặt', 'Doanh nghiệp chưa có hoặc không muốn duy trì bộ phận kế toán riêng'],
    includes: [
      'Tư vấn sử dụng hóa đơn đầu vào, đầu ra hợp lý; kiểm tra tính hợp lệ và phân loại chứng từ gốc',
      'Lập và nộp tờ khai thuế tháng, quý; thuế TNCN; tạm tính thuế TNDN',
      'Lập chứng từ thu, chi, nhập, xuất; sổ chi tiết, sổ kho, công nợ phải thu – phải trả, sổ cái, nhật ký chung',
      'Lập bảng phân bổ, khấu hao; bảng lương và biểu mẫu lao động theo quy định',
      'Cuối năm: hoàn thiện sổ sách, quyết toán thuế TNDN, TNCN và lập báo cáo tài chính',
      'Tổ chức lưu trữ hồ sơ; giải trình với cơ quan thuế khi có yêu cầu',
    ],
    steps: [
      'Doanh nghiệp cung cấp hóa đơn đầu vào, đầu ra và chứng từ liên quan',
      'Chuyên viên nhận chứng từ định kỳ tận nơi, hoặc qua email, Zalo',
      'TCT365 kiểm tra, lập sổ sách, tờ khai và nộp cho cơ quan thuế',
      'Cuối năm quyết toán và lập báo cáo tài chính',
    ],
    commitments: [
      'Lập chứng từ, sổ sách đầy đủ, đúng tiến độ theo chuẩn mực kế toán hiện hành',
      'Chịu trách nhiệm về chứng từ, báo cáo do TCT365 lập trên cơ sở chứng từ hợp lệ khách hàng cung cấp',
      'Bảo mật thông tin kế toán, kể cả sau khi kết thúc hợp đồng',
    ],
  },
  {
    slug: 'ke-khai-thue', group: 'ke-toan-thue', icon: 'form',
    title: 'Kê khai thuế định kỳ',
    summary: 'Tờ khai tháng, quý, năm được lập từ chứng từ thực tế và nộp đúng hạn, tránh rủi ro bị phạt chậm nộp.',
    forWhom: ['Doanh nghiệp mới thành lập chưa có nhân sự kế toán', 'Doanh nghiệp nhỏ đang thuê kế toán làm thêm, chỉ nộp được báo cáo cơ bản', 'Doanh nghiệp có kế toán còn ít kinh nghiệm hoặc thay đổi nhân sự liên tục'],
    includes: [
      'Thực hiện các thủ tục thuế ban đầu sau khi có giấy chứng nhận đăng ký doanh nghiệp',
      'Tư vấn hóa đơn đầu vào, đầu ra và tối ưu chi phí hợp lý theo quy định',
      'Lập, nộp tờ khai thuế GTGT, TNCN, TNDN theo tháng, quý, năm',
      'Hoàn thiện chứng từ, lập sổ nhật ký, sổ cái, khấu hao tài sản, chi phí trả trước',
      'Rà soát bảng lương hằng tháng, tư vấn điểm chưa phù hợp với pháp luật lao động',
    ],
  },
  {
    slug: 'quyet-toan-thue', group: 'ke-toan-thue', icon: 'shield',
    title: 'Thanh tra, quyết toán thuế',
    summary: 'Rà soát toàn bộ hồ sơ trước kỳ thanh tra, kiểm tra để giảm thiểu sai sót và rủi ro bị truy thu, xử phạt.',
    forWhom: ['Doanh nghiệp có lịch thanh tra, kiểm tra thuế', 'Doanh nghiệp cần quyết toán thuế khi giải thể, chuyển đổi hoặc theo yêu cầu'],
    includes: [
      'Kiểm tra hồ sơ pháp nhân và các đăng ký với cơ quan thuế',
      'Đối chiếu việc kê khai, quyết toán lệ phí môn bài, thuế GTGT, TNDN, TNCN',
      'Kiểm tra tính hợp lệ của hóa đơn, hợp đồng, chứng từ thanh toán qua ngân hàng',
      'Rà soát chi phí được trừ: tiền lương, khấu hao, phân bổ công cụ dụng cụ, chi phí quản lý',
      'Kiểm tra định mức, giá thành, giá vốn, công nợ và nhập – xuất – tồn',
      'Chuẩn bị hồ sơ và đồng hành giải trình với đoàn thanh tra, kiểm tra',
    ],
  },
  {
    slug: 'lap-bao-cao-tai-chinh', group: 'ke-toan-thue', icon: 'chart',
    title: 'Lập báo cáo tài chính',
    summary: 'Báo cáo tài chính năm được lập từ sổ sách đã rà soát, trình bày đúng quy định và nộp trong thời hạn.',
    forWhom: ['Doanh nghiệp vừa và nhỏ cần hoàn thiện báo cáo tài chính cuối năm'],
    documents: ['Hóa đơn GTGT đầu vào, đầu ra trong năm tài chính', 'Bảng lương và thông tin giấy tờ tùy thân người lao động', 'Sao kê tài khoản ngân hàng của doanh nghiệp', 'Bảng cân đối tài khoản năm trước'],
    includes: [
      'Thu thập, rà soát, phân loại hóa đơn, chứng từ; loại bỏ, điều chỉnh chứng từ sai sót',
      'Lập bảng phân bổ công cụ dụng cụ, chi phí trả trước và bảng khấu hao tài sản cố định',
      'Kiểm tra chi phí lương, BHXH, BHYT; hạch toán trên phần mềm kế toán',
      'Lập sổ sách, báo cáo kết quả kinh doanh, thuyết minh báo cáo tài chính',
      'Trao đổi kết quả với doanh nghiệp; in và bàn giao báo cáo, sổ sách',
    ],
  },
  {
    slug: 'tra-soat-so-sach-ke-toan', group: 'ke-toan-thue', icon: 'search',
    title: 'Tra soát, hoàn thiện sổ sách kế toán',
    summary: 'Phát hiện và xử lý sai sót trong sổ sách trước khi cơ quan thuế phát hiện.',
    forWhom: ['Doanh nghiệp chưa từng lập sổ sách kế toán', 'Doanh nghiệp có sổ sách nhưng chưa bảo đảm hợp lý, hợp lệ', 'Doanh nghiệp sắp quyết toán thuế', 'Doanh nghiệp không có kế toán thuế hoặc kế toán chưa đủ kinh nghiệm'],
    includes: [
      'Trao đổi với bộ phận kế toán để nắm chính sách nhân sự, kế toán và thuế suất áp dụng',
      'Kiểm tra tính hợp lệ của hóa đơn, chứng từ và việc hạch toán',
      'Đối chiếu số liệu giữa sổ sách, tờ khai và báo cáo',
      'Lập báo cáo rà soát, nêu sai sót và hướng điều chỉnh',
    ],
    steps: ['Bàn giao số liệu, chứng từ kế toán', 'TCT365 rà soát sổ sách', 'Gửi báo cáo rà soát cho khách hàng'],
  },
  {
    slug: 'hoan-thue-gtgt-tncn', group: 'ke-toan-thue', icon: 'refund',
    title: 'Hoàn thuế GTGT, TNCN',
    summary: 'Chuẩn bị hồ sơ hoàn thuế chặt chẽ để dòng tiền sớm quay về doanh nghiệp và người lao động.',
    forWhom: ['Doanh nghiệp xuất khẩu, đầu tư hoặc có số thuế GTGT đầu vào chưa khấu trừ hết', 'Cá nhân có số thuế TNCN đã nộp lớn hơn số phải nộp'],
    includes: [
      'Lập kế hoạch và tiếp nhận hồ sơ, sổ sách cho giai đoạn đề nghị hoàn',
      'Rà soát sổ sách, tờ khai thuế GTGT và báo cáo thuế liên quan',
      'Chốt số thuế đề nghị hoàn và nộp hồ sơ cho cơ quan thuế',
      'Chuẩn bị và đồng hành khi cơ quan thuế kiểm tra trước hoàn tại trụ sở',
      'Quyết toán thuế TNCN và đề nghị hoàn cho cá nhân',
    ],
  },
  // ───────── Giấy phép
  {
    slug: 'thanh-lap-cong-ty', group: 'giay-phep', icon: 'building',
    title: 'Thành lập công ty',
    summary: 'Từ ý tưởng đến con dấu: tư vấn loại hình, soạn và nộp hồ sơ, bàn giao kết quả tận nơi.',
    forWhom: ['Cá nhân, nhóm cổ đông chuẩn bị thành lập doanh nghiệp'],
    documents: ['Tên công ty, địa chỉ trụ sở, ngành nghề dự kiến', 'Giấy tờ tùy thân của thành viên góp vốn'],
    includes: [
      'Tư vấn loại hình doanh nghiệp, vốn điều lệ, ngành nghề, người đại diện, cơ cấu góp vốn',
      'Soạn thảo và nộp hồ sơ tại cơ quan đăng ký kinh doanh theo ủy quyền',
      'Nhận kết quả, khắc dấu và công bố thông tin trên Cổng thông tin quốc gia',
      'Hỗ trợ sau thành lập: khai thuế ban đầu, tài khoản ngân hàng, hóa đơn điện tử, chữ ký số',
    ],
    deliverables: ['Giấy chứng nhận đăng ký doanh nghiệp', 'Con dấu công ty', 'Điều lệ và hồ sơ nội bộ'],
  },
  {
    slug: 'thay-doi-dang-ky-kinh-doanh', group: 'giay-phep', icon: 'swap',
    title: 'Thay đổi đăng ký kinh doanh',
    summary: 'Hồ sơ đúng thẩm quyền, đúng trường hợp ngay từ lần nộp đầu, không phải sửa đi sửa lại.',
    forWhom: ['Doanh nghiệp thay đổi địa chỉ, tên, vốn điều lệ, thành viên góp vốn, người đại diện theo pháp luật, ngành nghề', 'Doanh nghiệp chuyển đổi loại hình hoặc cần cập nhật thông tin đăng ký'],
    includes: [
      'Tư vấn trường hợp cần đăng ký thay đổi hay chỉ cần thông báo cập nhật',
      'Soạn hồ sơ, trình ký và nộp tại cơ quan đăng ký kinh doanh, cơ quan thuế',
      'Theo dõi, cập nhật tình trạng hồ sơ và trả kết quả tận nơi',
      'Cập nhật thông tin mới với cơ quan thuế khi cần',
    ],
  },
  {
    slug: 'ho-kinh-doanh', group: 'giay-phep', icon: 'shop',
    title: 'Đăng ký hộ kinh doanh',
    summary: 'Hợp pháp hóa hoạt động kinh doanh nhỏ, đủ điều kiện xuất hóa đơn và vay vốn ngân hàng.',
    forWhom: ['Cá nhân, hộ gia đình kinh doanh nhỏ lẻ', 'Đại lý bảo hiểm cần xuất hóa đơn để hạch toán chi phí'],
    includes: [
      'Tư vấn tên, địa điểm, ngành nghề, vốn và người đại diện hộ kinh doanh',
      'Soạn hồ sơ, trình ký và nộp tại cơ quan đăng ký có thẩm quyền',
      'Theo dõi và nhận kết quả thay khách hàng',
      'Hướng dẫn đăng ký thuế, treo biển hiệu sau khi được cấp phép',
    ],
  },
  {
    slug: 'chi-nhanh-van-phong-dai-dien', group: 'giay-phep', icon: 'branch',
    title: 'Thành lập chi nhánh, văn phòng đại diện',
    summary: 'Mở rộng hoạt động với mô hình đơn vị phụ thuộc phù hợp và đầy đủ nghĩa vụ thuế.',
    forWhom: ['Doanh nghiệp mở rộng hoạt động sang địa bàn mới'],
    documents: ['Bản sao giấy chứng nhận đăng ký doanh nghiệp của công ty chủ quản', 'Giấy tờ tùy thân của người đứng đầu chi nhánh, văn phòng đại diện'],
    includes: [
      'Tư vấn lựa chọn mô hình, cơ cấu tổ chức, quyền và nghĩa vụ của đơn vị mới',
      'Tư vấn nghĩa vụ thuế của chi nhánh, văn phòng đại diện',
      'Soạn, nộp hồ sơ, theo dõi và nhận giấy chứng nhận đăng ký hoạt động',
      'Khắc dấu và bàn giao kết quả',
    ],
  },
  {
    slug: 'giai-the-doanh-nghiep', group: 'giay-phep', icon: 'close',
    title: 'Giải thể doanh nghiệp',
    summary: 'Khép lại doanh nghiệp đúng trình tự, hoàn tất nghĩa vụ với cơ quan thuế và cơ quan đăng ký kinh doanh.',
    forWhom: ['Doanh nghiệp kết thúc thời hạn hoạt động, theo quyết định của chủ sở hữu, không đủ số thành viên tối thiểu hoặc bị thu hồi giấy phép'],
    documents: ['Danh sách người lao động', 'Bản chính giấy chứng nhận đăng ký doanh nghiệp và con dấu', 'Chứng từ, sổ sách kế toán', 'Xác nhận không nợ thuế, BHXH, hải quan (nếu có)'],
    includes: [
      'Tư vấn điều kiện, quy định pháp lý trước khi giải thể',
      'Soạn quyết định, biên bản và hồ sơ giải thể',
      'Quyết toán thuế, đóng mã số thuế với cơ quan thuế',
      'Nộp hồ sơ và nhận thông báo giải thể tại cơ quan đăng ký kinh doanh',
    ],
  },
  // ───────── Đào tạo – Tư vấn
  {
    slug: 'dao-tao-ke-toan-thue', group: 'dao-tao-tu-van', icon: 'cap',
    title: 'Đào tạo kế toán thuế',
    summary: 'Học trên chứng từ thực tế để tự lập tờ khai và báo cáo thuế cho doanh nghiệp.',
    forWhom: ['Sinh viên kế toán mới tốt nghiệp thiếu kiến thức thực tế', 'Kế toán 1–2 năm kinh nghiệm chưa làm được phần thuế', 'Chủ doanh nghiệp muốn tự kiểm soát tình hình thuế'],
    includes: [
      'Lớp nhỏ, không quá 10 học viên; có lớp kèm 1:1',
      'Kiểm tra trình độ trước khi vào lớp',
      'Thực hành hạch toán trên Excel và phần mềm với hóa đơn, chứng từ thực tế',
      'Thi cuối khóa; chưa đạt được học lại không mất phí',
      'Hỗ trợ giải đáp thắc mắc sau khóa học',
    ],
  },
  {
    slug: 'dao-tao-ke-toan-tong-hop', group: 'dao-tao-tu-van', icon: 'book',
    title: 'Đào tạo kế toán tổng hợp',
    summary: 'Nắm trọn quy trình kế toán từ chứng từ đến báo cáo tài chính cho từng loại hình doanh nghiệp.',
    forWhom: ['Sinh viên kế toán hoặc trái ngành đang làm kế toán', 'Kế toán viên tại công ty gia đình chưa được đào tạo bài bản', 'Chủ doanh nghiệp vừa và nhỏ'],
    includes: [
      'Lớp nhỏ, không quá 10 học viên; có lớp kèm 1:1',
      'Thực hành trên chứng từ của chính doanh nghiệp học viên hoặc chứng từ mẫu',
      'Kỹ năng tin học văn phòng, đặc biệt là Excel cho kế toán',
      'Thi cuối khóa; chưa đạt được học lại không mất phí',
    ],
  },
  {
    slug: 'he-thong-ke-toan-quan-tri', group: 'dao-tao-tu-van', icon: 'gear',
    title: 'Xây dựng, vận hành hệ thống kế toán – thuế',
    summary: 'Hệ thống chứng từ và báo cáo quản trị giúp chủ doanh nghiệp nhìn rõ số liệu để ra quyết định.',
    forWhom: ['Doanh nghiệp cần tổ chức lại bộ máy kế toán', 'Doanh nghiệp cần báo cáo quản trị phục vụ điều hành'],
    includes: [
      'Đánh giá tổ chức bộ máy kế toán và các phòng ban liên quan',
      'Thiết kế lại chu trình luân chuyển chứng từ phục vụ quản trị',
      'Tư vấn phần mềm có phân hệ quản trị hoặc làm việc với nhà cung cấp hiện có',
      'Thiết lập hệ thống báo cáo quản trị theo yêu cầu quản lý',
    ],
    steps: ['Xác định mục tiêu hệ thống', 'Xác định các trung tâm trách nhiệm', 'Xây dựng hệ thống phân loại', 'Xây dựng hệ thống báo cáo quản trị'],
  },
  {
    slug: 'tu-van-rui-ro-thue', group: 'dao-tao-tu-van', icon: 'alert',
    title: 'Tư vấn rủi ro kế toán thuế, pháp lý',
    summary: 'Nhận diện sớm các điểm dễ bị cơ quan thuế đánh giá rủi ro và xử lý trước khi phát sinh hậu quả.',
    forWhom: ['Doanh nghiệp thiếu kinh nghiệm thực hiện nghĩa vụ thuế', 'Doanh nghiệp chuyển trụ sở, thay đổi nhân sự kế toán', 'Doanh nghiệp chưa có hệ thống lưu trữ chứng từ'],
    includes: [
      'Đánh giá mức độ tuân thủ thuế theo các tiêu chí quản lý rủi ro',
      'Rà soát hóa đơn, chứng từ, hợp đồng và hồ sơ lưu trữ',
      'Đề xuất biện pháp khắc phục và quy trình phòng ngừa',
    ],
  },
  // ───────── Khác
  {
    slug: 'hoa-don-dien-tu-chu-ky-so', group: 'khac', icon: 'invoice',
    title: 'Hóa đơn điện tử, chữ ký số',
    summary: 'Đại lý cung cấp hóa đơn điện tử và chữ ký số của MISA, SoftDreams; hỗ trợ cài đặt, phát hành miễn phí.',
    forWhom: ['Doanh nghiệp, hộ kinh doanh cần phát hành hóa đơn điện tử', 'Doanh nghiệp cần chữ ký số để kê khai thuế, giao dịch điện tử'],
    includes: [
      'Tư vấn gói hóa đơn điện tử phù hợp nhu cầu',
      'Hỗ trợ đăng ký tài khoản, khởi tạo mẫu và đăng ký phát hành hóa đơn',
      'Cung cấp chữ ký số USB Token và hướng dẫn sử dụng',
    ],
  },
  {
    slug: 'bao-hiem-xa-hoi', group: 'khac', icon: 'umbrella',
    title: 'Bảo hiểm xã hội cho doanh nghiệp',
    summary: 'Đăng ký mã đơn vị, báo tăng – giảm lao động đúng quy định, tránh bị phạt chậm đóng.',
    forWhom: ['Doanh nghiệp mới thành lập cần đăng ký tham gia BHXH', 'Doanh nghiệp đang hoạt động cần báo tăng, giảm lao động'],
    includes: [
      'Lập hồ sơ đăng ký đơn vị tham gia BHXH để lấy mã đơn vị',
      'Thủ tục báo tăng, giảm lao động qua giao dịch điện tử',
      'Tư vấn mức đóng và thời hạn đóng BHXH, BHYT, BHTN theo quy định hiện hành',
    ],
  },
];

export const getService = slug => services.find(s => s.slug === slug);
export const servicesByGroup = id => services.filter(s => s.group === id);
