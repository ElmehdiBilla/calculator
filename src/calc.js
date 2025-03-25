const operators = ["+", "-", "*", "/"];

const handleNegativeNums = (array) => {
    const pArray = [...array];
    const handledArray = [];
    pArray.forEach((el, i) => {
        if(i === 0 && el === "+"){
            handledArray.push(pArray[i + 1]);
            pArray[i] = null;
            pArray[i + 1] = null;
        }
        else if (i === 0 && el === "-") {
            handledArray.push(el + pArray[i + 1]);
            pArray[i] = null;
            pArray[i + 1] = null;
        } else if (operators.includes(el)) {
            if (pArray[i + 1] === "-") {
                handledArray.push(el);
                handledArray.push(pArray[i + 1] + pArray[i + 2]);
                pArray[i] = null;
                pArray[i + 1] = null;
                pArray[i + 2] = null;
            }else {
                handledArray.push(el);
                pArray[i] = null;
            }
        } else {
            handledArray.push(el);
            pArray[i] = null;
        }
    });
    return handledArray.filter((el) => el);
};

const higherPrecedence = (op) => {
    if (op === "*" || op === "/") {
        return true;
    }
    return false;
};

const cleanUpArray = (array) => {
    const workingArr = [...array]
    const handledArray = [];
    workingArr.forEach(el => {
        if(el != null || el != undefined)
            handledArray.push(el);
    })
    return handledArray
}

const calc = (firstOperand,secondOperand,op) => {
    let calculation = 0;
    switch(op) {
        case '*':
            calculation = (firstOperand * secondOperand);
        break;
        case '/':
            calculation = (firstOperand / secondOperand).toFixed(12);
        break;
        case '+':
            calculation = (firstOperand + secondOperand);
        break;
        case '-':
            calculation = (firstOperand - secondOperand);
        break;
    }
    return calculation;
}


const calculatingFormula = (formulaArray) => {
    let workingFomula = [...formulaArray]
    let higher = workingFomula.some(el => {
        if(operators.includes(el)){
            if(higherPrecedence(el)){
                return true
            }
        }
    });
    let i=0
    while(i < workingFomula.length){
        if(operators.includes(workingFomula[i])){
            if(higherPrecedence(workingFomula[i])){
                const calcu = calc(Number(workingFomula[i-1]),Number(workingFomula[i+1]),workingFomula[i]);
                workingFomula[i] = calcu;
                workingFomula[i-1] = null;
                workingFomula[i+1] = null;
                workingFomula = cleanUpArray(workingFomula);
                break;
            }else if(!higher){
                const calcu = calc(Number(workingFomula[i-1]),Number(workingFomula[i+1]),workingFomula[i]);
                workingFomula[i] = calcu;
                workingFomula[i-1] = null;
                workingFomula[i+1] = null;
                workingFomula = cleanUpArray(workingFomula);
                break;
            }
        }
        i++;
        if(i > workingFomula.length){
            break;
        }
    }
    if(workingFomula.length === 1){
        return workingFomula;
    }
    return calculatingFormula(workingFomula);
}

export const handleOperatorLast = (array) => {
    let procArr = [...array]
    while(operators.includes(procArr[procArr.length - 1])){
        procArr.pop();
    }
    return procArr;
}

const calcFormula = (formula = '') => {
    if(formula){
        const regex = /\d+(\.\d+)?(e[+-]?\d+)?|[+/*()-]/g;
        const matches = formula.match(regex);
        const formulaLastOpHandled = handleOperatorLast(matches);
        const formulaNegativHandled = handleNegativeNums(formulaLastOpHandled);
        const calculation = calculatingFormula(formulaNegativHandled);
        return calculation[0];
    }
    return formula
};

export default calcFormula;
