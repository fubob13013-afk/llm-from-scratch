/**
 * python-interpreter.js
 * 共享 Python 解释器 — 支持变量、列表、字典、for/if、函数、import 等 Python 子集
 * 用于 L0.1 终端 Python 模式 + L0.2/L0.3 Python 沙盒
 */

function runPython(code, options = {}) {
  const lines = code.split('\n');
  const variables = {};
  const output = [];
  const imports = options.imports || {}; // pre-loaded modules

  // ========== Built-in helpers ==========

  function pyLen(obj) {
    if (Array.isArray(obj)) return obj.length;
    if (typeof obj === 'string') return obj.length;
    if (obj && typeof obj === 'object' && obj.__isDict) return Object.keys(obj).length;
    return 0;
  }

  function pyRange(args) {
    if (args.length === 1) {
      const n = evaluateExpr(args[0], variables);
      const result = [];
      for (let i = 0; i < n; i++) result.push(i);
      return result;
    } else if (args.length === 2) {
      const start = evaluateExpr(args[0], variables);
      const end = evaluateExpr(args[1], variables);
      const result = [];
      for (let i = start; i < end; i++) result.push(i);
      return result;
    }
    return [];
  }

  function pyPrint(args) {
    const vals = args.map(a => {
      try {
        const v = evaluateExpr(a, variables);
        if (v && v.__isDict) {
          const entries = Object.entries(v).filter(([k]) => !k.startsWith('__'));
          return '{' + entries.map(([k, val]) => repr(k) + ': ' + repr(val)).join(', ') + '}';
        }
        if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
        return repr(v);
      } catch (e) {
        return '<error: ' + e.message + '>';
      }
    });
    output.push(vals.join(' '));
  }

  function repr(val) {
    if (val === null || val === undefined) return 'None';
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (Array.isArray(val)) return '[' + val.map(repr).join(', ') + ']';
    if (val && val.__isDict) {
      const entries = Object.entries(val).filter(([k]) => !k.startsWith('__'));
      return '{' + entries.map(([k, v]) => repr(k) + ': ' + repr(v)).join(', ') + '}';
    }
    return String(val);
  }

  function pyAppend(objName, arg) {
    const val = evaluateExpr(arg, variables);
    if (Array.isArray(variables[objName])) {
      variables[objName].push(val);
    }
  }

  // ========== Expression evaluator ==========

  function evaluateExpr(expr, vars) {
    expr = expr.trim();
    if (!expr) return null;

    // String literals (double or single quotes)
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    if ((expr.startsWith('"') || expr.startsWith("'")) && expr.length >= 2) {
      const quote = expr[0];
      const endIdx = expr.indexOf(quote, 1);
      if (endIdx > 0) return expr.slice(1, endIdx);
    }

    // Numbers
    if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);

    // Booleans & None
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;

    // Dict literal: {key: val, ...}
    if (expr.startsWith('{') && expr.endsWith('}')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return { __isDict: true };
      const pairs = splitTopLevel(inner, ',');
      const obj = { __isDict: true };
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(':');
        if (colonIdx < 0) continue;
        const k = evaluateExpr(pair.slice(0, colonIdx).trim(), vars);
        const v = evaluateExpr(pair.slice(colonIdx + 1).trim(), vars);
        obj[k] = v;
      }
      return obj;
    }

    // List literal [...]
    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      const items = splitTopLevel(inner, ',').map(s => evaluateExpr(s.trim(), vars));
      return items;
    }

    // Function calls: name(...)
    const funcMatch = expr.match(/^(\w+)\((.*)\)$/);
    if (funcMatch) {
      const fname = funcMatch[1];
      let args = funcMatch[2] ? splitTopLevel(funcMatch[2], ',').map(s => s.trim()) : [];

      // Built-in functions
      if (fname === 'len') {
        if (args.length !== 1) throw new Error('len() 需要 1 个参数');
        return pyLen(evaluateExpr(args[0], vars));
      }
      if (fname === 'range') return pyRange(args);
      if (fname === 'type') {
        if (args.length !== 1) throw new Error('type() 需要 1 个参数');
        const val = evaluateExpr(args[0], vars);
        if (val === null || val === undefined) return "<class 'NoneType'>";
        if (typeof val === 'number') return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
        if (typeof val === 'string') return "<class 'str'>";
        if (Array.isArray(val)) return "<class 'list'>";
        if (val && val.__isDict) return "<class 'dict'>";
        if (typeof val === 'boolean') return "<class 'bool'>";
        return "<class 'object'>";
      }
      if (fname === 'int') {
        if (args.length !== 1) throw new Error('int() 需要 1 个参数');
        const v = evaluateExpr(args[0], vars);
        return typeof v === 'number' ? Math.floor(v) : parseInt(v, 10);
      }
      if (fname === 'float') {
        if (args.length !== 1) throw new Error('float() 需要 1 个参数');
        return Number(evaluateExpr(args[0], vars));
      }
      if (fname === 'str') {
        if (args.length !== 1) throw new Error('str() 需要 1 个参数');
        return String(evaluateExpr(args[0], vars));
      }
      if (fname === 'bool') {
        if (args.length !== 1) throw new Error('bool() 需要 1 个参数');
        return Boolean(evaluateExpr(args[0], vars));
      }
      if (fname === 'round') {
        const val = evaluateExpr(args[0], vars);
        const decimals = args[1] ? evaluateExpr(args[1], vars) : 0;
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
      }
      if (fname === 'abs') {
        return Math.abs(evaluateExpr(args[0], vars));
      }
      if (fname === 'max') return Math.max(...args.map(a => evaluateExpr(a, vars)));
      if (fname === 'min') return Math.min(...args.map(a => evaluateExpr(a, vars)));
      if (fname === 'sum') {
        const arr = evaluateExpr(args[0], vars);
        if (Array.isArray(arr)) return arr.reduce((a, b) => a + b, 0);
        return 0;
      }
      if (fname === 'sorted') {
        const arr = evaluateExpr(args[0], vars);
        if (Array.isArray(arr)) return [...arr].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        return arr;
      }
      if (fname === 'print') {
        pyPrint(args);
        return null;
      }

      // Imported module functions (e.g. math.log, random.randint)
      for (const [modName, modObj] of Object.entries(imports)) {
        if (fname === modName + '.' + Object.keys(modObj).find(k => modObj[k] && fname === modName + '.' + k)) {
          // handled below
        }
        // Try modName.funcName pattern
        const dotIdx = fname.indexOf('.');
        if (dotIdx > 0) {
          const mod = fname.slice(0, dotIdx);
          const fn = fname.slice(dotIdx + 1);
          if (mod === modName && modObj[fn]) {
            const evaluatedArgs = args.map(a => evaluateExpr(a, vars));
            return modObj[fn](...evaluatedArgs);
          }
        }
      }

      // User-defined functions
      if (fname in vars && typeof vars[fname] === 'function') {
        const evaluatedArgs = args.map(a => evaluateExpr(a, vars));
        return vars[fname](...evaluatedArgs);
      }

      // Dict method calls handled below
      throw new Error('未定义的函数: ' + fname + '()');
    }

    // Method calls: obj.method(args)
    const methodMatch = expr.match(/^(\w+)\.(\w+)\((.*)\)$/);
    if (methodMatch) {
      const objName = methodMatch[1];
      const method = methodMatch[2];
      const argsStr = methodMatch[3];
      const args = argsStr ? splitTopLevel(argsStr, ',').map(s => s.trim()) : [];

      if (method === 'append') {
        if (args.length !== 1) throw new Error('append() 需要 1 个参数');
        const val = evaluateExpr(args[0], vars);
        if (Array.isArray(vars[objName])) vars[objName].push(val);
        else throw new Error(objName + ' 不是列表，不能 append');
        return null;
      }
      if (method === 'items') {
        const obj = vars[objName];
        if (obj && obj.__isDict) {
          return Object.entries(obj).filter(([k]) => !k.startsWith('__')).map(([k, v]) => [k, v]);
        }
        throw new Error(objName + ' 不是字典');
      }
      if (method === 'keys') {
        const obj = vars[objName];
        if (obj && obj.__isDict) return Object.keys(obj).filter(k => !k.startsWith('__'));
        throw new Error(objName + ' 不是字典');
      }
      if (method === 'values') {
        const obj = vars[objName];
        if (obj && obj.__isDict) return Object.values(obj).filter((_, i) => !Object.keys(obj)[i].startsWith('__'));
        throw new Error(objName + ' 不是字典');
      }
      if (method === 'split') {
        const str = vars[objName];
        if (typeof str !== 'string') throw new Error(objName + ' 不是字符串');
        const sep = args.length > 0 ? evaluateExpr(args[0], vars) : ' ';
        return str.split(sep);
      }
      if (method === 'strip') {
        const str = vars[objName];
        if (typeof str !== 'string') throw new Error(objName + ' 不是字符串');
        return str.trim();
      }
      if (method === 'lower') {
        const str = vars[objName];
        if (typeof str !== 'string') throw new Error(objName + ' 不是字符串');
        return str.toLowerCase();
      }
      if (method === 'upper') {
        const str = vars[objName];
        if (typeof str !== 'string') throw new Error(objName + ' 不是字符串');
        return str.toUpperCase();
      }
      if (method === 'replace') {
        const str = vars[objName];
        if (typeof str !== 'string') throw new Error(objName + ' 不是字符串');
        const old = evaluateExpr(args[0], vars);
        const replacement = evaluateExpr(args[1], vars);
        return str.split(old).join(replacement);
      }
      if (method === 'startswith') {
        const str = vars[objName];
        const prefix = evaluateExpr(args[0], vars);
        return typeof str === 'string' && str.startsWith(prefix);
      }
      throw new Error('不支持的方法: ' + method + '()');
    }

    // Property access: obj.prop
    const propMatch = expr.match(/^(\w+)\.(\w+)$/);
    if (propMatch) {
      const obj = vars[propMatch[1]];
      if (obj && obj.__isDict) return obj[propMatch[2]];
      throw new Error('无法访问属性: ' + expr);
    }

    // Indexing / slicing: var[idx], var[a:b], var[a:]
    const idxMatch = expr.match(/^(\w+)\[([^\]]+)\]$/);
    if (idxMatch) {
      const varName = idxMatch[1];
      const idxStr = idxMatch[2];
      const val = vars[varName];
      if (val === undefined) throw new Error('变量未定义: ' + varName);
      if (idxStr.includes(':')) {
        const [s, e] = idxStr.split(':');
        const start = s ? evaluateExpr(s, vars) : 0;
        const end = e ? evaluateExpr(e, vars) : (Array.isArray(val) ? val.length : typeof val === 'string' ? val.length : 0);
        if (Array.isArray(val)) return val.slice(start, end);
        if (typeof val === 'string') return val.slice(start, end);
        return val;
      }
      const idx = evaluateExpr(idxStr, vars);
      return val[idx];
    }

    // Arithmetic: a + b, a - b, a * b, a / b, a % b, a ** b
    const arithOps = [
      { op: '+', fn: (a, b) => a + b },
      { op: '-', fn: (a, b) => a - b },
    ];
    // Try addition/subtraction last (they might be in string contexts)
    for (const {op, fn} of arithOps) {
      const idx = expr.lastIndexOf(op);
      if (idx > 0) {
        const left = evaluateExpr(expr.slice(0, idx).trim(), vars);
        const right = evaluateExpr(expr.slice(idx + 1).trim(), vars);
        return fn(left, right);
      }
    }
    // *, /, %, ** — higher precedence, check first
    const highOps = [
      { op: '**', fn: (a, b) => Math.pow(a, b) },
      { op: '%', fn: (a, b) => a % b },
      { op: '/', fn: (a, b) => a / b },
      { op: '*', fn: (a, b) => a * b },
    ];
    for (const {op, fn} of highOps) {
      const idx = expr.lastIndexOf(op);
      if (idx > 0) {
        const left = evaluateExpr(expr.slice(0, idx).trim(), vars);
        const right = evaluateExpr(expr.slice(idx + op.length).trim(), vars);
        return fn(left, right);
      }
    }

    // Comparisons: >=, <=, !=, ==, >, <
    const compOps = [
      { op: '>=', fn: (a, b) => a >= b },
      { op: '<=', fn: (a, b) => a <= b },
      { op: '!=', fn: (a, b) => a != b },
      { op: '==', fn: (a, b) => a == b },
      { op: '>', fn: (a, b) => a > b },
      { op: '<', fn: (a, b) => a < b },
    ];
    for (const {op, fn} of compOps) {
      const idx = expr.indexOf(op);
      if (idx > 0) {
        const left = evaluateExpr(expr.slice(0, idx).trim(), vars);
        const right = evaluateExpr(expr.slice(idx + op.length).trim(), vars);
        return fn(left, right);
      }
    }

    // 'in' operator
    if (expr.includes(' in ')) {
      const parts = expr.split(' in ');
      if (parts.length >= 2) {
        const item = evaluateExpr(parts[0].trim(), vars);
        const container = evaluateExpr(parts.slice(1).join(' in ').trim(), vars);
        if (Array.isArray(container)) return container.includes(item);
        if (typeof container === 'string') return container.includes(item);
        if (container && container.__isDict) return item in container;
        return false;
      }
    }

    // 'and' / 'or'
    if (expr.includes(' or ')) {
      const parts = expr.split(' or ');
      return evaluateExpr(parts[0].trim(), vars) || evaluateExpr(parts.slice(1).join(' or ').trim(), vars);
    }
    if (expr.includes(' and ')) {
      const parts = expr.split(' and ');
      return evaluateExpr(parts[0].trim(), vars) && evaluateExpr(parts.slice(1).join(' and ').trim(), vars);
    }

    // 'not' operator
    if (expr.startsWith('not ')) {
      return !evaluateExpr(expr.slice(4).trim(), vars);
    }

    // Variable lookup
    if (/^[a-zA-Z_]\w*$/.test(expr)) {
      if (expr in vars) return vars[expr];
      throw new Error('变量未定义: ' + expr);
    }

    return expr;
  }

  // ========== Line & Block executor ==========

  function executeLine(line, vars, indentLevel) {
    line = line.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) return { type: 'pass' };

    const trimmed = line.trim();

    // Assignment: x = expr
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const expr = assignMatch[2];
      if (varName === 'def' || varName === 'if' || varName === 'for' || varName === 'while' ||
          varName === 'return' || varName === 'import' || varName === 'from' || varName === 'class' ||
          varName === 'elif' || varName === 'else' || varName === 'break' || varName === 'continue') {
        // These are keywords, not variable names — handled separately
      } else {
        try {
          vars[varName] = evaluateExpr(expr, vars);
        } catch (e) {
          throw new Error('赋值错误: ' + e.message);
        }
        return { type: 'assign', var: varName };
      }
    }

    // print(...)
    const printMatch = trimmed.match(/^print\((.*)\)$/);
    if (printMatch) {
      const args = printMatch[1] ? splitTopLevel(printMatch[1], ',').map(s => s.trim()).filter(Boolean) : [];
      pyPrint(args);
      return { type: 'print' };
    }

    // Method call on its own line: obj.method(args)
    const soloMethod = trimmed.match(/^(\w+)\.(\w+)\((.*)\)$/);
    if (soloMethod) {
      evaluateExpr(trimmed, vars);
      return { type: 'method' };
    }

    // if statement
    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      const cond = evaluateExpr(ifMatch[1], vars);
      return { type: 'if', condition: cond, condExpr: ifMatch[1] };
    }

    const elifMatch = trimmed.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      const cond = evaluateExpr(elifMatch[1], vars);
      return { type: 'elif', condition: cond };
    }

    const elseMatch = trimmed.match(/^else\s*:$/);
    if (elseMatch) return { type: 'else' };

    // for loop
    const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):$/);
    if (forMatch) {
      const iterVar = forMatch[1];
      const iterable = evaluateExpr(forMatch[2], vars);
      return { type: 'for', var: iterVar, iterable: iterable };
    }

    // def functionName(args):
    const defMatch = trimmed.match(/^def\s+(\w+)\(([^)]*)\)\s*:$/);
    if (defMatch) {
      const funcName = defMatch[1];
      const paramsStr = defMatch[2];
      const params = paramsStr ? paramsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
      // Mark that we need to collect the function body
      return { type: 'def_start', name: funcName, params: params };
    }

    // return expr
    const returnMatch = trimmed.match(/^return\s+(.+)$/);
    if (returnMatch) {
      const val = evaluateExpr(returnMatch[1], vars);
      return { type: 'return', value: val };
    }
    if (trimmed === 'return') {
      return { type: 'return', value: null };
    }

    // import module
    const importMatch = trimmed.match(/^import\s+(.+)$/);
    if (importMatch) {
      const modName = importMatch[1].trim();
      if (imports[modName]) {
        vars[modName] = imports[modName];
      } else {
        // Create a placeholder module
        vars[modName] = { __isModule: true, __name: modName };
      }
      return { type: 'import', module: modName };
    }

    // from module import name
    const fromMatch = trimmed.match(/^from\s+(\w+)\s+import\s+(.+)$/);
    if (fromMatch) {
      const modName = fromMatch[1];
      const names = fromMatch[2].split(',').map(s => s.trim());
      if (imports[modName]) {
        for (const name of names) {
          if (name in imports[modName]) {
            vars[name] = imports[modName][name];
          }
        }
      }
      return { type: 'from_import', module: modName, names };
    }

    // import module as alias
    const importAsMatch = trimmed.match(/^import\s+(\w+)\s+as\s+(\w+)$/);
    if (importAsMatch) {
      const modName = importAsMatch[1];
      const alias = importAsMatch[2];
      vars[alias] = imports[modName] || { __isModule: true, __name: modName };
      return { type: 'import_as', module: modName, alias };
    }

    // break / continue
    if (trimmed === 'break') return { type: 'break' };
    if (trimmed === 'continue') return { type: 'continue' };

    // Standalone expression (e.g. "1 + 1" or "x" in REPL)
    try {
      const val = evaluateExpr(trimmed, vars);
      return { type: 'expr', value: val };
    } catch (e) {
      throw new Error('无法解析: ' + trimmed);
    }
  }

  function executeBlock(lines, startIdx, vars) {
    let i = startIdx;
    while (i < lines.length) {
      const line = lines[i];
      const indent = line.match(/^(\s*)/)[1].length;

      try {
        const result = executeLine(line, vars, indent);

        if (result.type === 'pass' || result.type === 'assign' || result.type === 'print' ||
            result.type === 'method' || result.type === 'expr' || result.type === 'import' ||
            result.type === 'import_as' || result.type === 'from_import') {
          // For standalone expressions in interactive mode, print the value
          if (result.type === 'expr' && result.value !== null && result.value !== undefined) {
            output.push(repr(result.value));
          }
          i++;
          continue;
        }

        if (result.type === 'return') {
          return { return: true, value: result.value };
        }

        // Function definition
        if (result.type === 'def_start') {
          const funcName = result.name;
          const params = result.params;
          const bodyStart = i + 1;
          const baseIndent = line.match(/^(\s*)/)[1].length + 4;
          let bodyEnd = bodyStart;
          while (bodyEnd < lines.length) {
            const nextLine = lines[bodyEnd];
            const nextIndent = nextLine.match(/^(\s*)/)[1].length;
            if (nextIndent < baseIndent && nextLine.trim()) break;
            bodyEnd++;
          }
          const bodyLines = lines.slice(bodyStart, bodyEnd).map(l => l.replace(/^ {4}/, ''));

          vars[funcName] = function(...callArgs) {
            const localVars = { ...vars };
            for (let p = 0; p < params.length; p++) {
              localVars[params[p]] = callArgs[p] !== undefined ? callArgs[p] : null;
            }
            const localOutput = [];
            const savedOutput = output;
            // Swap output array so print() inside function works
            const origLen = output.length;
            try {
              const blockResult = executeBlock(bodyLines, 0, localVars);
              // Move any output
              return blockResult && blockResult.return ? blockResult.value : null;
            } catch (e) {
              if (e.message === 'return') return null;
              throw e;
            }
          };
          i = bodyEnd;
          continue;
        }

        if (result.type === 'if' || result.type === 'elif' || result.type === 'else') {
          // Find the entire if/elif/else chain
          const chain = [{ type: result.type, condition: result.condition, lineIdx: i }];
          let j = i + 1;
          const baseIndent = line.match(/^(\s*)/)[1].length;
          while (j < lines.length) {
            const nextLine = lines[j];
            const nextIndent = nextLine.match(/^(\s*)/)[1].length;
            if (nextIndent !== baseIndent) break;
            const nextTrim = nextLine.trim();
            if (nextTrim.startsWith('elif ')) {
              const cond = evaluateExpr(nextTrim.slice(5, -1).trim(), vars);
              chain.push({ type: 'elif', condition: cond, lineIdx: j });
            } else if (nextTrim === 'else:') {
              chain.push({ type: 'else', condition: true, lineIdx: j });
            } else {
              break;
            }
            j++;
          }

          // Find which branch to execute
          let executed = false;
          for (const branch of chain) {
            if (branch.condition) {
              const bodyStart = branch.lineIdx + 1;
              let bodyEnd = bodyStart;
              const targetIndent = baseIndent + 4;
              while (bodyEnd < lines.length) {
                const nextIndent = lines[bodyEnd].match(/^(\s*)/)[1].length;
                if (nextIndent < targetIndent && lines[bodyEnd].trim()) break;
                bodyEnd++;
              }
              const bodyLines = lines.slice(bodyStart, bodyEnd).map(l => l.replace(/^ {4}/, ''));
              executeBlock(bodyLines, 0, { ...vars });
              i = bodyEnd;
              executed = true;
              break;
            }
          }
          if (!executed) i = j;
          continue;
        }

        if (result.type === 'for') {
          const iterable = result.iterable;
          const iterVar = result.var;
          const bodyStart = i + 1;
          const baseIndent = line.match(/^(\s*)/)[1].length + 4;
          let bodyEnd = bodyStart;
          while (bodyEnd < lines.length) {
            const nextIndent = lines[bodyEnd].match(/^(\s*)/)[1].length;
            if (nextIndent < baseIndent && lines[bodyEnd].trim()) break;
            bodyEnd++;
          }
          const bodyLines = lines.slice(bodyStart, bodyEnd).map(l => l.replace(/^ {4}/, ''));

          if (Array.isArray(iterable)) {
            for (const item of iterable) {
              vars[iterVar] = item;
              try {
                const subResult = executeBlock(bodyLines, 0, { ...vars });
                if (subResult && subResult.break) break;
              } catch (e) {
                if (e.message === 'break') break;
                throw e;
              }
            }
          }
          i = bodyEnd;
          continue;
        }

        if (result.type === 'break') return { break: true };
        if (result.type === 'continue') { i++; continue; }

        i++;
      } catch (e) {
        if (e.message === 'break') return { break: true };
        output.push('❌ 错误 (行 ' + (i + 1) + '): ' + e.message);
        i++;
      }
    }
    return null;
  }

  // ========== Helper: split on commas respecting nesting ==========
  function splitTopLevel(str, sep) {
    const result = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth--;
      if (ch === sep && depth === 0) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    if (current) result.push(current);
    return result;
  }

  // ========== Execute ==========
  try {
    executeBlock(lines, 0, variables);
  } catch (e) {
    if (e.message !== 'return') {
      output.push('❌ 错误: ' + e.message);
    }
  }

  return { output, variables };
}
