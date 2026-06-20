const AVATAR_GRADIENTS = [
  ['from-blue-400', 'to-blue-600'],
  ['from-indigo-400', 'to-indigo-600'],
  ['from-purple-400', 'to-purple-600'],
  ['from-pink-400', 'to-pink-600'],
  ['from-rose-400', 'to-rose-600'],
  ['from-orange-400', 'to-orange-600'],
  ['from-amber-400', 'to-amber-600'],
  ['from-emerald-400', 'to-emerald-600'],
  ['from-teal-400', 'to-teal-600'],
  ['from-cyan-400', 'to-cyan-600'],
];

export function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function getInitials(name) {
  return name.charAt(0).toUpperCase();
}
