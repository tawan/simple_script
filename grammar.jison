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
"="                   return '='
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%left '*' '/'

%start expressions

%% /* language grammar */

expressions
    : stmt_list EOF
        { return SimpleScript.create($1); }
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
        { $$ = [ $1 ]; }
    | stmt_list stmt SEMI
        { $1.push($2); $$ = $1; }
    ;

stmt
    : IDENT '=' exp
        { $$ = SimpleScript.assignment($1, $3); }
    | exp
        { $$ = $1; }
    | WHILE condition block
        { $$ = SimpleScript.while_loop($2, $3) ;}
    ;

exp
    : exp '*' exp
        { $$ = SimpleScript.multiply($1, $3); }
    | NUMBER
        {$$ = SimpleScript.number($1);}
    | IDENT
        { $$ = SimpleScript.ident($1);}
    ;
