const WebSocketServer = new require('ws');
const { v4: uuidv4 } = require('uuid');
const stringHash = require("string-hash");

let clients = {};
const users = [];
const messages = [];
const avatarMap = {};

const webSocketServer = new WebSocketServer.Server({ port: 8080 }, () => {
  console.log('Сервер запущен на порту 8080');
});

webSocketServer.on('connection', function (ws) {
  const clientId = uuidv4();
  clients[clientId] = ws;

  ws.send(JSON.stringify({ users: users, messages: messages }));

  ws.on('message', function (receivedMsg) {
    const { type, user, message } = JSON.parse(receivedMsg);

    switch (type) {
      case 'connection':
        const msgText = `${user.name} (${user.nickName}) вошел в чат`;

        const hashName = stringHash(`${user.name}-${user.nickName}`);
        if (hashName in avatarMap) {
          user.avatar = avatarMap[hashName];
        }
        else {
          avatarMap[hashName] = user.avatar;
        }

        users.push({ id: clientId, type: type, user: user });

        messages.push({ id: clientId, type: type, user: user, message: msgText });
        sendBroadcastMessage(JSON.stringify({
          users: users,
          messages: [{ id: clientId, type: type, user: user, message: msgText }],
          avatars: avatarMap
        }));
        break;
      case 'user':
        messages.push({ id: clientId, type: type, user: user, message: message });
        sendBroadcastMessage(JSON.stringify({
          users: [],
          messages: [{ id: clientId, type: type, user: user, message: message }],
        }));
        break;
      case 'avatar':
        const hash = stringHash(`${user.name}-${user.nickName}`);
        avatarMap[hash] = user.avatar;
        updateMesaagesWithAvatar(clientId, user.avatar);
        sendBroadcastMessage(JSON.stringify({
          users: [],
          messages: [{ id: clientId, type: type, avatarSrc: user.avatar }],
        }));
        break;
    }
  });

  ws.on('close', function () {
    const closedIdx = users.findIndex((user) => user.id === clientId);
    const msgText = `${users[closedIdx].user.name} (${users[closedIdx].user.nickName}) вышел из чата`;
    messages.push({ id: clientId, type: 'connection', user: users[closedIdx].user, message: msgText });

    sendBroadcastMessage(JSON.stringify({
      users: users,
      messages: [{ id: clientId, type: 'connection', user: users[closedIdx].user, message: msgText }]
    }));

    users.splice(closedIdx, 1);
    delete clients[clientId];
  });

  function sendBroadcastMessage(message) {
    for (const id in clients) {
      clients[id].send(message);
    }
  };

  function updateMesaagesWithAvatar(clientId, userAvatar) {
    messages.forEach((msg) => {
      if (msg.id === clientId) {
        msg.user.avatar = userAvatar;
      }
    })
  };
});