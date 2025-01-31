const task1 = [
    [0,0,1,0,0],
    [0,0,1,0,1],
    [1,1,1,1,1],
    [1,0,1,0,1],
    [1,1,1,1,1],
];

const fieldSize = 5;

const taskState = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
];

const blackCellsAmount = countBlackCells(task1);

let field = document.createElement("div");
let counter = 0;

field.addEventListener('click', function () {

    if(this.classList.contains("game-over")) {
        counter += 1;
        console.log(counter)
        if (counter === 3) {
            field.append(createMessage("WHAT?"))
        }
        if (counter === 6) {
            field.append(createMessage("STOP DO IT!!"))
        }
        if (counter === 9) {
            field.append(createMessage("BUY ASSHOLE ;)"))

            setTimeout(() => {
                field.remove();
            }, 2000)

        }

    }

})

function getClues(task) {
    let rowClue = [];
    let collClue =[];
    let colToRow = [];

    for (let i = 0; i < task.length; i++) {
        let tempRowClue = 0;
        let tempClue = [];
        let tempCollTask = [];

        for (let j = 0; j < task[i].length; j++) {
            tempCollTask[j] = task[j][i];

            if (task[i][j] === 1) {
                tempRowClue += task[i][j];
            } else {
                if (tempRowClue  > 0) {
                    tempClue.push(tempRowClue);
                    tempRowClue = 0;
                }
            }

            if (j + 1 === task[i].length && tempRowClue !== 0) {
                tempClue.push(tempRowClue);
                tempRowClue = 0;
            }
        }
        colToRow.push(tempCollTask)
        rowClue.push(tempClue)
    }

    for (let i = 0; i < colToRow.length; i++) {
        let tempRowClue = 0;
        let tempClue = [];

        for (let j = 0; j < colToRow[i].length; j++) {
            if (colToRow[i][j] === 1) {
                tempRowClue += colToRow[i][j];
            } else {
                if (tempRowClue  > 0) {
                    tempClue.push(tempRowClue);
                    tempRowClue = 0;
                }
            }

            if (j + 1 === colToRow[i].length) {
                tempClue.push(tempRowClue);
                tempRowClue = 0;
            }
        }
        collClue.push(tempClue)
    }

    return [rowClue, collClue];
}

function drawField(task) {
    const [rowClues, collClues] = getClues(task);

    field.classList.add("field");

    for (let row = 0; row <= fieldSize; row++ ) {

        let divRow = document.createElement("div");
        divRow.classList.add("row");

        if (row !== fieldSize) {

            for (let coll = 0; coll < fieldSize; coll++) {
                let divColl = document.createElement("div");
                divColl.classList.add("coll");
                divColl.setAttribute("data-cell", "0");
                divColl.setAttribute("data-coll", coll.toString());
                divColl.setAttribute("data-row", row.toString());
                divColl.addEventListener("click", onCellButtonClick)
                divRow.append(divColl)
            }

            divRow.insertAdjacentHTML("afterbegin", `<div class="coll coll_clue">${rowClues[row].join(" / ")}</div>`)
            field.append(divRow);
        } else {


            for (let clueI = 0; clueI <= fieldSize; clueI++) {
                if (clueI === 0) {
                    divRow.insertAdjacentHTML("beforeend", `<div class="coll row_clue coll_clue"></div>`)
                } else {
                    divRow.insertAdjacentHTML("beforeend", `<div class="coll row_clue">${collClues[clueI - 1].join(" / ")}</div>`);
                }
            }
            field.insertAdjacentElement("afterbegin", divRow)
        }

    }

    document.body.append(field);

}

function onCellButtonClick() {
    const data =  Number(this.getAttribute("data-cell"));
    const newData = data === 0 ? 1 : 0;
    this.setAttribute("data-cell", newData.toString());

    const dataColl = this.getAttribute("data-coll");
    const dataRow = this.getAttribute("data-row");

    taskState[dataRow][dataColl] = newData;

    if (countBlackCells(taskState) === blackCellsAmount) {
        checkImage();
    }
}

function countBlackCells(arr) {
    return arr.reduce((sum, row) => sum + row.filter(item => item === 1).length, 0);
}

function checkImage() {
   const result = areIdenticalArrays(taskState, task1);
    console.log(result)
   if (result) {
       field.append(createMessage("FY, close window and go back to work"));
       field.classList.add("game-over");
   }
}

function areIdenticalArrays(arr1, arr2) {

    for (let i = 0; i < arr1.length; i++) {

        if (!areEqualRows(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}

function areEqualRows(row1, row2) {
    for (let j = 0; j < row1.length; j++) {
        if (row1[j] !== row2[j]) {
            return false;
        }
    }

    return true;
}

function createMessage(text) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    div.classList.add("message");
    p.textContent = text;
    div.append(p);
    setTimeout(()=> {
        div.classList.add("transparent");
    }, 1000);
    return div;
}

drawField(task1);

