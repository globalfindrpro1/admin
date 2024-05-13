export default function reLogin(err) {
  localStorage.clear();
  window.location.href='/auth/';
};
