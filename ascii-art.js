
var chalk = require('chalk');

function printBoot() {
  console.log(chalk.bold.red(`
    ;;;   ;;;;  ;;;;;  ;;;;;  ;  ;     ;
    ;  ;  ;       ;      ;    ;; ;    ; ;
    ;;;   ;^^     ;      ;    ; ;;   ;;;;;
    ;  ;  ;;;;    ;    ;;;;;  ;  ;  ;     ;

      Renascent Tool Inventory Application
`));
}

module.exports = { printBoot }
