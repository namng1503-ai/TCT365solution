'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: new FormData(e.currentTarget).get('password') }),
    });
    if (res.ok) {
      router.push('/admin');
      router.refresh();
      return;
    }
    setError((await res.json().catch(() => ({}))).error || 'Đăng nhập không thành công.');
    setBusy(false);
  }

  return (
    <form className="card-form" onSubmit={submit}>
      <h1>Đăng nhập quản trị</h1>
      <p>Dành cho quản trị viên website TCT365.</p>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
    </form>
  );
}
