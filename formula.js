for(let a = 0; a < 100; a++){
    for(let b = 0; b < 26; b++){
        let cell = document.querySelector(`.cell[rid='${a}'][cid='${b}']`);
        cell.addEventListener("blur", function(){
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            
            if(enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            //if data modifies remove parent-children relation, formual empty, upadte children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            upddateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async function(e){
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){        

        //if change in formula, break old parent-children relation, evaluate new formula, add new parent-children relation
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);
        if(inputFormula != cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula, address);
        //check formula is cyclic or not, then only evaluate
        let cycleResponse = isGraphCyclic(graphcomponentMatrix);
        if(cycleResponse){
            // alert("You formula is cyclic");
            let response = confirm("You formula is cyclic. Do you want to trace your path?");
            while(response === true){
                //keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphcomponentMatrix,cycleResponse); //I want to complete full iteration of color tracking, so i will attach wait here also.
                response = confirm("You formula is cyclic. Do you want to trace your path?");
            }
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        //to update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        // console.log(sheetDB);
        upddateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula, childAddress){
    let[crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
           let[prid,pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
           //rid --> i, cid --> j
           graphcomponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress){
    let[crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
           let[prid,pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
           //rid --> i, cid --> j
           graphcomponentMatrix[prid][pcid].pop();
        }
    }
}

function upddateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;
    for(let i = 0; i < children.length; i++){
        let childAddress =children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        upddateChildrenCells(childAddress);
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function evaluateFormula(formula){ //formula must be space separated
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [cell,cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
    //eval function js ka function hai jo string me likhe ko evaluate karke dedega like 40+10 ko 50 return kardega
}

function setCellUIAndCellProp(evaluatedValue,formula, address){
    let[cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue; //UI update
    cellProp.value = evaluatedValue; //DB update 1
    cellProp.formula = formula; //DB update 2
}