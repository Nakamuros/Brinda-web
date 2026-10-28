// Fija en localStorage la respuesta del control de edad (+18) para que las pruebas no queden bloqueadas.
export const AGE_KEY = 'brinda.age18.v1';
export const passAgeGate = (target) => target.addInitScript((k) => localStorage.setItem(k, '1'), AGE_KEY);
