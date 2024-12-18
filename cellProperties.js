//Storage
let collectedSheetDB = []; //contains all SheetDB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
    // handleSheetPoperties();
}
// for(let i = 0; i < rows; i++){
//     let sheetRow = [];
//     for(let j = 0; j < cols; j++){
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000",   
//             value : "",
//             formula : "",
//             children : []
//         }
//         sheetRow.push(cellProp)
//     }
//     sheetDB.push(sheetRow);
// }


//Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1]
let rightAlign = alignment[2]

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

//Application of two-way binding
//Attach property listner
bold.addEventListener("click", function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
   
    //Modification
    cellProp.bold = !cellProp.bold; //DataChange
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change part 1
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //UI change part 2
});
italic.addEventListener("click", function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
   
    //Modification
    cellProp.italic = !cellProp.italic; //DataChange
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI change part 1
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //UI change part 2
});
underline.addEventListener("click", function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
   
    //Modification
    cellProp.underline = !cellProp.underline; //DataChange
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI change part 1
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //UI change part 2
});
fontSize.addEventListener("change",function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize =  cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
});
fontFamily.addEventListener("change",function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily =  cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
});
fontColor.addEventListener("change",function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color =  cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
});    
BGcolor.addEventListener("change",function(e){
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.BGcolor = BGcolor.value;
    cell.style.backgroundColor =  cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
});

alignment.forEach(function(alignElem){
    alignElem.addEventListener("click",function(e){
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; //data change
        cell.style.textAlign = cellProp.alignment; //Ui change 1
        switch(alignValue){//Ui change 2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    });
});


let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++){
    addListnerToAttachCellProperties(allCells[i]);
}
function addListnerToAttachCellProperties(cell){
    cell.addEventListener("click",function(e){
        let address = addressBar.value;
        let [rid,cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        //apply properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize =  cellProp.fontSize + "px";
        cell.style.fontFamily =  cellProp.fontFamily;
        cell.style.color =  cellProp.fontColor;
        cell.style.backgroundColor =  cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;
        
        //apply properties to UI container Props
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        switch(cellProp.alignment){//Ui change 2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

function getCellAndCellProp(address){
    let [rid,cid] = decodeRIDCIDFromAddress(address);
    //Acess cell and storage object
    let cell = document.querySelector(`.cell[rid='${rid}'][cid='${cid}']`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp]; //cell se data me change hoga and cellProp se UI me
}

function decodeRIDCIDFromAddress(address){
     //address -> "A1" -->a string
    let rid = Number(address.slice(1) - 1);//"1" -> 0 milega
    let cid = Number(address.charCodeAt(0)) - 65; //"A" -> 65 ascii value dega       
    return [rid,cid];
}