'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const ADULT_PRICE = 289;
const CHILD_PRICE = 145;
const MAX_CART_ITEMS = 10;
const MAX_QTY_PER_ITEM = 5;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafafa',
    fontFamily: 'sans-serif',
    paddingBottom: '90px',
  },
  centerScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  centerText: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    lineHeight: 1.6,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    background: '#b3260a',
    color: '#fff',
    padding: '0.9rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  billButton: {
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0.55rem 1rem',
    borderRadius: '999px',
    border: '2px solid #fff',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
  },
  tabsWrap: {
    position: 'sticky',
    top: '54px',
    zIndex: 19,
    display: 'flex',
    overflowX: 'auto',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: '#fff',
    borderBottom: '1px solid #eee',
    WebkitOverflowScrolling: 'touch',
  },
  tabButton: {
    flexShrink: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0.6rem 1.1rem',
    borderRadius: '999px',
    border: '2px solid #ddd',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabButtonActive: {
    border: '2px solid #b3260a',
    background: '#b3260a',
    color: '#fff',
  },
  itemList: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  itemCard: {
    background: '#fff',
    borderRadius: '14px',
    padding: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  itemName: {
    fontSize: '1.15rem',
    fontWeight: 'bold',
    flex: 1,
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  qtyBtn: {
    width: '38px',
    height: '38px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '2px solid #ddd',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  qtyNumber: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    minWidth: '24px',
    textAlign: 'center',
  },
  addBtn: {
    width: '44px',
    height: '44px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: 'none',
    background: '#1a7f37',
    color: '#fff',
    cursor: 'pointer',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '1.1rem',
    padding: '2rem 0',
  },
  cartBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    background: '#1a1a1a',
    color: '#fff',
    padding: '0.9rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  cartBarText: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  cartBarAction: {
    fontSize: '1rem',
    color: '#9fd8b0',
    fontWeight: 'bold',
  },
  cartPanelOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 40,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cartPanel: {
    background: '#fff',
    width: '100%',
    maxWidth: '520px',
    borderTopLeftRadius: '18px',
    borderTopRightRadius: '18px',
    padding: '1.25rem',
    maxHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
  },
  cartPanelTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  cartPanelList: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '1rem',
  },
  cartLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1.05rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  removeBtn: {
    fontSize: '0.9rem',
    color: '#c0392b',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  sendButton: {
    width: '100%',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    background: '#1a7f37',
    color: '#fff',
    cursor: 'pointer',
  },
  sendButtonDisabled: {
    background: '#9bbfa8',
    cursor: 'not-allowed',
  },
  closePanelButton: {
    width: '100%',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0.75rem',
    marginTop: '0.6rem',
    borderRadius: '10px',
    border: '2px solid #ccc',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a7f37',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '999px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    zIndex: 45,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
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
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  modalTotal: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#b3260a',
    margin: '0.75rem 0 1.25rem',
  },
  modalRow: {
    fontSize: '1.05rem',
    marginBottom: '0.3rem',
  },
  modalButtonRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  modalCancelButton: {
    flex: 1,
    fontSize: '1.05rem',
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
    fontSize: '1.05rem',
    fontWeight: 'bold',
    padding: '0.85rem',
    borderRadius: '10px',
    border: 'none',
    background: '#b3260a',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default function OrderPage({ params }) {
  const { tableNumber } = use(params);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null); // { id, adult_count, child_count }
  const [tableNotOpen, setTableNotOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [quantities, setQuantities] = useState({}); // { [itemId]: qty }

  const [cart, setCart] = useState([]); // [{ key, name, quantity }]
  const [cartOpen, setCartOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [showBillConfirm, setShowBillConfirm] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState('');
  const [billed, setBilled] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      const parsedTableNumber = parseInt(tableNumber, 10);

      const { data: sessionRow, error: sessionError } = await supabase
        .from('sessions')
        .select('id, adult_count, child_count')
        .eq('table_number', parsedTableNumber)
        .eq('status', 'open')
        .maybeSingle();

      if (isCancelled) return;

      if (sessionError || !sessionRow) {
        setTableNotOpen(true);
        setLoading(false);
        return;
      }

      setSession(sessionRow);

      const { data: categoryRows } = await supabase
        .from('menu_categories')
        .select('id, name, sort_order')
        .order('sort_order', { ascending: true });

      const { data: itemRows } = await supabase
        .from('menu_items')
        .select('id, category_id, name');

      if (isCancelled) return;

      const safeCategories = categoryRows || [];
      setCategories(safeCategories);
      setItems(itemRows || []);
      if (safeCategories.length > 0) {
        setActiveCategoryId(safeCategories[0].id);
      }
      setLoading(false);
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [tableNumber]);

  function getQty(itemId) {
    return quantities[itemId] || 1;
  }

  function changeQty(itemId, delta) {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const next = Math.min(MAX_QTY_PER_ITEM, Math.max(1, current + delta));
      return { ...prev, [itemId]: next };
    });
  }

  function handleAddToCart(item) {
    if (cart.length >= MAX_CART_ITEMS) return;
    const qty = getQty(item.id);
    setCart((prev) => [
      ...prev,
      { key: `${item.id}-${Date.now()}-${Math.random()}`, name: item.name, quantity: qty },
    ]);
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  }

  function handleRemoveFromCart(key) {
    setCart((prev) => prev.filter((line) => line.key !== key));
  }

  async function handleSendOrder() {
    if (cart.length === 0 || !session) return;
    setSending(true);
    setSendError('');
    try {
      const parsedTableNumber = parseInt(tableNumber, 10);
      const orderItems = cart.map((line) => ({ name: line.name, quantity: line.quantity }));

      const { error } = await supabase.from('orders').insert({
        session_id: session.id,
        table_number: parsedTableNumber,
        items: orderItems,
        status: 'received',
      });

      if (error) {
        setSendError('ส่งออเดอร์ไม่สำเร็จ กรุณาลองใหม่');
        setSending(false);
        return;
      }

      setCart([]);
      setCartOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      setSendError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSending(false);
    }
  }

  function getBillTotal() {
    if (!session) return 0;
    return session.adult_count * ADULT_PRICE + session.child_count * CHILD_PRICE;
  }

  async function handleConfirmBill() {
    if (!session) return;
    setBillLoading(true);
    setBillError('');
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'closed' })
        .eq('id', session.id)
        .eq('status', 'open');

      if (error) {
        setBillError('ปิดโต๊ะไม่สำเร็จ กรุณาแจ้งพนักงาน');
        setBillLoading(false);
        return;
      }

      setShowBillConfirm(false);
      setBilled(true);
    } catch (err) {
      setBillError('เกิดข้อผิดพลาด กรุณาแจ้งพนักงาน');
    } finally {
      setBillLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.centerText}>กำลังโหลด...</div>
      </div>
    );
  }

  if (tableNotOpen) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.centerText}>โต๊ะนี้ยังไม่เปิดใช้งาน กรุณาแจ้งพนักงาน</div>
      </div>
    );
  }

  if (billed) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.centerText}>ขอบคุณที่ใช้บริการ</div>
      </div>
    );
  }

  const visibleItems = items.filter((item) => item.category_id === activeCategoryId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>โต๊ะ {tableNumber}</div>
        <button
          type="button"
          style={styles.billButton}
          onClick={() => setShowBillConfirm(true)}
        >
          เรียกเก็บเงิน
        </button>
      </div>

      <div style={styles.tabsWrap}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            style={{
              ...styles.tabButton,
              ...(activeCategoryId === cat.id ? styles.tabButtonActive : {}),
            }}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div style={styles.itemList}>
        {visibleItems.length === 0 && <div style={styles.emptyText}>ไม่มีเมนูในหมวดนี้</div>}
        {visibleItems.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <div style={styles.itemName}>{item.name}</div>
            <div style={styles.qtyControls}>
              <button
                type="button"
                style={styles.qtyBtn}
                onClick={() => changeQty(item.id, -1)}
              >
                −
              </button>
              <div style={styles.qtyNumber}>{getQty(item.id)}</div>
              <button
                type="button"
                style={styles.qtyBtn}
                onClick={() => changeQty(item.id, 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              style={styles.addBtn}
              onClick={() => handleAddToCart(item)}
              disabled={cart.length >= MAX_CART_ITEMS}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={styles.cartBar} onClick={() => setCartOpen(true)}>
          <div style={styles.cartBarText}>ตะกร้า: {cart.length} รายการ</div>
          <div style={styles.cartBarAction}>ดูตะกร้า</div>
        </div>
      )}

      {showToast && <div style={styles.toast}>ส่งออเดอร์แล้ว</div>}

      {cartOpen && (
        <div style={styles.cartPanelOverlay} onClick={() => setCartOpen(false)}>
          <div style={styles.cartPanel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.cartPanelTitle}>ตะกร้าของคุณ</div>
            <div style={styles.cartPanelList}>
              {cart.map((line) => (
                <div key={line.key} style={styles.cartLine}>
                  <span>
                    {line.name} × {line.quantity}
                  </span>
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => handleRemoveFromCart(line.key)}
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
            {sendError && <div style={styles.modalRow}>{sendError}</div>}
            <button
              type="button"
              style={{
                ...styles.sendButton,
                ...(sending || cart.length === 0 ? styles.sendButtonDisabled : {}),
              }}
              onClick={handleSendOrder}
              disabled={sending || cart.length === 0}
            >
              {sending ? 'กำลังส่ง...' : 'ส่งออเดอร์'}
            </button>
            <button
              type="button"
              style={styles.closePanelButton}
              onClick={() => setCartOpen(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {showBillConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>ยืนยันเรียกเก็บเงิน</div>
            <div style={styles.modalRow}>
              ผู้ใหญ่ {session.adult_count} คน × {ADULT_PRICE} บาท
            </div>
            <div style={styles.modalRow}>
              เด็ก {session.child_count} คน × {CHILD_PRICE} บาท
            </div>
            <div style={styles.modalTotal}>รวม {getBillTotal()} บาท</div>
            {billError && <div style={styles.modalRow}>{billError}</div>}
            <div style={styles.modalButtonRow}>
              <button
                type="button"
                style={styles.modalCancelButton}
                onClick={() => setShowBillConfirm(false)}
                disabled={billLoading}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={handleConfirmBill}
                disabled={billLoading}
              >
                {billLoading ? 'กำลังปิด...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
