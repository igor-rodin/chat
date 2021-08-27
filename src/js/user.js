import UserElem from '../templates/user.hbs'

export function createUser(options) {
  const userElem = document.createElement('li');
  userElem.classList.add('users__item', 'user');
  userElem.setAttribute('data-user-id', options.userId);
  userElem.insertAdjacentHTML('afterbegin', UserElem({
    avatar: options.avatar,
    userName: options.userName,
  }));

  return userElem;
}