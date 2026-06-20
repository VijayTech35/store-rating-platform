import { getAvatarGradient, getInitials } from '../utils/avatar';

export default function Avatar({ name, size = 'sm' }) {
  const [from, to] = getAvatarGradient(name);
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-lg' };
  return (
    <div className={`${sizes[size] || sizes.sm} rounded-full bg-gradient-to-br ${from} ${to} flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0`} aria-hidden="true">
      {getInitials(name)}
    </div>
  );
}
