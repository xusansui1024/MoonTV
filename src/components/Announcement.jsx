'use client'; // Next.js App Router 需要这行来允许在客户端运行

import { useState, useEffect } from 'react';

export default function Announcement() {
  const [isVisible, setIsVisible] = useState(false);
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    // 网页加载时，检查 LocalStorage 有没有“不再提醒”的记录
    const hide = localStorage.getItem('hide_moontv_announcement');
    // 如果没有记录，就显示弹窗
    if (hide !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    // 如果用户勾选了“不再提醒”，就写入 LocalStorage 永久保存
    if (neverShow) {
      localStorage.setItem('hide_moontv_announcement', 'true');
    }
    // 关闭弹窗
    setIsVisible(false);
  };

  // 如果设为不显示，就直接 return null (什么都不渲染)
  if (!isVisible) return null;

  return (
    // 半透明黑色背景遮罩
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999 // 确保在最上层
    }}>
      {/* 白色的弹窗本体 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        color: '#333'
      }}>
        {/* 📝 这里可以自定义你的标题 */}
        <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: 'bold' }}>
          🎬小徐的私人影院公告
        </h2>
        
        {/* 📝 这里可以自定义你的公告内容 */}
        <p style={{ lineHeight: '1.6', fontSize: '15px' }}>
          如影片封面没有正常加载,请尝试点击右上角用户头像-设置并点击“重置!!!
        </p>

        {/* 不再提醒勾选框 */}
        <label style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
          <input 
            type="checkbox" 
            checked={neverShow} 
            onChange={(e) => setNeverShow(e.target.checked)} 
            style={{ marginRight: '8px', width: '16px', height: '16px' }}
          />
          我知道了，下次不再提醒
        </label>

        {/* 关闭按钮 */}
        <button 
          onClick={handleClose}
          style={{
            marginTop: '20px', width: '100%', padding: '10px',
            backgroundColor: '#10b981', color: 'white',
            border: 'none', borderRadius: '6px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          开始观影
        </button>
      </div>
    </div>
  );
}
