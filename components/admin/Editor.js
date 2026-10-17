'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import { slugify } from '@/lib/slugify';

const today = () => new Date().toISOString().slice(0, 10);

async function upload(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Tải ảnh không thành công.');
  return data.url;
}

export default function Editor({ initial, categories, justSaved }) {
  const router = useRouter();
  const isNew = !initial;
  const [post, setPost] = useState(initial ?? { title: '', slug: '', date: today(), category: categories[0], excerpt: '', cover: '', body: '' });
  const [slugTouched, setSlugTouched] = useState(false);
  const [msg, setMsg] = useState(justSaved ? { type: 'ok', text: 'Đã đăng bài viết.' } : null); // { type: 'error' | 'ok', text }
  const [busy, setBusy] = useState('');
  const bodyRef = useRef(null);

  const slug = isNew ? (slugTouched ? slugify(post.slug) : slugify(post.title)) : initial.slug;
  const preview = useMemo(() => marked.parse(post.body || '*Nội dung xem trước sẽ hiện ở đây.*'), [post.body]);
  const set = key => e => setPost(p => ({ ...p, [key]: e.target.value }));

  async function onCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy('cover');
    try { setPost(p => ({ ...p, cover: '' })); const url = await upload(file); setPost(p => ({ ...p, cover: url })); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    setBusy(''); e.target.value = '';
  }

  async function onInlineImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy('image');
    try {
      const url = await upload(file);
      const el = bodyRef.current;
      const at = el?.selectionStart ?? post.body.length;
      const snippet = `\n![Mô tả ảnh](${url})\n`;
      setPost(p => ({ ...p, body: p.body.slice(0, at) + snippet + p.body.slice(at) }));
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
    setBusy(''); e.target.value = '';
  }

  async function save(e) {
    e.preventDefault();
    setBusy('save');
    setMsg(null);
    const res = await fetch(isNew ? '/api/posts' : `/api/posts/${initial.slug}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, slug }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy('');
    if (res.status === 401) { setMsg({ type: 'error', text: data.error }); router.push('/admin/login'); return; }
    if (!res.ok) { setMsg({ type: 'error', text: data.error || 'Không lưu được bài viết.' }); return; }
    if (isNew) { router.push(`/admin/editor?slug=${data.slug}&saved=1`); router.refresh(); return; }
    setMsg({ type: 'ok', text: 'Đã lưu bài viết.' });
    router.refresh();
  }

  return (
    <form onSubmit={save}>
      <div className="admin-bar">
        <h1>{isNew ? 'Viết bài mới' : 'Sửa bài viết'}</h1>
        <div className="actions">
          <Link className="btn btn-ghost" href="/admin">Về danh sách</Link>
          {!isNew && <Link className="btn btn-ghost" href={`/bai-viet/${initial.slug}`} target="_blank">Xem bài</Link>}
          <button className="btn btn-accent" type="submit" disabled={busy !== ''}>{busy === 'save' ? 'Đang lưu…' : isNew ? 'Đăng bài' : 'Lưu thay đổi'}</button>
        </div>
      </div>
      {msg && <p className={msg.type === 'error' ? 'form-error' : 'form-ok'} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}

      <div className="editor-grid">
        <div>
          <div className="field">
            <label htmlFor="title">Tiêu đề</label>
            <input id="title" value={post.title} onChange={set('title')} required maxLength={160} />
          </div>
          <div className="field">
            <label htmlFor="slug">Đường dẫn</label>
            {isNew
              ? <input id="slug" value={slugTouched ? post.slug : slug} onChange={e => { setSlugTouched(true); set('slug')(e); }} />
              : <input id="slug" value={slug} readOnly />}
            <small>/bai-viet/{slug || '…'}{!isNew && ' — không đổi được sau khi đăng'}</small>
          </div>
          <div className="editor-meta">
            <div className="field">
              <label htmlFor="category">Chuyên mục</label>
              <select id="category" value={post.category} onChange={set('category')}>
                {[...new Set([...categories, post.category].filter(Boolean))].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="date">Ngày đăng</label>
              <input id="date" type="date" value={post.date} onChange={set('date')} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="excerpt">Tóm tắt</label>
            <textarea id="excerpt" value={post.excerpt} onChange={set('excerpt')} rows={3} style={{ minHeight: 0, fontFamily: 'inherit' }} maxLength={300} />
            <small>Hiện trên thẻ bài viết và khi chia sẻ lên mạng xã hội.</small>
          </div>
          <div className="field">
            <label htmlFor="cover">Ảnh bìa</label>
            <input id="cover" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={onCover} disabled={busy !== ''} />
            <small>{busy === 'cover' ? 'Đang tải ảnh…' : post.cover ? <>Đã có ảnh bìa · <button type="button" className="linklike" onClick={() => setPost(p => ({ ...p, cover: '' }))}>Bỏ ảnh bìa</button></> : 'Không bắt buộc. Tối đa 4MB, nên dùng ảnh ngang 16:9.'}</small>
          </div>
          <div className="field">
            <label htmlFor="body">Nội dung (Markdown)</label>
            <div className="md-help">
              <code>## Tiêu đề mục</code> · <code>**in đậm**</code> · <code>- gạch đầu dòng</code> · <code>1. đánh số</code> · <code>&gt; trích dẫn</code> · <code>[chữ](https://link)</code>
            </div>
            <textarea id="body" ref={bodyRef} value={post.body} onChange={set('body')} />
            <label className="btn btn-ghost upload-inline">
              {busy === 'image' ? 'Đang tải ảnh…' : 'Chèn ảnh vào nội dung'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={onInlineImage} disabled={busy !== ''} hidden />
            </label>
          </div>
        </div>
        <div className="editor-preview" aria-label="Xem trước">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {post.cover && <img src={post.cover} alt="" style={{ borderRadius: 12, marginBottom: 16 }} />}
          <h1 style={{ fontSize: 28, color: 'var(--primary-ink)' }}>{post.title || 'Tiêu đề bài viết'}</h1>
          <div className="prose" dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
      </div>
    </form>
  );
}
