import styles from './Card.module.css';

export const Card = ({ title, icon: Icon, iconColor, children, className }) => {
  return (
    <section className={`${styles.card} ${className}`}>
      <h2 className={styles.cardTitle}>
        {Icon && <Icon size={18} color={iconColor} />}
        {title}
      </h2>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
};