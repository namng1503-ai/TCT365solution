import Icon from './Icons';
import { site, telHref } from '@/data/site';

export default function FloatingContact() {
  return (
    <div className="float-contact">
      <a href={site.zalo} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho TCT365" className="float-zalo">Zalo</a>
      <a href={telHref} aria-label={`Gọi hotline ${site.hotline}`} className="float-call"><Icon name="phone" /></a>
    </div>
  );
}
