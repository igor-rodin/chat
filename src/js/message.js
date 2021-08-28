import MessageElem from '../templates/message.hbs'

export function createMessage(options) {
  const msgElem = document.createElement('li');
  msgElem.classList.add('messages__item', 'message');

  if (options.userMessage) {
    msgElem.classList.add('message--user');
    msgElem.setAttribute('data-user-id', options.userId);
  }
  else {
    msgElem.classList.add('message--info');
  }

  msgElem.insertAdjacentHTML('afterbegin', MessageElem({
    userMessage: options.userMessage,
    avatar: options.avatar,
    userName: options.userName,
    msgText: options.msgText,
    time: options.msgTime,
  }));

  return msgElem;
}