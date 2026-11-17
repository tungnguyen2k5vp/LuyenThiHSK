import React, { useState,useEffect,useRef } from 'react';
import { ExamNavigatorVM, ExamTimerVM, SkillId } from '../../types/viewmodels';
import { ExamNavigator } from './ExamNavigator';
import { ExamTimerCard } from './ExamTimerCard';
import { DigitalTimer } from '../../primitives/DigitalTimer/DigitalTimer';
import { Button } from '../../primitives/Button/Button';

export interface ExamRoomShellProps {
  examTitle: string;
  mode: 'practice' | 'mock';
  navigator: ExamNavigatorVM;
  timer: ExamTimerVM;
  onSelectSkill: (skill: SkillId) => void;
  onSelectQuestion: (index: number) => void;
  onSubmitExam: () => void;
  onBack: () => void;
  children: React.ReactNode;
  refined?: boolean;
}

export const ExamRoomShell: React.FC<ExamRoomShellProps> = ({
  examTitle,
  mode,
  navigator,
  timer,
  onSelectSkill,
  onSelectQuestion,
  onSubmitExam,
  onBack,
  children,
  refined=false,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const drawerRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!isMobileDrawerOpen)return;const previous=document.activeElement as HTMLElement|null;
    const nodes=()=>[...(drawerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]')??[])].filter(e=>e.getClientRects().length);
    nodes()[0]?.focus();const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setIsMobileDrawerOpen(false)}if(event.key==='Tab'){const list=nodes(),first=list[0],last=list[list.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}};
    document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);previous?.focus()};
  },[isMobileDrawerOpen]);

  return (
    <div className="v14-exam-room-layout">
      {refined&&<a className="v15-skip" href="#main-question-viewport">Đến nội dung câu hỏi</a>}
      {/* Sticky Top Bar */}
      <header className="v14-exam-topbar">
        {/* Left: Back Arrow + App Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v14-space-3)' }}>
          <button
            type="button"
            onClick={onBack}
            aria-label="Thoát phòng thi"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: 'var(--v14-color-text-main)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'var(--v14-radius-md)',
            }}
          >
            ←
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--v14-font-hanzi)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--v14-color-primary)',
              }}
            >
              HSK
            </span>
            <span
              style={{
                fontSize: 'var(--v14-text-xs)',
                fontWeight: 700,
                color: 'var(--v14-color-primary-active)',
                backgroundColor: 'var(--v14-color-primary-light)',
                padding: '2px 8px',
                borderRadius: 'var(--v14-radius-full)',
              }}
            >
              {refined?'V15':'V14'}
            </span>
          </div>
        </div>

        {/* Center: Exam Title */}
        <div style={{ fontWeight: 700, fontSize: 'var(--v14-text-base)', color: 'var(--v14-color-text-main)' }}>
          {examTitle}
        </div>

        {/* Right: Mode & Mobile Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v14-space-3)' }}>
          {/* Mode Badge */}
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--v14-radius-full)',
              fontSize: 'var(--v14-text-xs)',
              fontWeight: 600,
              backgroundColor: mode === 'practice' ? '#f0fdf4' : '#fef2f2',
              color: mode === 'practice' ? '#16a34a' : '#ef4444',
              border: `1px solid ${mode === 'practice' ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {mode === 'practice' ? '🌿 Luyện tập' : '⏱️ Thi thử'}
          </span>

          {/* Mobile Timer Display (visible only on smaller screens) */}
          <div className="v14-mobile-only-timer" style={{ display: 'none' }}>
            <DigitalTimer seconds={timer.remainingSeconds} variant="compact" />
          </div>

          {/* Mobile Drawer Toggle Button */}
          <button
            type="button"
            className="v14-mobile-drawer-btn"
            onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
            aria-label="Mở danh sách câu hỏi"
            style={{
              display: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--v14-radius-md)',
              border: '1px solid var(--v14-color-border)',
              backgroundColor: 'var(--v14-color-surface)',
              fontSize: 'var(--v14-text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📋 Câu hỏi
          </button>
        </div>
      </header>

      {/* Main 3-Column Grid */}
      <div className="v14-exam-main-grid">
        {/* Column 1: Left Navigator */}
        <ExamNavigator
          navigator={navigator}
          onSelectSkill={onSelectSkill}
          onSelectQuestion={onSelectQuestion}
        />

        {/* Column 2: Question Center */}
        <main className="v14-question-center" id="main-question-viewport" tabIndex={-1}>
          {children}
        </main>

        {/* Column 3: Timer & Submit Panel */}
        <ExamTimerCard
          timer={timer}
          onSubmit={onSubmitExam}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div
          className="v14-modal-overlay"
          onClick={() => setIsMobileDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="v14-mobile-navigator-title"
        >
          <div
            ref={drawerRef}
            className="v14-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--v14-space-3)',
              }}
            >
              <h3 id="v14-mobile-navigator-title" style={{ margin: 0, fontSize: 'var(--v14-text-base)' }}>Danh sách câu hỏi</h3>
              <button
                type="button"
                aria-label="Đóng danh sách câu hỏi"
                onClick={() => setIsMobileDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <ExamNavigator
              navigator={navigator}
              onSelectSkill={onSelectSkill}
              onSelectQuestion={(idx) => {
                onSelectQuestion(idx);
                setIsMobileDrawerOpen(false);
              }}
            />

            <div style={{ marginTop: 'var(--v14-space-4)' }}>
              <Button variant="primary" fullWidth disabled={timer.canSubmit===false} onClick={onSubmitExam}>
                Nộp bài ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
