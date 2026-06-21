export default function Highlight({ text, query, className = '' }) {
  if (!query || !text) return <span className={className}>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-peach/30 text-orange-500 dark:text-peach rounded-sm px-0.5">{part}</mark>
          : part
      )}
    </span>
  );
}
