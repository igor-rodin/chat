import './scss/main.scss'
import { createLogin } from './js/login.js'
import { avatar } from './images/abstract-user.svg'

document.addEventListener('DOMContentLoaded', () => {

  const login = createLogin({
    title: 'Авторизация',
    subheader: 'Введите пожалуйста свой ник для дальнейшей авторизации',
    placeholderFio: "Фамилия Имя Отчество",
    placeholderNick: "Введите свой ник",
    buttonText: 'Войти'
  })

  document.querySelector('#container').append(login);

  document.addEventListener('click', (event) => {
    if (event.target.id === 'logInBtn') {
      const nickName = document.querySelector('#nickName').value.trim();
      const fio = document.querySelector('#fio').value.trim();
      if (nickName && fio) {
        console.log(nickName, fio);
        login.remove();
      }
    }
  })
})