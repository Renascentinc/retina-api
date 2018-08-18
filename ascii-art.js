
var chalk = require('chalk');

function printBoot() {
  console.log(chalk.bold.red(`
;;;   ;;;;  ;;;;;  ;;;;;  ;  ;     ;
;  ;  ;       ;      ;    ;; ;    ; ;
;;;   ;^^^    ;      ;    ; ;;   ;;;;;
;  ;  ;;;;    ;    ;;;;;  ;  ;  ;     ;
`));
}

module.exports = { printBoot }
