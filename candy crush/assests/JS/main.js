document.addEventListener("DOMContentLoaded", ()=>{
    const grid = document.querySelector(".grid");
    const width = 8;
    let score = 0;
    const candies =[];
    const CandyColor = [
        'url(./assests/images/red-candy.png)',
        "url(./assests/images/yellow-candy.png)",
        "url(./assests/images/orange-candy.png)",
        "url(./assests/images/green-candy.png)",
        "url(./assests/images/purple-candy.png)",
        "url(./assests/images/blue-candy.png)"
    ]
    console.log(CandyColor.length)
    function createBoard(){
        for (let i = 0; i < width*width; i++) {
            let candy = document.createElement('div');
            candy.setAttribute("draggable", true);
            candy.setAttribute("id", i);
            let randomColorIndex =Math.floor(Math.random()*CandyColor.length);
            candy.style.backgroundImage = CandyColor[randomColorIndex];

            grid.appendChild(candy);
            candies.push(candy);

            
            
        }
    }



    createBoard();

    let colorBeingDragged;
    let candyBeingDragged;

    let colorBeingReplaced;
    let candyBeingReplaced;

    candies.forEach(candy => candy.addEventListener("dragstart", dragStart));
    candies.forEach(candy => candy.addEventListener("dragend", dragEnd));
    candies.forEach(candy => candy.addEventListener("dragover", function (e){
        e.preventDefault();
    }));
    candies.forEach(candy => candy.addEventListener("dragleave", dragLeave));
    candies.forEach(candy => candy.addEventListener("dragenter", function (e){
        e.preventDefault();
    }));
    candies.forEach(candy => candy.addEventListener("drop", dragDrop));

    document.getElementById('save_game').addEventListener("click", saveGame);
    document.getElementById("load_game").addEventListener("click", loadGame);

    function dragStart(){
        colorBeingDragged = this.style.backgroundImage;
        candyBeingDragged = parseInt(this.id);
    }
    function dragLeave(){
       
    }
    function dragDrop(){
        colorBeingReplaced = this.style.backgroundImage;
        candyBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        candies[candyBeingDragged].style.backgroundImage = colorBeingReplaced;
    }
    
    function dragEnd(){
        let validMoves = [
            candyBeingDragged + 1,
            candyBeingDragged - 1,
            candyBeingDragged + width,
            candyBeingDragged - width
        ]

        let invalidMove = (candyBeingDragged+candyBeingReplaced) % width == width-1 && (candyBeingDragged % width == 0 || candyBeingReplaced % width == 0);

        const isValidMove = validMoves.includes(candyBeingReplaced) && !invalidMove;
        if(candyBeingReplaced && isValidMove){
            candyBeingReplaced = null;
            colorBeingReplaced = null;
            candyBeingDragged = null;
            colorBeingDragged = null;
        }
        else if(candyBeingReplaced && !isValidMove){
            candies[candyBeingDragged].style.backgroundImage = colorBeingDragged;
            candies[candyBeingReplaced].style.backgroundImage = colorBeingReplaced;
        }
        else{
            candies[candyBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    function generateRandomCandies(){
        for (let i = 0; i <= width*(width-1)-1; i++) {
            if(candies[i+width].style.backgroundImage === '' ){
                candies[i+width].style.backgroundImage = candies[i].style.backgroundImage
                candies[i].style.backgroundImage = '';
            }
            if(i<width && candies[i].style.backgroundImage === ''){
                candies[i].style.backgroundImage = CandyColor[Math.floor(Math.random() * CandyColor.length)];
            }
            
            
        }
    }

    function checkRow(n){
        let invalidIndex = [];
        for (let i = width-(n-1); i <= width*width - n; i+= width) {
            invalidIndex.push(i, i+1);
            if(n >= 4) invalidIndex.push(i+2);
            if(n == 5) invalidIndex.push(i+3);
        }
        for (let i = 0; i <= width*width - n; i++) {
            let Candies_list = [];
            Candies_list.push(i, i+1, i+2)
            if(n >= 4) Candies_list.push(i+3);
            if(n == 5) Candies_list.push(i+4);
            let desiredImage = candies[i].style.backgroundImage;

            if(invalidIndex.includes(i)){
                continue;
            }

            let match = Candies_list.every(index => candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 5;
                Candies_list.forEach(index => candies[index].style.backgroundImage = "");
            }
            
        }
    }

    checkRow(5);
    checkRow(4);
    checkRow(3);

    function checkColumn(n){
        for (let i = 0; i <= width*(width-(n-1)) -1; i++) {
            let Candies_list = [];
            Candies_list.push(i, i+width, i+width*2)
            if(n >= 4) Candies_list.push(i+width*3);
            if(n == 5) Candies_list.push(i+ width*4);

            let desiredImage = candies[i].style.backgroundImage;

            let match = Candies_list.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += n;
                Candies_list.forEach(index => candies[index].style.backgroundImage = "")
            }
            
        }  
    }

    checkColumn(5);
    checkColumn(4);
    checkColumn(3);
    /*function checkRowforFive(){
        let invalidIndex = [];
        for (let i = width-4; i <= width*width - 5; i+= width) {
            invalidIndex.push(i, i+1,i+2,i+3);
        }
        for (let i = 0; i <= width*width - 5; i++) {
            let fiveCandies = [i,i+1,i+2,i+3,i+4];
            let desiredImage = candies[i].style.backgroundImage;

            if(invalidIndex.includes(i)){
                continue;
            }

            let match = fiveCandies.every(index => candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 4;
                fiveCandies.forEach(index => candies[index].style.backgroundImage = "");
            }
            
        }
    }
    checkRowforFive();

    function checkColumnforFive(){
        for (let i = 0; i <= width*(width-4) -1; i++) {
            let fiveCandies = [i, i + width, i + width*2, i+width*3, i+width*4];
            let desiredImage = candies[i].style.backgroundImage;

            let match = fiveCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 4;
                fiveCandies.forEach(index => candies[index].style.backgroundImage = "")
            }
            
        }
    }
    checkColumnforFive();

    function checkColumnforFour(){
        for (let i = 0; i <= width*(width-3) -1; i++) {
            let fourCandies = [i, i + width, i + width*2,i+width*3];
            let desiredImage = candies[i].style.backgroundImage;

            let match = fourCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 4;
                fourCandies.forEach(index => candies[index].style.backgroundImage = "")
            }
            
        }
    }
    checkColumnforFour();

    /*function checkRowforFour(){
        let invalidIndex = [];
        for (let i = width-3; i <= width*width - 4; i+= width) {
            invalidIndex.push(i, i+1,i+2);
            
        }
        for (let i = 0; i <= width*width - 4; i++) {
            let fourCandies = [i,i+1,i+2,i+3];
            let desiredImage = candies[i].style.backgroundImage;

            if(invalidIndex.includes(i)){
                continue;
            }

            let match = fourCandies.every(index => candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 4;
                fourCandies.forEach(index => candies[index].style.backgroundImage = "");
            }
            
        }
    }
    checkRowforFour();

    function checkRowforThree(){
        let invalidIndex = [];
        for (let i = width-2; i <= width*width - 3; i+= width) {
            invalidIndex.push(i, i+1);
            
        }
        for (let i = 0; i <= width*width - 3; i++) {
            let threeCandies = [i,i+1,i+2];
            let desiredImage = candies[i].style.backgroundImage;

            if(i> width-2 && (i % width == 2 || i % width == 1)){
                continue;
            }

            let match = threeCandies.every(index => candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 3;
                threeCandies.forEach(index => candies[index].style.backgroundImage = "");
            }
            
        }
    }
    checkRowforThree();

    function checkColumnforThree(){
        for (let i = 0; i <= width*(width-2)-1; i++) {
            let threeCandies = [i, i + width, i + width*2];
            let desiredImage = candies[i].style.backgroundImage;

            let match = threeCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if(match){
                score += 3;
                console.log(score);
                threeCandies.forEach(index => candies[index].style.backgroundImage = "")
            }
            
        }
    }
    checkColumnforThree();

    */    
    function saveGame(){
        candiesInfo = [];

        candies.forEach(candy =>{ candiesInfo[candy.id] = candy.style.backgroundImage
        });

        console.log(candiesInfo);
        localStorage.setItem("board", JSON.stringify(candiesInfo));
        console.log(candies);
    }

    function loadGame(){
        let oldBoard = localStorage.getItem("board");
        BoardArray = JSON.parse(oldBoard);
        candies.forEach(candy =>{
            candy.style.backgroundImage = oldBoard[candy.id];
        })
    }


    window.setInterval(function () {
        checkRow(5);
        checkRow(4);
        checkRow(3);
        /*checkRowforFive();
        checkRowforFour();
        checkRowforThree();
        checkColumnforFive();
        checkColumnforFour();
        checkColumnforThree();*/

        checkColumn(5);
        checkColumn(4);
        checkColumn(3);
        
        generateRandomCandies();
        console.log(score);
    }, 500 );

});


