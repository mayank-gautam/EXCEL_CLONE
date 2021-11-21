let activeSheetColor = "#ced6e0";

let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click",function(e){
    let sheet = document.createElement("div");
    let allSheetFolders = document.querySelectorAll(".sheet-folder");

    sheet.setAttribute("id",allSheetFolders.length);
    sheet.setAttribute("class","sheet-folder");
    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length+1}</div>`;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    // DB
    createSheetDB();
    console.log(sheetDB);
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",function(e){
        //ek number aaega 0 --> left click; 1 --> drag/scroll hota jo mouse ka; 2 --> right click
        if(e.button !== 2){
            return;
        }

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length == 1){
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if(response === false){
            return;
        }
        let sheetIdx = Number(sheet.getAttribute("id"));
        //DB
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);
        //UI
        handleSheetUIRemoval(sheet);

        //by Default bring sheet1 to active
        sheetDB = collectedSheetDB[0];
        graphcomponentMatrix = collectedGraphComponent[0];
        handleSheetPoperties()
        handleSheetDB
    });
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerHTML = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx){
    sheetDB = collectedSheetDB[sheetIdx];
    graphcomponentMatrix = collectedGraphComponent[sheetIdx];
}
function handleSheetPoperties(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
            cell.click();
        }
    }
    let firstcell = document.querySelectorAll(".cell")[0];  //cells ka first element (0,0)  hi hota
    // console.log(firstcell);
    firstcell.click();
    firstcell.focus();
    // window.onload=function(){
    //     document.querySelectorAll(".cell")[0].click();
    // };
    // firstcell.addEventListener("click",function(e){
    //       console.log("hi");
    // })
}

function handleSheetUI(sheet){
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for( let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click",function(e){
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetPoperties();
        handleSheetUI(sheet);
    });
}

function createSheetDB(){
    let sheetDB = [];
    for(let i = 0; i < rows; i++){
        let sheetRow = [];
        for(let j = 0; j < cols; j++){
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#ECF0F1",   
                value : "",
                formula : "",
                children : []
            }
            sheetRow.push(cellProp)
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphcomponentMatrix = [];
    for(let i = 0; i < rows; i++){
        let row = [];
        for(let j = 0; j < cols; j++){
            //why array --> more than 1 child relation dependancy
            row.push([]);
        }
        graphcomponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphcomponentMatrix);
}

