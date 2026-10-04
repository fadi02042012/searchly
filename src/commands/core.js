/** Pure command-palette helpers. */
export function filterCommands(commands, query = '') {
  const lower = String(query).trim().toLowerCase();
  if (!lower) return [...commands];
  return commands.filter(command =>
    String(command.name || '').toLowerCase().includes(lower) ||
    String(command.nameEn || '').toLowerCase().includes(lower)
  );
}

export function getCommandLabel(command, lang = 'ar') {
  return lang === 'ar' ? command.name : command.nameEn;
}
