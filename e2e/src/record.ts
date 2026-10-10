const states: string[] = []

export function record(state: string) {
  if (states.at(-1) !== state) {
    states.push(state)
  }

  const node = document.querySelector('#states')
  if (node) {
    node.textContent = states.join(' ')
  }
}
