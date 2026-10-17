/** @type {import('next').NextConfig} */
export default {
  // Trang được render lại trên Vercel (ISR / động) vẫn đọc được logo khách hàng và bài mẫu.
  outputFileTracingIncludes: {
    '/': ['./public/clients/**/*', './content/posts/**/*'],
    '/**': ['./content/posts/**/*'],
  },
};
