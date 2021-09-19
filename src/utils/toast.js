export const toast = (message) => {
  const toastContainer = document.createElement('div');
  const toastItem = document.createElement('div');

  toastItem.textContent = message;
  toastContainer.classList.add('toast-container');
  toastItem.classList.add('toast-item');

  document.body.append(toastContainer);
  toastContainer.append(toastItem);
};

export const removeToast = () => document.querySelector('.toast-container').remove();
