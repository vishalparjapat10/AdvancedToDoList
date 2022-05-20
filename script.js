const uid = new ShortUniqueId(); 

const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");

let colors = ['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor = colors[colors.length-1];// black
let textAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector('.main-cont');

let ticketArr = [];
let toolBoxColors = document.querySelector(".color");

// to open/close modal container
let isModalPresent = false;
addBtn.addEventListener('click',function(){
    if(!isModalPresent){
        modalCont.style.display = "flex";    
    }
    else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent
    
})

// to remove and add active class from each priority color of modal container
const allPriorityColors = document.querySelectorAll('.priority-color');

allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener("click",function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active");
        });
            colorElem.classList.add("active");
            modalPriorityColor = colorElem.classList[0];
    })
})

// to generate and display a ticket
modalCont.addEventListener("keydown", function (e) {
    let key = e.key;
    if (key == "Shift") {
      createTicket(modalPriorityColor, textAreaCont.value);
      modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function (colorElem) {
            colorElem.classList.remove("active");
        })
    }
});

// function to create new ticket
function createTicket(ticketColor,data,ticketId){
    let id = ticketId || uid();
    let ticketCont = document.createElement("div");//<div></div>
    ticketCont.setAttribute("class","ticket-cont");//<div class ="ticket-cont"></div>
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${data}</div>
    `;

    mainCont.appendChild(ticketCont);

    // if the ticket is being created for the first time,then ticketId would be undefined
    if(!ticketId){
        ticketArr.push({ticketColor,data,ticketId:id});
        localStorage.setItem("tickets",JSON.stringify(ticketArr));
    }
    
}

// get all tickets from local storage
if(localStorage.getItem("tickets")){
    ticketArr = JSON.parse(localStorage.getItem("tickets"));
    ticketArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId)
    })
}

// filter tickets on the basis of ticket color
for(let i = 0;i < toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter(function(ticketObj){
            return currToolBoxColor == ticketObj.ticketColor;
        });

        // remove all the tickets from the UI
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0;i < allTickets.length;i++){
            allTickets[i].remove();
        }

        // display only filteredTickets on the UI 
        filteredTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
        })
    })

    // to display all the tickets of all colors on double clicking
    toolBoxColors[i].addEventListener("dbclick",function(){

        // remove all the color sepcific tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0;i < allTickets.length;i++){
            allTickets[i].remove();
        }

        // display all tickets
        ticketArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
        })
    })
}

