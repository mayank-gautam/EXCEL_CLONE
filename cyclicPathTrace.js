//for delay and  wait
function colorPromise(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },1000);
    });
}

async function isGraphCyclicTracePath(graphcomponentMatrix, cycleResponse){
    let [srcr,srcc] = cycleResponse;
    let visited = [];  
    let dfsVisited = []; 

    for(let i = 0; i < rows; i++){
        let visitedRow =[];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    
    let response = await dfsCycleDetectionTracePath(graphcomponentMatrix,srcr,srcc,visited,dfsVisited);
    if(response === true){
        return Promise.resolve(true); 
        //return true; 
    }
    return Promise.resolve(false); 
    //return false;
}

//coloring cells for tracking
async function dfsCycleDetectionTracePath(graphcomponentMatrix,srcRow,srcCol, visited, dfsVisited){
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    let cell = document.querySelector(`.cell[rid='${srcRow}'][cid='${srcCol}']`);
    console.log(cell);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();//1sec finished

    for(let children = 0; children < graphcomponentMatrix[srcRow][srcCol].length; children++){
        let [nbrr,nbrc] = graphcomponentMatrix[srcRow][srcCol][children];
        if(visited[nbrr][nbrc] === false){
            let response = await dfsCycleDetectionTracePath(graphcomponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response === true){           
                cell.style.backgroundColor = "transparent";
                await colorPromise();//1sec finished
                return Promise.resolve(true);
                //return true;  
            } 
        }else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
            // let cyclicCell = document.querySelector(`.cell[rid='${nbrr}'][cid='${nbrc}']`);
            let cyclicCell = document.querySelector(`.cell[rid='${srcRow}'][cid='${srcCol}']`);
            // console.log(cyclicCell);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();//1sec finished
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();//1sec finished
            cell.style.backgroundColor = "transparent";
            await colorPromise();//1sec finished
            return Promise.resolve(true);
            //return true; 
        }
    }

    dfsVisited[srcRow][srcCol] = false;
    return Promise.resolve(false);
    //return false; 
}