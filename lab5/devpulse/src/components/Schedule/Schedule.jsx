import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Clock, ChevronRight } from 'lucide-react';
import { Card } from '../Card/Card';
import styles from './Schedule.module.css';

export const Schedule = ({ groupId = 153 }) => {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const dayNames = ["", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const weekRes = await fetch("https://schedule.sfedu.ru/APIv1/week");
        const { week: currentWeekNum } = await weekRes.json();
        const weekParity = currentWeekNum === 0 ? 'upper' : 'lower';

        const res = await fetch(`https://schedule.sfedu.ru/APIv1/schedule/group/${groupId}`);
        const data = await res.json();

        processSchedule(data, weekParity);
      } catch (err) {
        console.error("Ошибка API ЮФУ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [groupId]);

  const processSchedule = (data, weekParity) => {
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); 
    const currentTimeStr = now.toTimeString().slice(0, 8);

    const allLessons = data.lessons.map(lesson => {
      const raw = lesson.timeslot.replace(/[()]/g, '').split(',');
      const info = data.curricula.find(c => c.lessonid === lesson.id);
      return {
        id: lesson.id,
        day: parseInt(raw[0]),
        start: raw[1],
        end: raw[2],
        parity: raw[3],
        subject: info?.subjectname || "Дисциплина",
        room: info?.roomname || "---",
        teacher: info?.teachername || "",
        type: lesson.ctype ? "Лекция" : "Практика"
      };
    });

    const filtered = allLessons
      .filter(l => l.parity === 'full' || l.parity === weekParity)
      .sort((a, b) => {
        // Хитрая сортировка, чтобы текущий день был первым, а прошедшие дни ушли в конец
        const dayA = (a.day - currentDay + 7) % 7;
        const dayB = (b.day - currentDay + 7) % 7;
        if (dayA !== dayB) return dayA - dayB;
        return a.start.localeCompare(b.start);
      })
      // Убираем пары, которые сегодня уже прошли
      .filter(l => {
        if (l.day === currentDay && l.start < currentTimeStr) return false;
        return true;
      });

    setUpcomingLessons(filtered.slice(0, 3));
  };

  const getDayLabel = (day) => {
    const today = new Date().getDay() === 0 ? 7 : new Date().getDay();
    if (day === today) return "Сегодня";
    if (day === (today % 7) + 1) return "Завтра";
    return dayNames[day];
  };

  if (loading) return <Card title="Расписание" icon={Calendar} iconColor="var(--accent-blue)">Загрузка...</Card>;

  return (
    <Card title=" Расписание" icon={Calendar} iconColor="var(--accent-blue)">
      <div className={styles.list}>
        {upcomingLessons.length > 0 ? (
          upcomingLessons.map((lesson, index) => (
            <div key={lesson.id} className={`${styles.lessonItem} ${index === 0 ? styles.active : ''}`}>
              <div className={styles.sideInfo}>
                <span className={styles.dayBadge}>{getDayLabel(lesson.day)}</span>
                <span className={styles.timeText}>{lesson.start.slice(0, 5)}</span>
              </div>
              
              <div className={styles.mainInfo}>
                <h4 className={styles.subject}>{lesson.subject}</h4>
                <div className={styles.meta}>
                  <span className={styles.room}><MapPin size={12} /> {lesson.room}</span>
                  <span className={styles.type}>{lesson.type}</span>
                </div>
              </div>
              
              {index === 0 && <div className={styles.nowIndicator}>СЛЕДУЮЩАЯ</div>}
            </div>
          ))
        ) : (
          <p className={styles.empty}>Пар не найдено</p>
        )}
      </div>
    </Card>
  );
};