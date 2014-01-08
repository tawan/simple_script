/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
";"                   return 'SEMI'
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
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
        { return SimpleScript.treeFactory.createNode($1); }
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
    : IDENT '=' exp
        { $$ = SimpleScript.treeFactory.createAssignment($1, $3); }
    | exp
        { $$ = $1; }
    | WHILE condition block
        { $$ = SimpleScript.while_loop($2, $3) ;}
    ;

exp
    : '(' exp ')'
        { $$ = $2;  }
    | exp '+' exp
        { $$ = SimpleScript.treeFactory.createAddition($1, $3); }
    | exp '*' exp
        { $$ = SimpleScript.treeFactory.createMultiplication($1, $3); }
    | NUMBER
        {$$ = SimpleScript.treeFactory.createNumber($1);}
    | IDENT
        { $$ = SimpleScript.treeFactory.createIdent($1);}
    ;
