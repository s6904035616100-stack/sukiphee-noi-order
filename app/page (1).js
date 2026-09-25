'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem 1rem',
    fontFamily: 'sans-serif',
    background: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.4rem',
    marginTop: '1rem',
  },
  input: {
    width: '100%',
    fontSize: '1.5rem',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '2px solid #ccc',
    boxSizing: 'border-box',
  },
  bigButton: {
    width: '100%',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    padding: '1rem',
    marginTop: '1.5rem',
    borderRadius: '12px',
    border: 'none',
    background: '#1a7f37',
    color: '#fff',
    cursor: 'pointer',
  },
  bigButtonDisabled: {
    background: '#9bbfa8',
    cursor: 'not-allowed',
  },
  warningBox: {
    background: '#fff3e0',
    border: '2px solid #e8590c',
    borderRadius: '14px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  warningTitle: {
    color: '#b3260a',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
  },
  warningButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '0.85rem',
    marginTop: '1rem',
    borderRadius: '10px',
    border: 'none',
    background: '#e8590c',
    color: '#fff',
    cursor: 'pointer',
  },
  errorText: {
    color: '#c0392b',
    fontSize: '1rem',
    marginTop: '0.75rem',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '400px',
    border: '3px solid #c0392b',
  },
  modalTitle: {
    color: '#c0392b',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  modalRow: {
    fontSize: '1.15rem',
    marginBottom: '0.4rem',
  },
  modalButtonRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  modalCancelButton: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '0.85rem',
    borderRadius: '10px',
    border: '2px solid #999',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  modalConfirmButton: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '0.85rem',
    borderRadius: '10px',
    border: 'none',
    background: '#c0392b',
    color: '#fff',
    cursor: 'pointer',
  },
  qrWrap: {
    textAlign: 'center',
  },
  qrImage: {
    width: '260px',
    height: '260px',
    maxWidth: '100%',
  },
  qrSummary: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: '0.95rem',
    wordBreak: 'break-all',
    color: '#333',
  },
  copyButton: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    border: '2px solid #1a7f37',
    background: '#fff',
    color: '#1a7f37',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  newTableButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '0.9rem',
    marginTop: '1.5rem',
    borderRadius: '12px',
    border: 'none',
    background: '#1a56db',
    color: '#fff',
    cursor: 'pointer',
  },
};

const emptyForm = { tableNumber: '', adultCount: '', childCount: '' };

