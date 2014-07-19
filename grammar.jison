/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
";"                   return 'SEMI'
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"print"               return 'PRINT'
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
        { $$ = $2 ; }
    ;

condition
    : exp EQUALS exp
        { $$ = SimpleScript.equals($1, $3); }
    | exp ISNOT exp
        { $$ = SimpleScript.isnot($1, $3); }
    | exp GRT exp
        { $$ = SimpleScript.greater($1, $3); }
    | exp LGT exp
        { $$ = SimpleScript.lower($1, $3); }
    | TRUE
        { $$ = SimpleScript.boolean(true); }
    | FALSE
        { $$ = SimpleScript.boolean(false); }
    ;

stmt_list
    : stmt SEMI
        { $$ = SimpleScript.createEnumerable(); $$.push($1); }
    | stmt_list stmt SEMI
        { $1.push($2); $$ = $1; }
    ;

stmt
    : ident '=' exp
        {
          $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "assignment", children: [ $1, $3 ]});
        }
    | exp
        { $$ = $1; }
    | WHILE condition block
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "while", children: [ $2 ] }); }
    | PRINT exp
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "print", children: [ $2 ] }); }
    ;

exp
    : '(' exp ')'
        { $$ = $2;  }
    | exp '+' exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "addition", children: [ $1, $3 ]}); }
    | exp '*' exp
        { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "multiplication", children: [ $1, $3 ]}); }
    | NUMBER
        {$$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "number", value: $1 });}
    | ident
        {$$ =  $1 }
    ;
ident
    : IDENT
      { $$ = SimpleScript.treeFactory.createNode({ line: yylineno, firstColumn: this._$.first_column, lastColumn: this._$.last_column, type: "ident", value: $1 }); }
    ;
 
