import './scss/main.scss'
import { createLogin } from './js/login.js'
import { creatChat } from './js/chat.js'
import avatarDefault from './images/abstract-user.svg'
import { createUser } from './js/user'
import { createMessage } from './js/message'
import { createAvatarForm } from './js/avatar-form.js'

document.addEventListener('DOMContentLoaded', () => {

  const appContainer = document.querySelector('#container');

  const login = createLogin({
    title: 'Авторизация',
    subheader: 'Введите пожалуйста свой ник для дальнейшей авторизации',
    placeholderFio: "Фамилия Имя Отчество",
    placeholderNick: "Введите свой ник",
    buttonText: 'Войти'
  })

  appContainer.append(login);

  document.addEventListener('click', (event) => {
    if (event.target.id === 'logInBtn') {
      const nickName = document.querySelector('#nickName').value.trim();
      const fio = document.querySelector('#fio').value.trim();
      if (nickName && fio) {
        login.remove();
        const loginTime = getCurrentTime();
        const activeUser = {
          name: fio,
          nickName: nickName,
          avatar: avatarDefault,
          loginTime: loginTime,
        };

        const chatScreen = creatChat({
          activeUserFio: activeUser.name,
          activeUserNickname: activeUser.nickName,
          avatar: activeUser.avatar,
        });

        appContainer.append(chatScreen);


        const sendBtn = appContainer.querySelector('#sendBtn');
        sendBtn.addEventListener('click', (event) => {
          const inputMsg = appContainer.querySelector('#inputMessage');
          const msgText = inputMsg.value.trim();
          sendMessage(msgText);
          inputMsg.value = '';
        });

        const avatarLink = appContainer.querySelector('#loadLink');

        avatarLink.addEventListener('click', (event) => {
          event.preventDefault();
          const avatarForm = createAvatarForm({
            avatar: activeUser.avatar
          });

          document.body.append(avatarForm);

          const cancelBtn = avatarForm.querySelector('#cancelBtn');
          if (cancelBtn) {
            cancelBtn.addEventListener('click', (event) => {
              avatarForm.remove();
            })
          }

          const loadBtn = avatarForm.querySelector('#avatarFileInput');
          const saveBtn = avatarForm.querySelector('#saveBtn');
          const avatarImg = avatarForm.querySelector('#avatarImg');
          const fileReader = new FileReader();

          fileReader.addEventListener('load', () => {
            avatarImg.src = fileReader.result;
          })

          loadBtn.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
              fileReader.readAsDataURL(file);
            }

          });

          saveBtn.addEventListener('click', (event) => {
            activeUser.avatar = avatarImg.src;
            const activeUserElem = document.querySelector('#activeUserImg');
            if (activeUserElem) {
              activeUserElem.src = avatarImg.src;
            }
            syncAvatar(avatarImg.src)
            avatarForm.remove();
          })

        });

        avatarLink.addEventListener('dragover', (event) => {
          event.preventDefault();
        })

        avatarLink.parentElement.addEventListener('drop', (event) => {
          event.preventDefault();
          const dataDroped = event.dataTransfer;
          if (dataDroped.files && dataDroped.files.length) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(dataDroped.files[0]);
            fileReader.addEventListener('load', () => {
              activeUser.avatar = fileReader.result;
              avatarLink.querySelector('#activeUserImg').src = activeUser.avatar;
              syncAvatar(activeUser.avatar);
            })
          }
        })

        const ws = new WebSocket("ws://localhost:8080/");

        ws.onopen = (e) => {
          const message = {
            type: 'connection',
            user: activeUser,
          }

          ws.send(JSON.stringify(message));
        };

        ws.onmessage = (message) => {
          const { users, messages } = JSON.parse(message.data);

          if (users.length) {
            appContainer.querySelector('#userCnt').textContent = users.length;
            updateUsers(appContainer, users);
          }

          if (messages.length) {
            if (messages.length === 1 && messages[0].type === 'avatar') {
              updateAvatar(appContainer, messages[0].id, messages[0].avatarSrc);
            }
            else {
              updateMesages(appContainer, messages);
            }
          }
        };


        ws.addEventListener('error', function (ev) {
          console.log('Соединение закрыто или не может быть открыто');
        });

        function syncAvatar(avatar) {
          const message = {
            type: 'avatar',
            user: activeUser,
          };
          ws.send(JSON.stringify(message))
        }

        function getCurrentTime() {
          return new Date().toTimeString().slice(0, 5);
        }

        function sendMessage(messageText) {
          activeUser.loginTime = getCurrentTime();
          const message = {
            type: 'user',
            user: activeUser,
            message: messageText
          };
          ws.send(JSON.stringify(message));
        }
      }
    }
  })

  function updateAvatar(container, userId, avatarSrc) {
    const targets = document.querySelectorAll('.user');
    targets.forEach((target) => {
      if (target.dataset.userId === userId) {
        target.querySelector('img').src = avatarSrc;
      }
    })
  };

  function updateUsers(container, users) {
    const usersList = container.querySelector('#users');
    usersList.innerHTML = '';
    users.forEach((elem) => {
      const liElem = createUser({
        userId: elem.id,
        avatar: elem.user.avatar,
        userName: elem.user.name,
      })

      usersList.append(liElem);
    });
    usersList.scrollTop = usersList.scrollHeight;
  };

  function updateMesages(container, messages) {
    const msgList = container.querySelector('#msgList');
    messages.forEach((msg) => {
      if (msg.type === 'connection') {
        const msgElem = createMessage({
          userMessage: false,
          avatar: msg.user.avatar,
          userName: msg.user.name,
          msgText: msg.message,
        });

        msgList.append(msgElem);
      }
      else if (msg.type === 'user') {
        const msgElem = createMessage({
          userMessage: true,
          userId: msg.user.id,
          avatar: msg.user.avatar,
          userName: msg.user.name,
          msgText: msg.message,
          msgTime: msg.user.loginTime,
        });

        msgList.append(msgElem);
      }
    })
    msgList.parentElement.scrollTop = msgList.parentElement.scrollHeight;
  };
})