window.addEventListener('DOMContentLoaded', () => {
  
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  replaceText(`score`, `${window.localStorage.getItem('score') || 0}`)
  replaceText(`highscore`, `${window.localStorage.getItem('score') || 0}`)
});
