import Link from 'next/link';
import Icon from '@/components/Icons';
import Hero3D from '@/components/Hero3D';
import ClientRing from '@/components/ClientRing';
import TiltCard from '@/components/TiltCard';
import PostCard from '@/components/PostCard';
import { site, about, processSteps, telHref, mapEmbed, mapLink } from '@/data/site';
import { groups, services, servicesByGroup } from '@/data/services';
import { getClientLogos } from '@/lib/clients';
import { getPosts } from '@/lib/posts';

export const revalidate = 60;

const isPending = v => String(v).includes('CẦN BỔ SUNG');

export default async function Home() {
  const logos = getClientLogos();
  const posts = (await getPosts().catch(() => [])).slice(0, 3);

  return (
    <>
      {/* ───────── Hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Đại lý thuế TCT365 · Hà Nội</p>
            <h1>Kế toán, thuế và pháp lý doanh nghiệp — trọn gói, đúng hạn, an toàn.</h1>
            <p className="hero-lead">
              Chúng tôi lo sổ sách, tờ khai, quyết toán và giấy phép để bạn dành thời gian cho việc kinh doanh.
              Nhận chứng từ tận nơi hoặc qua Zalo, email.
            </p>
            <div className="hero-cta">
              <a className="btn btn-gold btn-lg" href={telHref}><Icon name="phone" size={20} /> Gọi tư vấn {site.hotline}</a>
              <Link className="btn btn-ghost btn-lg" href="#dich-vu">Xem các dịch vụ</Link>
            </div>
            <ul className="hero-points">
              <li><Icon name="shield" size={20} /> Đại lý thuế được cơ quan thuế cấp phép</li>
              <li><Icon name="check" size={20} /> Chịu trách nhiệm với chứng từ, báo cáo do chúng tôi lập</li>
              <li><Icon name="check" size={20} /> Bảo mật thông tin kế toán, kể cả sau hợp đồng</li>
            </ul>
          </div>
          <Hero3D />
        </div>
      </section>

      {/* ───────── Giới thiệu */}
      <section id="gioi-thieu" className="section">
        <div className="wrap about-grid">
          <div>
            <h2 className="section-title">Về TCT365</h2>
            <blockquote className="about-quote">“{site.slogan}.”</blockquote>
            <p className="about-intro">{about.intro}</p>
            <dl className="facts">
              {about.facts.map(f => (
                <div key={f.label} className={isPending(f.value) ? 'pending' : ''}>
                  <dt>{f.label}</dt><dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="pillars">
            {about.pillars.map(p => (
              <div key={p.title} className="pillar">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
            <div className="pillar pillar-motto">
              <h3>Giá trị cốt lõi</h3>
              <p className="motto">{site.motto.map(m => <span key={m}>{m}</span>)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Dịch vụ */}
      <section id="dich-vu" className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">Dịch vụ</h2>
            <p>{services.length} nghiệp vụ trong {groups.length} nhóm — chọn đúng việc bạn cần, hoặc để chúng tôi lo trọn gói.</p>
          </div>
          <div className="service-index">
            {groups.map(g => (
              <TiltCard key={g.id} className="service-group">
                <div className="sg-icon"><Icon name={g.icon} size={30} /></div>
                <h3>{g.title}</h3>
                <p className="sg-lead">{g.lead}</p>
                <ul>
                  {servicesByGroup(g.id).map(s => (
                    <li key={s.slug}>
                      <Link href={`/dich-vu/${s.slug}`}>
                        <span>{s.title}</span>
                        <Icon name="arrow" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Quy trình */}
      <section id="quy-trinh" className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">Quy trình làm việc</h2>
            <p>Năm bước rõ ràng, bạn luôn biết hồ sơ của mình đang ở đâu.</p>
          </div>
          <ol className="steps">
            {processSteps.map((s, i) => (
              <li key={s.title}>
                <span className="step-no">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Khách hàng */}
      <section id="khach-hang" className="section section-dark">
        <div className="wrap clients-grid">
          <div>
            <h2 className="section-title">Khách hàng đồng hành</h2>
            <p>TCT365 hướng tới sự thành công cùng khách hàng. Một số doanh nghiệp đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
          </div>
          <ClientRing logos={logos} />
        </div>
      </section>

      {/* ───────── Bài viết */}
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head-row">
            <div>
              <h2 className="section-title">Kiến thức kế toán – tài chính</h2>
              <p>Hướng dẫn, cập nhật chính sách thuế và kinh nghiệm thực tế từ đội ngũ TCT365.</p>
            </div>
            <Link className="btn btn-ghost" href="/bai-viet">Tất cả bài viết</Link>
          </div>
          {posts.length
            ? <div className="post-grid">{posts.map(p => <PostCard key={p.slug} post={p} />)}</div>
            : <p className="empty">Chưa có bài viết nào.</p>}
        </div>
      </section>

      {/* ───────── Liên hệ */}
      <section id="lien-he" className="section section-tint">
        <div className="wrap contact-grid">
          <div className="contact-card">
            <h2 className="section-title">Liên hệ</h2>
            <p>Gọi hoặc nhắn tin để được tư vấn thủ tục ban đầu về thuế, kế toán.</p>
            <ul className="contact-list">
              <li><Icon name="pin" /><div><strong>Văn phòng</strong><a href={mapLink} target="_blank" rel="noopener noreferrer">{site.address}</a></div></li>
              <li><Icon name="phone" /><div><strong>Hotline ({site.hotlineContact})</strong><a href={telHref}>{site.hotline}</a></div></li>
              <li><Icon name="mail" /><div><strong>Email</strong><a href={`mailto:${site.email}`}>{site.email}</a></div></li>
              <li><Icon name="chat" /><div><strong>Zalo / Facebook</strong><span><a href={site.zalo} target="_blank" rel="noopener noreferrer">Zalo</a> · <a href={site.facebook} target="_blank" rel="noopener noreferrer">facebook.com/TCT365</a></span></div></li>
            </ul>
            <div className="hero-cta">
              <a className="btn btn-gold" href={telHref}><Icon name="phone" size={18} /> Gọi ngay</a>
              <a className="btn btn-teal" href={site.zalo} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> Nhắn Zalo</a>
            </div>
          </div>
          <div className="map">
            <iframe title={`Bản đồ: ${site.address}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>
    </>
  );
}
