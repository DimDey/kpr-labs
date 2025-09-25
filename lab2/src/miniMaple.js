class MiniMaple {
    static diff(expression, variable) {
        if (typeof expression !== 'string' || typeof variable !== 'string') {
            throw new Error('Both expression and variable must be strings');
        }
        
        if (variable.length !== 1 || !/^[a-zA-Z]$/.test(variable)) {
            throw new Error('Variable must be a single letter');
        }
        
        if (expression.trim() === '') {
            return '0';
        }
        
        const tokens = this.tokenize(expression);
        const ast = this.parse(tokens);
        
        const diffAst = this.differentiate(ast, variable);
        
        const simplifiedAst = this.simplify(diffAst);
        return this.astToString(simplifiedAst);
    }
    
    static tokenize(expr) {
        expr = expr.replace(/\s+/g, '');
        
        expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        expr = expr.replace(/([a-zA-Z])(\d)/g, '$1*$2');
        expr = expr.replace(/([a-zA-Z])\(/g, '$1*(');
        expr = expr.replace(/\)([a-zA-Z])/g, ')*$1');
        expr = expr.replace(/\)\(/g, ')*(');
        
        if (expr.startsWith('-')) {
            expr = '0' + expr;
        }
        expr = expr.replace(/([+\-*/^(])-/g, '$10-');
        
        const tokens = [];
        let current = '';
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (['+', '-', '*', '^', '(', ')'].includes(char)) {
                if (current !== '') {
                    tokens.push(current);
                    current = '';
                }
                tokens.push(char);
            } else {
                current += char;
            }
        }
        
        if (current !== '') {
            tokens.push(current);
        }
        
        return tokens;
    }
    
    static parse(tokens) {
        let pos = 0;
        
        const parseExpression = () => {
            let left = parseTerm();
            
            while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
                const op = tokens[pos];
                pos++;
                const right = parseTerm();
                left = { type: 'binary', op, left, right };
            }
            
            return left;
        };
        
        const parseTerm = () => {
            let left = parseFactor();
            
            while (pos < tokens.length && tokens[pos] === '*') {
                pos++;
                const right = parseFactor();
                left = { type: 'binary', op: '*', left, right };
            }
            
            return left;
        };
        
        const parseFactor = () => {
            let left = parseAtom();
            
            if (pos < tokens.length && tokens[pos] === '^') {
                pos++;
                const right = parseFactor();
                return { type: 'binary', op: '^', left, right };
            }
            
            return left;
        };
        
        const parseAtom = () => {
            if (pos >= tokens.length) {
                throw new Error('Unexpected end of expression');
            }
            
            const token = tokens[pos];
            
            if (token === '(') {
                pos++;
                const expr = parseExpression();
                if (pos >= tokens.length || tokens[pos] !== ')') {
                    throw new Error('Missing closing parenthesis');
                }
                pos++;
                return expr;
            }
            
            if (/^-?\d+\.?\d*$/.test(token)) {
                pos++;
                return { type: 'number', value: parseFloat(token) };
            }

            if (/^[a-zA-Z]+$/.test(token)) {
                pos++;
                return { type: 'variable', name: token };
            }
            
            throw new Error(`Unexpected token: ${token}`);
        };
        
        const ast = parseExpression();
        
        if (pos < tokens.length) {
            throw new Error(`Unexpected token: ${tokens[pos]}`);
        }
        
        return ast;
    }
    

    static differentiate(ast, variable) {
        switch (ast.type) {
            case 'number':
                return { type: 'number', value: 0 };
                
            case 'variable':
                return ast.name === variable 
                    ? { type: 'number', value: 1 } 
                    : { type: 'number', value: 0 };
                    
            case 'binary':
                if (ast.op === '+') {
                    return {
                        type: 'binary',
                        op: '+',
                        left: this.differentiate(ast.left, variable),
                        right: this.differentiate(ast.right, variable)
                    };
                }
                
                if (ast.op === '-') {
                    return {
                        type: 'binary',
                        op: '-',
                        left: this.differentiate(ast.left, variable),
                        right: this.differentiate(ast.right, variable)
                    };
                }
                
                if (ast.op === '*') {
                    const fPrime = this.differentiate(ast.left, variable);
                    const gPrime = this.differentiate(ast.right, variable);
                    
                    return {
                        type: 'binary',
                        op: '+',
                        left: {
                            type: 'binary',
                            op: '*',
                            left: fPrime,
                            right: ast.right
                        },
                        right: {
                            type: 'binary',
                            op: '*',
                            left: ast.left,
                            right: gPrime
                        }
                    };
                }
                
                if (ast.op === '^') {
                    if (ast.right.type === 'number') {
                        const n = ast.right.value;
                        const f = ast.left;
                        const fPrime = this.differentiate(f, variable);
                        
                        if (n === 0) {
                            return { type: 'number', value: 0 };
                        }
                        
                        return {
                            type: 'binary',
                            op: '*',
                            left: {
                                type: 'binary',
                                op: '*',
                                left: { type: 'number', value: n },
                                right: {
                                    type: 'binary',
                                    op: '^',
                                    left: f,
                                    right: { type: 'number', value: n - 1 }
                                }
                            },
                            right: fPrime
                        };
                    } else {
                        throw new Error('Non-constant exponents are not supported');
                    }
                }
                
                break;
                
            default:
                throw new Error(`Unknown AST node type: ${ast.type}`);
        }
    }
    
    static simplify(ast) {
        if (ast.type === 'number' || ast.type === 'variable') {
            return ast;
        }

        if (ast.type === 'binary') {
            const left = this.simplify(ast.left);
            const right = this.simplify(ast.right);

            if (left.type === 'number' && right.type === 'number') {
                switch (ast.op) {
                    case '+': return { type: 'number', value: left.value + right.value };
                    case '-': return { type: 'number', value: left.value - right.value };
                    case '*': return { type: 'number', value: left.value * right.value };
                    case '^': return { type: 'number', value: Math.pow(left.value, right.value) };
                }
            }

            if (ast.op === '*') {
                // 0 * что-то = 0
                if ((left.type === 'number' && left.value === 0) ||
                    (right.type === 'number' && right.value === 0)) {
                    return { type: 'number', value: 0 };
                }

                // 1 * x = x
                if (left.type === 'number' && left.value === 1) return right;
                if (right.type === 'number' && right.value === 1) return left;

                // Если левый — число, а правый — умножение с числом: a * (b * expr)
                if (left.type === 'number' && right.type === 'binary' && right.op === '*') {
                    if (right.left.type === 'number') {
                        // a * (b * expr) => (a*b) * expr
                        return this.simplify({
                            type: 'binary',
                            op: '*',
                            left: { type: 'number', value: left.value * right.left.value },
                            right: right.right
                        });
                    }
                    if (right.right.type === 'number') {
                        // a * (expr * b) => (a*b) * expr
                        return this.simplify({
                            type: 'binary',
                            op: '*',
                            left: { type: 'number', value: left.value * right.right.value },
                            right: right.left
                        });
                    }
                }

                // Аналогично, если правый — число, а левый — умножение с числом
                if (right.type === 'number' && left.type === 'binary' && left.op === '*') {
                    if (left.left.type === 'number') {
                        return this.simplify({
                            type: 'binary',
                            op: '*',
                            left: { type: 'number', value: right.value * left.left.value },
                            right: left.right
                        });
                    }
                    if (left.right.type === 'number') {
                        return this.simplify({
                            type: 'binary',
                            op: '*',
                            left: { type: 'number', value: right.value * left.right.value },
                            right: left.left
                        });
                    }
                }
            }

            // Сложение/вычитание
            if (ast.op === '+') {
                if (left.type === 'number' && left.value === 0) return right;
                if (right.type === 'number' && right.value === 0) return left;
            }
            if (ast.op === '-') {
                if (right.type === 'number' && right.value === 0) return left;
            }

            return { type: 'binary', op: ast.op, left, right };
        }

        return ast;
    }

    /**
     * Преобразует AST в строку с упрощением:
     * - x^1 → x
     * - -1*x → -x
     * - 0-... → -...
     */
    static astToString(ast) {
        if (ast.type === 'number') {
            return String(ast.value);
        }

        if (ast.type === 'variable') {
            return ast.name;
        }

        if (ast.type === 'binary') {
            const leftStr = this.astToString(ast.left);
            const rightStr = this.astToString(ast.right);

            if (ast.op === '^') {
                // Убираем ^1
                if (ast.right.type === 'number' && ast.right.value === 1) {
                    return leftStr;
                }
                // Для других степеней — оставляем как есть
                const left = ast.left.type === 'binary' ? `(${leftStr})` : leftStr;
                const right = ast.right.type === 'binary' ? `(${rightStr})` : rightStr;
                return `${left}^${right}`;
            }

            if (ast.op === '*') {
                // Обработка -1
                if (ast.left.type === 'number' && ast.left.value === -1) {
                    if (ast.right.type === 'variable' || (ast.right.type === 'binary' && ast.right.op === '^')) {
                        return `-${this.astToString(ast.right)}`;
                    }
                }
                if (ast.right.type === 'number' && ast.right.value === -1) {
                    return `-${leftStr}`;
                }

                // Определяем, нужны ли скобки
                const wrapLeft = ast.left.type === 'binary' && ast.left.op !== '^';
                const wrapRight = ast.right.type === 'binary' && ast.right.op !== '^';

                const left = wrapLeft ? `(${leftStr})` : leftStr;
                const right = wrapRight ? `(${rightStr})` : rightStr;

                return `${left}*${right}`;
            }

            if (ast.op === '+') {
                return `${leftStr}+${rightStr}`;
            }

            if (ast.op === '-') {
                // Специальный случай: если левый — 0, то это просто отрицание
                if (ast.left.type === 'number' && ast.left.value === 0) {
                    return `-${rightStr}`;
                }
                return `${leftStr}-${rightStr}`;
            }
        }

        return '';
    }
}

export { MiniMaple };