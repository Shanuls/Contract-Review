import React, { useState } from 'react';
import { Eye, EyeOff, FileCheck2, ArrowRight, ShieldCheck, UsersRound, Files, CheckCircle2, LockKeyhole } from 'lucide-react';
import './LoginPage.css';

// Demo-only sign in. No real authentication or password recovery is provided.
export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [dialog, setDialog] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !password.trim()) { setError('Enter your username and password.'); return; }
    setError('');
    onLogin({ name: name.trim().slice(0, 60), role: 'Reviewer', remember });
  };
  return <main className="queue-login queue-login--concept13">
    <header className="queue-login-page-header">
      <div className="queue-login-page-brand"><FileCheck2 size={30}/><strong>Contract Review</strong></div>
      <span>Manage &nbsp;•&nbsp; Review &nbsp;•&nbsp; Collaborate</span>
    </header>
    <section className="queue-login-welcome" aria-label="Contract Review overview">
      <span className="queue-login-eyebrow">WELCOME TO</span>
      <h2>Contract<br/><em>Review</em></h2>
      <p>A simple and secure way to manage your contract review workflow.</p>
      <div className="queue-login-benefits">
        <div><span><Files size={23}/></span><section><strong>Centralized Contracts</strong><small>Access all your documents in one place</small></section></div>
        <div><span><UsersRound size={23}/></span><section><strong>Track Reviews</strong><small>Stay updated on review status</small></section></div>
        <div><span><ShieldCheck size={23}/></span><section><strong>Secure &amp; Reliable</strong><small>Keep your review workflow organized</small></section></div>
      </div>
      <div className="queue-login-art" aria-hidden="true"><div className="queue-login-art-back"/><div className="queue-login-art-document"><div/><div/><div/><div/><CheckCircle2 size={61}/></div><div className="queue-login-art-floating"><FileCheck2 size={26}/></div></div>
      <span className="queue-login-tagline">Review smarter. Decide faster.</span>
    </section>
    <div className="queue-login-form-side"><form onSubmit={submit} className="queue-login-card">
    <div className="queue-login-brand"><span className="queue-login-logo"><FileCheck2 size={43} strokeWidth={1.8}/></span><strong>CONTRACT REVIEW</strong><span className="queue-login-accent" aria-hidden="true" /></div>
    <h1>Welcome Back</h1>
    <p className="queue-login-subtitle">Sign in to your account</p>
    <label htmlFor="queue-login-name">Username</label>
    <input id="queue-login-name" autoFocus autoComplete="username" maxLength={60} value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your username" />
    <label htmlFor="queue-login-password">Password</label>
    <div className="queue-login-password"><input id="queue-login-password" type={showPassword?'text':'password'} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" /><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
    <div className="queue-login-options"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Remember me</label><button type="button" onClick={()=>setDialog('forgot')}>Forgot password?</button></div>
    {error && <p className="queue-login-error" role="alert">{error}</p>}
    <button className="queue-login-submit" type="submit">Sign In <ArrowRight size={17}/></button>
    {dialog && <div className="queue-login-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDialog('')}}><section className="queue-login-dialog" role="dialog" aria-modal="true" aria-label="Password recovery"><h2>Forgot Password?</h2><p>Password recovery requires a connected authentication service. This demo does not send reset emails.</p><button type="button" onClick={()=>setDialog('')}>Close</button></section></div>}
  </form><div className="queue-login-access"><LockKeyhole size={14}/> Authorized access only</div></div></main>;
}
