'use client';

import { useState, useEffect } from 'react';

interface AnnouncementProps {
  announcement: string | null | undefined;
}

export default function Announcement({ announcement }: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!announcement || announcement.trim() === "") return;

    const lastSeen = localStorage.getItem('hasSeenAnnouncement');
    if (lastSeen !== announcement) {
      setIsVisible(true);
    }
  }, [announcement]);

  const handleClose = () => {
    setIsVisible(false);
    if (announcement) {
      localStorage.setItem('hasSeenAnnouncement', announcement);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            🎬✨小徐影院公告✨🎬
          </h2>
          <div style={{ height: '2px', width: '32px', backgroundColor: '#1da055', marginTop: '8px' }}></div>
        </div>
        <div style={{
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #1da055',
          padding: '16px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '24px'
        }}>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '16px', lineHeight: '1.6' }}>
            {announcement}
          </p>
        </div>
        <button
          onClick={handleClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1da055',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#168846'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1da055'}
        >
          开始观影
        </button>
      </div>
    </div>
  );
}