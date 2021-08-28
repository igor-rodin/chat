import AvatarForm from '../templates/avatar-form.hbs'

export function createAvatarForm(options) {
  const form = document.createElement('div');
  form.classList.add('avatar-form')
  form.insertAdjacentHTML('afterbegin', AvatarForm({
    avatar: options.avatar
  }));

  return form;
}