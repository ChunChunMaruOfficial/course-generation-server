class JsonFormatter {
  constructor(rawText) {
    this.rawText = rawText;
  }

  extractJsonString() {
    const firstBrace = this.rawText.indexOf('{');
    const firstBracket = this.rawText.indexOf('[');
    if (firstBrace === -1 && firstBracket === -1) return null;
    const start = (firstBrace === -1) ? firstBracket :
      (firstBracket === -1) ? firstBrace :
        Math.min(firstBrace, firstBracket);
    const openChar = this.rawText[start];
    const closeChar = openChar === '{' ? '}' : ']';

    let balance = 0, inString = false, escapeNext = false;
    for (let i = start; i < this.rawText.length; i++) {
      const ch = this.rawText[i];
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (ch === '\\') {
        escapeNext = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (ch === openChar) balance++;
        else if (ch === closeChar) balance--;
        if (balance === 0) {
          return this.rawText.slice(start, i + 1);
        }
      }
    }
    return null;
  }

  sanitizeBackticks(str) {
    return str.replace(/`/g, '"');
  }

  replaceInnerDoubleQuotesLessonText(jsonStr) {
    return jsonStr.replace(/("lesson_text"\s*:\s*)"((?:[^"\\]|\\.)*)"/, (match, p1, content) => {
      let result = '';
      let escaped = false;
      for (let i = 0; i < content.length; i++) {
        const ch = content[i];
        if (ch === '"' && !escaped) {
          result += "'";
        } else {
          result += ch;
        }
        escaped = (ch === '\\' && !escaped);
      }
      return p1 + '"' + result + '"';
    });
  }


  removeAllNewlines(str) {
    return str.replace(/[\r\n\t]+/g, '');
  }

  removeClassNames(str) {
    return str.replace(/className="[^"]*"/g, '');
  }

  parse() {
    let jsonString = this.extractJsonString();
    if (!jsonString) throw new Error("JSON не найден");
    jsonString = this.sanitizeBackticks(jsonString);
    jsonString = this.removeAllNewlines(jsonString);
    jsonString = this.removeClassNames(jsonString);
    jsonString = this.replaceInnerDoubleQuotesLessonText(jsonString);


    try {
      console.log(jsonString);

      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error("Ошибка парсинга JSON: " + err.message);
    }
  }
}

module.exports = JsonFormatter;
