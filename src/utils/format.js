export const formatShortDate = (value) =>
  new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));

export const formatMatchDate = (value) =>
  new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));

export const formatFullMatchDate = (value) =>
  new Intl.DateTimeFormat('el-GR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
