import { sections } from './content.js'

export function runCommand(raw, api) {
  const cmd = raw.trim().toLowerCase()
  if (!cmd) return null
  if (cmd === 'help') {
    return [
      'commands:',
      '  help            show this help',
      '  1-' + sections.length + ' / <name>     go to a section (' + sections.map((s) => s.id).join(', ') + ')',
      '  cv              toggle CV mode (all sections on one page)',
      '  clear           clear this output',
    ]
  }
  if (cmd === 'cv') {
    api.toggleCv()
    return ['cv mode: ' + (api.isCv() ? 'on' : 'off')]
  }
  if (cmd === 'clear') return 'clear'
  const n = Number(cmd)
  const byIndex = Number.isInteger(n) ? sections[n - 1] : null
  const target = byIndex || sections.find((s) => s.id === cmd || s.label.toLowerCase() === cmd)
  if (target) {
    api.select(target.id)
    return ['opened ' + target.id]
  }
  return ['command not found: ' + cmd + '. Type "help".']
}
