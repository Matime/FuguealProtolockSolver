Init();
Object.defineProperty(String.prototype,"InsertAt",{
    value:function InsertAt(insStr,pos){
        return this.slice(0,pos)+insStr+this.slice(pos);
    },
    writable:true,
    configurable:true
});
function Init() {
    var template = document.getElementById('tdTemplate');
    for (var i = 1; i <= 9; i++) {
        document.getElementById('inputTd' + i).innerHTML =
            interpolate(template.innerHTML, { num: i });
    }
    document.getElementById('myButton').addEventListener('click', Solve);
    document.getElementById('myTextArea').addEventListener('change',UpdateInputGrid);
}
function InsertAt(baseStr,pos,insStr){
    return baseStr.slice(0,pos)+insStr+baseStr.slice(pos);
}
function UpdateInputGrid(){
    var array = document.getElementById('myTextArea')
        .value
        .trim()
        .split('\n')
        .filter(f => f.trim() !== '')
        .flatMap((ele, idx) => {
            return ele.split('/').map(
                (ele, idx2) => {
                    return {
                        value: (idx * 3) + (idx2 + 1),
                        borderType: ele[0],
                        borderCount: ele[1],
                        coreType: ele[2],
                        coreCount: ele[3],
                    };
                })
        });
    if(array.length!=9)
        alert('Stop it.');
    for(var i=1;i<array.length+1;i++){
        document.getElementById('bt'+i).value = array[i-1].borderType;
        document.getElementById('bc'+i).value = array[i-1].borderCount;
        document.getElementById('ct'+i).value = array[i-1].coreType;
        document.getElementById('cc'+i).value = array[i-1].coreCount;
    }

}
function UpdateInputTextArea(){
    var string ='';
    for(var i=1;i<=9;i++){
        var borderType = document.getElementById('bt'+i).value;
        var borderCount = document.getElementById('bc'+i).value;
        var coreType = document.getElementById('ct'+i).value;
        var coreCount = document.getElementById('cc'+i).value;
        string+=`${borderType}${borderCount}${coreType}${coreCount}`;
    }
    string = string.InsertAt("/",32)
        .InsertAt("/",28)
        .InsertAt("/",20)
        .InsertAt("/",16)
        .InsertAt("/",8)
        .InsertAt("/",4)
        .InsertAt('\r\n',28)
        .InsertAt('\r\n',14);
    document.getElementById('myTextArea').value=string;

}
function ClearInput(){
    document.getElementById('myTextArea').innerHTML ='';
}
function Solve() {
    var array = document.getElementById('myTextArea')
        .value
        .trim()
        .split('\n')
        .filter(f => f.trim() !== '')
        .flatMap((ele, idx) => {
            return ele.split('/').map(
                (ele, idx2) => {
                    return {
                        value: (idx * 3) + (idx2 + 1),
                        borderType: ele[0],
                        borderCount: ele[1],
                        coreType: ele[2],
                        coreCount: ele[3],
                    };
                })
        });
    var validcombinations = choose(array, 3).filter(element => checkAllProperties(element));
    if (validcombinations.length > 3) {
        console.log(validcombinations);
        validcombinations = HandleMoreThanThreeSets(validcombinations);
        console.log(validcombinations);
    } else if (validcombinations.length < 3) {
        document.getElementById('errorMessage').innerHTML = 'No solution found, please check your input.';
        setColors();
        return;
    }
    document.getElementById('errorMessage').innerHTML = '';
    validcombinations = validcombinations.map((ele, idx) => {
        ele[0].grouping = idx;
        ele[1].grouping = idx;
        ele[2].grouping = idx;
        return ele;
    }).flat();
    validcombinations.sort((a, b) => a.value - b.value);
    setColors(validcombinations);
}
function HandleMoreThanThreeSets(validCombs) {
    var allSetCombos = choose(validCombs, 3);
    for (var i = 0; i < allSetCombos.length; i++) {
        PrintSetCombo(allSetCombos[i]);
    }
    allSetCombos = allSetCombos.filter(f => checkSetCombination(f));
    return allSetCombos[0];
}
function PrintSetCombo(combo) {
    for (i = 0; i < combo.length; i++) {
        var setString = '';
        for (j = 0; j < combo[i].length; j++) {
            var currentVal = combo[i][j].value;
            setString += `${currentVal}`;
        }
    }
}
function checkSetCombination(setCombination) {
    var usedValues = [];
    for (i = 0; i < setCombination.length; i++) {
        for (j = 0; j < setCombination[i].length; j++) {
            var currentVal = setCombination[i][j].value;
            if (usedValues.indexOf(currentVal) !== -1)
                return false;
            usedValues.push(currentVal);
        }
    }
    return true;
}
function checkAllProperties(comb) {
    var toReturn = checkProperty(comb, "borderType") &&
        checkProperty(comb, "borderCount") &&
        checkProperty(comb, "coreType") &&
        checkProperty(comb, "coreCount");
    return toReturn;
}
function checkProperty(comb, propType) {
    var array = [comb[0][propType], comb[1][propType], comb[2][propType]];
    var elementsEqual = array.every(v => v == array[0]);
    var elementsDifferent = array.every((v, i) => array.indexOf(v) == i);
    return elementsEqual || elementsDifferent;
}
function choose(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        choose(arr.slice(i + 1), k - 1, [...prefix, v])
    );
}
function setColors(combs) {
    if (!combs) {
        for (var i = 1; i <= 9; i++) {
            document.getElementById('inputTd' + i).bgColor = 'white';
        }
    } else {
        for (var i = 0; i < combs.length; i++) {
            var grouping = combs[i].grouping;
            var color = getColor(grouping);
            document.getElementById('inputTd' + (i + 1)).bgColor = color;
        }
    }
}
function getColor(idx) {
    switch (idx) {
        case 0:
            return "red";
        case 1:
            return "green";
        case 2:
            return "blue";
        default:
            return "white";
    }
}
function interpolate(str, params) {
    let names = Object.keys(params);
    let vals = Object.values(params);
    return new Function(...names, `return \`${str}\`;`)(...vals);
}