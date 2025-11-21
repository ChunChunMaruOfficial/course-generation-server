class JsonFormatter {
  constructor(rawText) {
    this.rawText = rawText;
  }

  // Найти корректный JSON с балансом фигурных скобок
  extractJsonString() {
    const start = this.rawText.indexOf('{');
    if (start === -1) return null;

    let balance = 0;
    let end = -1;
    for (let i = start; i < this.rawText.length; i++) {
      if (this.rawText[i] === '{') balance++;
      else if (this.rawText[i] === '}') balance--;
      if (balance === 0) {
        end = i;
        break;
      }
    }
    if (end === -1) return null;

    // Возвращаем подстроку с JSON, отрезая весь хвост
    return this.rawText.slice(start, end + 1);
  }

  // Заменяем обратные кавычки на двойные кавычки в строке, чтобы избежать ошибки парсинга
  sanitizeBackticks(str) {
    return str.replace(/`/g, '"');
  }

  parse() {
    let jsonString = this.extractJsonString();
    if (!jsonString) throw new Error("JSON не найден");

    // Замена обратных кавычек на двойные кавычки
    jsonString = this.sanitizeBackticks(jsonString);

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Ошибка парсинга JSON: " + e.message);
    }
  }
}


module.exports = JsonFormatter;