export default function GenerateQrPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [existingSession, setExistingSession] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState('');

  const [qrResult, setQrResult] = useState(null);
  const [copied, setCopied] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildOrderUrl(tableNumber) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/order/${tableNumber}`;
  }

  async function handleOpenTable() {
    setErrorMsg('');

    const tableNumber = parseInt(form.tableNumber, 10);
    if (!form.tableNumber || Number.isNaN(tableNumber)) {
      setErrorMsg('กรุณากรอกเลขโต๊ะให้ถูกต้อง');
      return;
    }
    const adultCount = form.adultCount === '' ? 0 : parseInt(form.adultCount, 10);
    const childCount = form.childCount === '' ? 0 : parseInt(form.childCount, 10);
    if (Number.isNaN(adultCount) || Number.isNaN(childCount)) {
      setErrorMsg('กรุณากรอกจำนวนผู้ใหญ่/เด็กให้ถูกต้อง');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: existing, error: checkError } = await supabase
        .from('sessions')
        .select('id, adult_count, child_count, created_at')
        .eq('table_number', tableNumber)
        .eq('status', 'open')
        .maybeSingle();

      if (checkError) {
        setErrorMsg('เกิดข้อผิดพลาดในการตรวจสอบโต๊ะ กรุณาลองใหม่');
        setIsSubmitting(false);
        return;
      }

      if (existing) {
        setExistingSession({ ...existing, table_number: tableNumber });
        setIsSubmitting(false);
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from('sessions')
        .insert({
          table_number: tableNumber,
          adult_count: adultCount,
          child_count: childCount,
          status: 'open',
        })
        .select()
        .single();

      if (insertError || !inserted) {
        setErrorMsg('เปิดโต๊ะไม่สำเร็จ กรุณาลองใหม่');
        setIsSubmitting(false);
        return;
      }

      setQrResult({
        tableNumber,
        adultCount,
        childCount,
        url: buildOrderUrl(tableNumber),
      });
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  }

  function minutesElapsed(createdAt) {
    const created = new Date(createdAt).getTime();
    const diffMs = Date.now() - created;
    return Math.max(0, Math.floor(diffMs / 60000));
  }

  async function handleConfirmCloseOldSession() {
    if (!existingSession) return;
    setIsClosing(true);
    setCloseError('');
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update({ status: 'closed' })
        .eq('id', existingSession.id)
        .eq('status', 'open')
        .select();

      if (error) {
        setCloseError('ปิดออเดอร์ไม่สำเร็จ กรุณาลองใหม่');
        setIsClosing(false);
        return;
      }

      if (!data || data.length === 0) {
        setCloseError('ออเดอร์นี้ถูกปิดไปแล้ว');
        setIsClosing(false);
        setShowConfirm(false);
        setExistingSession(null);
        return;
      }

      setShowConfirm(false);
      setExistingSession(null);
    } catch (err) {
      setCloseError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsClosing(false);
    }
  }

  function handleCopyLink() {
    if (!qrResult) return;
    navigator.clipboard
      .writeText(qrResult.url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  function handleNewTable() {
    setQrResult(null);
    setForm(emptyForm);
    setErrorMsg('');
    setExistingSession(null);
    setCloseError('');
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>เปิดโต๊ะ</h1>

        {existingSession && !qrResult && (
          <div style={styles.warningBox}>
            <div style={styles.warningTitle}>
              โต๊ะนี้มีลูกค้าอยู่ระหว่างทานอาหาร กรุณาปิดออเดอร์เดิมก่อน
            </div>
            {closeError && <div style={styles.errorText}>{closeError}</div>}
            <button
              type="button"
              style={styles.warningButton}
              onClick={() => setShowConfirm(true)}
            >
              ปิดออเดอร์เดิม
            </button>
          </div>
        )}

        {!qrResult && (
          <div style={styles.card}>
            <label style={styles.label}>เลขโต๊ะ</label>
            <input
              style={styles.input}
              type="number"
              inputMode="numeric"
              value={form.tableNumber}
              onChange={(e) => handleChange('tableNumber', e.target.value)}
              disabled={isSubmitting}
            />

            <label style={styles.label}>จำนวนผู้ใหญ่</label>
            <input
              style={styles.input}
              type="number"
              inputMode="numeric"
              value={form.adultCount}
              onChange={(e) => handleChange('adultCount', e.target.value)}
              disabled={isSubmitting}
            />

            <label style={styles.label}>จำนวนเด็ก</label>
            <input
              style={styles.input}
              type="number"
              inputMode="numeric"
              value={form.childCount}
              onChange={(e) => handleChange('childCount', e.target.value)}
              disabled={isSubmitting}
            />

            {errorMsg && <div style={styles.errorText}>{errorMsg}</div>}

            <button
              type="button"
              style={{
                ...styles.bigButton,
                ...(isSubmitting ? styles.bigButtonDisabled : {}),
              }}
              onClick={handleOpenTable}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเปิดโต๊ะ...' : 'เปิดโต๊ะ'}
            </button>
          </div>
        )}

        {qrResult && (
          <div style={styles.card}>
            <div style={styles.qrWrap}>
              <img
                style={styles.qrImage}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                  qrResult.url
                )}`}
                alt={`QR โต๊ะ ${qrResult.tableNumber}`}
              />
              <div style={styles.qrSummary}>
                โต๊ะ {qrResult.tableNumber} · ผู้ใหญ่ {qrResult.adultCount} · เด็ก{' '}
                {qrResult.childCount}
              </div>
              <div style={styles.linkRow}>
                <span style={styles.linkText}>{qrResult.url}</span>
                <button type="button" style={styles.copyButton} onClick={handleCopyLink}>
                  {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                </button>
              </div>
            </div>
            <button type="button" style={styles.newTableButton} onClick={handleNewTable}>
              เปิดโต๊ะใหม่
            </button>
          </div>
        )}
      </div>

      {showConfirm && existingSession && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>ยืนยันปิดออเดอร์เดิม</div>
            <div style={styles.modalRow}>โต๊ะ {existingSession.table_number}</div>
            <div style={styles.modalRow}>
              ผู้ใหญ่ {existingSession.adult_count} · เด็ก {existingSession.child_count}
            </div>
            <div style={styles.modalRow}>
              เปิดมาแล้ว {minutesElapsed(existingSession.created_at)} นาที
            </div>
            <div style={styles.modalButtonRow}>
              <button
                type="button"
                style={styles.modalCancelButton}
                onClick={() => setShowConfirm(false)}
                disabled={isClosing}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={handleConfirmCloseOldSession}
                disabled={isClosing}
              >
                {isClosing ? 'กำลังปิด...' : 'ยืนยันปิดโต๊ะเดิม'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
