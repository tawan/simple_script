/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
";"                   return 'SEMI'
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"array"               return 'ARRAY'
"print"               return 'PRINT'
"read"                return 'READ'
"while"               return 'WHILE'
"true"                return 'TRUE'
"false"               return 'FALSE'
"=="                  return 'EQUALS'
"!="                  return 'ISNOT'
"{"                   return '{'
"}"                   return '}'
">"                   return 'GRT'
"<"                   return 'LGT'
[a-z]+                return 'IDENT'
"*"                   return '*'
"+"                   return '+'
"="                   return '='
"("                   return '('
")"                   return ')'
"["                   return '['
"]"                   return ']'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%left '*' '/' '+'

%start expressions

%% /* language grammar */

expressions
    : stmt_list EOF
        { return SimpleScript.treeFactory.createNode({ children: $1 }); }
    ;

block
    : '{' stmt_list '}'
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column ,children: $2 }) ;}
    ;

condition
    : exp EQUALS exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "equals", children: [ $1, $3 ] }); }
    | exp ISNOT exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "isnot", children: [ $1, $3 ] }); }
    | exp GRT exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "greater", children: [ $1, $3 ] }); }
    | exp LGT exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "lower", children: [ $1, $3 ] }); }
    | TRUE
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "nativeTrue", children: [] }); }
    | FALSE
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "nativeFalse", children: [] }); }
    ;

stmt_list
    : stmt SEMI
        { $$ = SimpleScript.createEnumerable(); $$.push($1); }
    | stmt_list stmt SEMI
        { $1.push($2); $$ = $1; }
    ;

stmt
    : adress READ
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "read", children: [$1 ] }); }
    | adress exp
        {
          $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "assignment", children: [ $1, $2 ]});
        }
    | exp
        { $$ = $1; }
    | WHILE '('condition')' block
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "whileLoop", children: [ $3, $5 ] }); }
    | PRINT exp
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "print", children: [ $2 ] }); }
    ;
adress
    : IDENT'='
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "adress", value: $1 }); }
    | IDENT'['exp']''='
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "adress_with_acc", value: $1, children: [ $3 ] }); }
    ;

exp
    : '(' exp ')'
        { $$ = $2;  }
    | ARRAY'('exp')'
        {$$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "array", children: [ $3 ] });}
    | exp '+' exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "addition", children: [ $1, $3 ]}); }
    | exp '*' exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "multiplication", children: [ $1, $3 ]}); }
    | NUMBER
        {$$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "number", value: $1 });}
    | IDENT'['exp']'
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "ident_with_acc", value: $1, children: [ $3 ] }); }
    | IDENT
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "ident", value: $1 }); }
    ;
number
    : NUMBER
        {$$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "number", value: $1 });}
    ;
 
