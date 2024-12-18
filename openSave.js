let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

//DownloadTask
downloadBtn.addEventListener("click",function(e){
    console.log("hi");
    let jsonData = JSON.stringify([sheetDB, graphcomponentMatrix]);
    let file = new Blob([jsonData],{ type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
});

// Upload(Open)Task
openBtn.addEventListener("click",function(e){
    //Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",function(e){
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load",function(e){
            let readSheetData = JSON.parse(fr.result);

            //Basic sheet with default data willbe created
            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphcomponentMatrix = readSheetData[1];

            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphcomponentMatrix;
            handleSheetPoperties();
        })

    });
});

let firstcell = document.querySelector(`.cell[rid='${0}'][cid='${0}']`);
firstcell.click();