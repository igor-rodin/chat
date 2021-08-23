import loginScreen from '../templates/login.hbs'

export function createLogin(options) {
  const login = document.createElement('div');
  login.classList.add('login');
  login.insertAdjacentHTML('afterbegin', loginScreen({
    loginTitle: options.title,
    subheader: options.subheader,
    placeholderFio: options.placeholderFio,
    placeholderNick: options.placeholderNick,
    buttonText: options.buttonText,
  }));

  return login;
}