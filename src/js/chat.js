import ChatScreen from '../templates/chat.hbs'

export function creatChat(options) {
  const chat = document.createElement('div');
  chat.classList.add('chat')
  chat.insertAdjacentHTML('afterbegin', ChatScreen({
    user: options.activeUserFio,
    nick: options.activeUserNickname,
    avatar: options.avatar,
  }));

  return chat;
}