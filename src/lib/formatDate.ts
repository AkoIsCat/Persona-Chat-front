function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatClockTime(date: Date) {
  const hours = date.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${pad(hour)}:${pad(date.getMinutes())}`;
}

export function formatRelativeTime(value: string | Date, now = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) {
    return "방금 전";
  }

  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours}시간 전`;
  }

  const days = Math.round(hours / 24);

  if (days === 1) {
    return "어제";
  }

  if (days < 7) {
    return `${days}일 전`;
  }

  return formatClockTime(date);
}
