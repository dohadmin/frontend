
export const getColorForInitial = (initial) => {
  const letterToColor = {
    A: 'bg-red-500',
    B: 'bg-green-500',
    C: 'bg-blue-500',
    D: 'bg-yellow-500',
    E: 'bg-purple-500',
    F: 'bg-pink-500',
    G: 'bg-indigo-500',
    H: 'bg-teal-500',
    I: 'bg-orange-500',
    J: 'bg-red-500',
    K: 'bg-green-500',
    L: 'bg-blue-500',
    M: 'bg-yellow-500',
    N: 'bg-purple-500',
    O: 'bg-pink-500',
    P: 'bg-indigo-500',
    Q: 'bg-teal-500',
    R: 'bg-orange-500',
    S: 'bg-red-500',
    T: 'bg-green-500',
    U: 'bg-blue-500',
    V: 'bg-yellow-500',
    W: 'bg-purple-500',
    X: 'bg-pink-500',
    Y: 'bg-indigo-500',
    Z: 'bg-teal-500'
  };
  return letterToColor[initial.toUpperCase()] || 'bg-gray-500';
};
