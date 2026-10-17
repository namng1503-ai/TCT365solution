'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteButton({ slug, title }) {
  const router = useRouter();
  const [state, setState] = useState('idle'); // idle | confirm | busy
  const [error, setError] = useState('');

  async function remove() {
    setState('busy');
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Xoá không thành công.');
      setState('idle');
      return;
    }
    router.refresh();
  }

  if (state === 'confirm' || state === 'busy') {
    return (
      <>
        <button type="button" className="btn btn-danger" onClick={remove} disabled={state === 'busy'} aria-label={`Xác nhận xoá bài ${title}`}>
          {state === 'busy' ? 'Đang xoá…' : 'Xác nhận xoá'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setState('idle')} disabled={state === 'busy'}>Huỷ</button>
      </>
    );
  }
  return (
    <>
      <button type="button" className="btn btn-danger" onClick={() => setState('confirm')} aria-label={`Xoá bài ${title}`}>Xoá</button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button type="button" className="btn btn-ghost" onClick={async () => { await fetch('/api/logout', { method: 'POST' }); router.push('/admin/login'); }}>
      Đăng xuất
    </button>
  );
}
