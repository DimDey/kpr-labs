import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Card } from '../Card/Card';
import styles from './Timer.module.css';

export const Timer = () => {
  const [mode, setMode] = useState('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const settings = {
    work: { time: 25 * 60, label: 'Работа', color: 'var(--accent-red)' },
    short: { time: 5 * 60, label: 'Отдых', color: 'var(--accent-green)' }
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(settings[newMode].time);
  };

  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            // Когда время вышло:
            clearInterval(interval); // Останавливаем этот интервал
            setIsActive(false);      // Выключаем активность
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    document.title = isActive ? `[${formatTime(seconds)}] DevPulse` : 'DevPulse';
  }, [seconds, isActive]);

  const progress = ((settings[mode].time - seconds) / settings[mode].time) * 100;

  return (
    <Card title=" Pomodoro" icon={Clock} iconColor={settings[mode].color}>
      <div className={styles.timerContainer}>
        <div className={styles.modes}>
          <button 
            onClick={() => switchMode('work')} 
            className={`${styles.modeBtn} ${mode === 'work' ? styles.activeMode : ''}`}
          >
            <Brain size={14} /> Работа
          </button>
          <button 
            onClick={() => switchMode('short')} 
            className={`${styles.modeBtn} ${mode === 'short' ? styles.activeMode : ''}`}
          >
            <Coffee size={14} /> Отдых
          </button>
        </div>

        <div className={styles.displayWrapper}>
          <div className={styles.display}>{formatTime(seconds)}</div>
          <div className={styles.progressBar}>
             <div 
               className={styles.progressFill} 
               style={{ width: `${progress}%`, backgroundColor: settings[mode].color }}
             />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setIsActive(!isActive)} 
            className={`${styles.btn} ${isActive ? styles.btnPause : styles.btnStart}`}
            style={{ '--current-color': settings[mode].color }}
          >
            {isActive ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button 
            onClick={() => {setIsActive(false); setSeconds(settings[mode].time);}} 
            className={`${styles.btn} ${styles.btnReset}`}
          >
            <RotateCcw size={18}/>
          </button>
        </div>
      </div>
    </Card>
  );
};