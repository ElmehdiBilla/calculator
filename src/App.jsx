import { useEffect, useRef, useState } from "react"
import Button from "./components/Button"
import calcFormula, { handleOperatorLast } from "./calc";

function App() {
  

  const btns = [
    {
      id:'clear',
      content:'AC'
    },
    {
      id:'add',
      content:'+'
    },
    {
      id:'subtract',
      content:'-'
    },
    {
      id:'multiply',
      content:'x'
    },
    {
      id:'divide',
      content:'/'
    },
    {
      id:"zero",
      content:0,
    },
    {
      id:"one",
      content:1,
    },
    {
      id:"two",
      content:2,
    },
    {
      id:"three",
      content:3,
    },
    {
      id:"four",
      content:4,
    },
    {
      id:"five",
      content:5,
    },
    {
      id:"six",
      content:6,
    },
    {
      id:"seven",
      content:7,
    },
    {
      id:"eight",
      content:8,
    },
    {
      id:"nine",
      content:9,
    },
    {
      id:"decimal",
      content:'.',
    },
    {
      id:"equals",
      content:'=',
    },
  ]

  const operators = ['+','-','*','/'];
  const [display , setDisplay] = useState(0);
  const [formula , setFormula] = useState('');
  const [oldCalc , setOldCalc] = useState(0);
  const [MaxNumbersSize , setMaxNumbersSize] = useState(0);
  const [error , setError] = useState('');

  const DIGIT_LIMIT_MET = 'DIGIT LIMIT MET';

  const clearAll = () => {
    setDisplay(0);
    setOldCalc(0);
    setFormula('');
    setMaxNumbersSize(0);
    setError('');
  }

  const isOpiratorLast = (formula) => {
    return operators.some(op => String(formula).endsWith(op))
  }

  const isHasDecimal = (operand) => {
    if(operand.includes('.')){
      return 1;
    }
    return 0;
  }

  const handleFormulaDecimal = (formula) => {
    const formulaOperands = formula.split(/[\+\-\*\/]/);
    const lastFormulaOperands = formulaOperands[formulaOperands.length - 1];
    if(!isHasDecimal(lastFormulaOperands) && lastFormulaOperands){
      return formula + '.'
    }
    return formula;
  }


  /* formula & display handlers */
  const formula_Decimal = (oldFormula,oldDisplay) => {
    if(!oldFormula && oldDisplay === '0'){
      return '0.';
    }
    return handleFormulaDecimal(oldFormula);
  }

  const dispaly_Decimal = (oldDisplay) => {
    if(!isHasDecimal(oldDisplay) && !operators.includes(oldDisplay)){
      return oldDisplay + '.'
    }
    return oldDisplay
  }

  const formula_Operator = (oldFormula , op) => {
    if(isOpiratorLast(oldFormula)){
      const formulaOperands = oldFormula.split('');
      const lastOperator = formulaOperands[formulaOperands.length - 1];
      const beforLastOperator = formulaOperands[formulaOperands.length - 2];

      if(op === lastOperator && op !== '-'){
        return oldFormula
      }

      if(op === '+' || op === '*' || op === '/'){
        if(operators.includes(beforLastOperator) && operators.includes(lastOperator)){
          formulaOperands.pop();
        }
        formulaOperands[formulaOperands.length - 1] = op
      }else{
        if(!operators.includes(beforLastOperator)){
          formulaOperands.push(op)
        }
      }
      
      return formulaOperands.join('');
    }
    return oldFormula + op;
  }

  const handleZeroLast = (formula,op) => {
    const formulaArr = formula.split('');
    if(formulaArr[formulaArr.length - 1] === '0' && operators.includes(formulaArr[formulaArr.length - 2])){
      formulaArr[formulaArr.length - 1] = op
      return formulaArr.join('');
    }
    return formula + op;
  }

  const formula_Operand = (oldFormula , op) => {
    if(oldFormula === '0'){
      return op;
    }
    return handleZeroLast(oldFormula,op);
  }

  const dispaly_Operand = (oldDisplay , op) => {
    switch(oldDisplay){
      case '0':
      case '+':
      case '*':
      case '/':
      case '-':
        return op;
      default:
        return oldDisplay + op;
    }
  }

  const updateFormula = (op) => {

    const oldDisplay = display;
    let oldFormula= formula;
    let newFormula= '';
    let newDisplay= '';

    if(oldCalc){
      oldFormula =oldCalc;
    }

    switch(op){
      case '+':
      case '-':
      case '*':
      case '/':
        newDisplay = op;
        newFormula = formula_Operator(oldFormula,op);
        setMaxNumbersSize(0);
        break;
      case '.':
        if(MaxNumbersSize === 29){
          newDisplay = oldDisplay;
          newFormula = oldFormula;
          setError(DIGIT_LIMIT_MET);
        }else{
          newDisplay = dispaly_Decimal(oldDisplay.toString());
          newFormula = formula_Decimal(oldFormula,oldDisplay.toString());
          setMaxNumbersSize(prevS => prevS + 1);
        }
        break;
      default:
        if(MaxNumbersSize === 29){
          newDisplay = oldDisplay;
          newFormula = oldFormula;
          setError(DIGIT_LIMIT_MET);
        }else{
          newDisplay = dispaly_Operand(oldDisplay.toString(),op);
          newFormula = formula_Operand(oldFormula,op);
          setMaxNumbersSize(prevS => prevS + 1);
        }
        break;
    }

    setOldCalc(0);
    setDisplay(newDisplay);
    setFormula(newFormula);
  }

  const formula_calc = () => {
    const oldFormula= handleOperatorLast(formula).join('');
    let newFormula= '';
    let calc = 0;
    if(oldCalc){
      if( oldCalc === 'NaN' || oldCalc.includes('NaN')){
        calc = 'NaN';
        newFormula =  oldCalc + "=" + calc
      }else{
        calc = calcFormula(oldCalc.toString());
        newFormula =  oldCalc + "=" + calc
      }
    }else{
      if(oldFormula && !oldFormula.includes('NaN')){
        calc = calcFormula(oldFormula);
      }else{
        calc = 'NaN'
      }
      newFormula =  oldFormula + "=" + calc
    }
    setDisplay(calc);
    setOldCalc(calc);
    setFormula(newFormula);
  }


  const handleBtnClick = (btn) => {
    let op = btn.target.innerText
    if(op === 'x'){
      op = '*'
    }
    switch(op){
      case 'AC':
        clearAll()
        break
      case '=':
        formula_calc();
        break;
      default :
        updateFormula(op);
        break;
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]); 

  return (
    <div id="calculator">
      <div className="screen">
        <div className="formula">{formula}</div>
        {!error && <div id="display">{display}</div>}
        {error && <div id="error">{error}</div>}
      </div>
      <div id="buttons">
        {
          btns.map((num,i) => {
            return(
              <Button
                key={num.id+i}
                onClick={handleBtnClick}
                id={num.id}>
                {num.content}
              </Button>
            )
          })
        }
      </div>
    </div>
  )
}

export default App
