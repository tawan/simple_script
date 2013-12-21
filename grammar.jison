/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
";"                   return 'SEMI'
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
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
    ;
exp
    : exp '*' exp
        { $$ = SimpleScript.multiply($1, $3); }
    | NUMBER
        {$$ = SimpleScript.number($1);}
    ;

