//Storage --> 2D matrix(Baisc needed)
let collectedGraphComponent= [];
let graphcomponentMatrix = [];
// for(let i = 0; i < rows; i++){
//     let row = [];
//     for(let j = 0; j < cols; j++){
//         //why array --> more than 1 child relation dependancy
//         row.push([]);
//     }
//     graphcomponentMatrix.push(row);
// }

//true --> cyclic, false --> uncyclic
function isGraphCyclic(graphcomponentMatrix){
    //dependency --> visited and dfsVisited
    let visited = [];  //Node visit trace
    let dfsVisited = []; //stack visit trace

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
    
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(visited[i][j] === false){
                let response = dfsCycleDetection(graphcomponentMatrix,i,j,visited,dfsVisited);
                if(response == true) return [i,j];
            }
        }
    }
    return null;
}

//start --> vis(T) dfsvis(T)
//end --> dfsvis(F)
//if vis[i][j] --> already explored path, so go back no use to explore
//cycleDetectionCondition --> if(vis[i][j] == true && dfs[i][j] == true) --> cyclePresent
//return true --> cyclic, false -->not cyclic
function dfsCycleDetection(graphcomponentMatrix,srcRow,srcCol, visited, dfsVisited){
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;
    for(let children = 0; children < graphcomponentMatrix[srcRow][srcCol].length; children++){
        let [nbrr,nbrc] = graphcomponentMatrix[srcRow][srcCol][children];
        if(visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphcomponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response === true) return true; //found cycle so return immediately, no need to explore more path
        }else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
            //found cycle so return immediately, no need to explore more path
            return true;
        }
    }

    dfsVisited[srcRow][srcCol] = false;
    return false;
}
