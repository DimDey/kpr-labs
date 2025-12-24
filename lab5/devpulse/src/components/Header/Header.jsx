import { useState, useEffect } from 'react';
import { LayoutGrid, Settings, Bell, Search, Zap } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('ru-RU', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  const formattedTime = time.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <LayoutGrid size={20} color="var(--accent-blue)" />
          </div>
          <span className={styles.logoText}>DevPulse</span>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.dateTime}>
          <span className={styles.time}>{formattedTime}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
};