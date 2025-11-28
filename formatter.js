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

  removeJSXReturn(jsonStr) {
    return jsonStr
      .replace(/^.*?return\s*\(\s*/s, '')  // убираем return (
      .replace(/\s*\)\s*;?\s*$/s, '')      // убираем ) в конце
      .replace(/^<div[^>]*>\s*/s, '')      // убираем <div style=...
      .replace(/\s*<\/div>\s*$/s, '');     // убираем </div>
  }

  // 🔥 НОВОЕ 2: Убирает React class/style инициализацию
  removeReactProps(str) {
    return str
      .replace(/style\s*=\s*\{[^}]+\}/g, '')           // style={{...}}
      .replace(/className\s*=\s*"[^"]*"/g, '')         // className="..."
      .replace(/class\s*=\s*"[^"]*"/g, '');            // class="..."
  }

  replaceInnerDoubleQuotesLessonText(jsonStr) {
    return jsonStr.replace(/("lesson_text"\s*:\s*)("[^"]*")/g, (match, prefix, content) => {
      // 🔥 Экранируем ВСЕ " внутри содержимого
      let result = '';
      let escaped = false;
      for (let i = 0; i < content.length; i++) {
        const ch = content[i];
        if (ch === '\\' && !escaped) {
          escaped = true;
          result += ch;
        } else if (ch === '"' && !escaped) {
          result += '\\"';  // ← Экранируем ВСЕ "
        } else {
          result += ch;
          escaped = false;
        }
      }
      return prefix + '"' + result + '"';
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
    jsonString = this.removeJSXReturn(jsonString);
    jsonString = this.removeReactProps(jsonString);
    jsonString = this.replaceInnerDoubleQuotesLessonText(jsonString);


    try {
      console.log(jsonString);

      return JSON.parse(jsonString);
    } catch (err) {



      const desperateFix = jsonString
        .replace(/'''[\s\S]*?'''/g, '"code"')
        .replace(/"""/g, '"')
        .replace(/(?<!\\)"/g, '\\"');

      console.log("💥 Desperate fix:", desperateFix);
      return JSON.parse(desperateFix);
    }
  }
}

module.exports = JsonFormatter;
