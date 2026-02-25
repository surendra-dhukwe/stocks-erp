const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());


// Final Stock API
app.get("/products/stock", async (req, res) => {

try {

const [rows] = await db.query(`

SELECT
code,
MAX(name) AS name,

SUM(
CASE
WHEN type = 'received' THEN total_quantity
WHEN type = 'dispatch' THEN -total_quantity
ELSE 0
END
) AS final_stock

FROM transactions

GROUP BY code

ORDER BY code ASC

`);

res.json(rows);

}

catch(err){

console.log(err);

res.status(500).json({
message:"Database Error"
});

}

});

let products = [];

// Load products first
fetch("http://localhost:3000/products")
.then(res=>res.json())
.then(data=>{
    products = data;
    addRow(); // Starting me 1 row
});

// Add new row
function addRow(){
    const table = document.querySelector("#itemTable tbody");
    const row = table.insertRow();

    // Code
    const codeCell = row.insertCell(0);
    const codeInput = document.createElement("input");
    codeInput.type = "text";
    codeInput.placeholder = "Code";
    codeInput.onkeyup = function(e){ fillNameAndCalculate(this,e); };
    codeCell.appendChild(codeInput);

    // Name
    const nameCell = row.insertCell(1);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.readOnly = true;
    nameCell.appendChild(nameInput);

    // Bags
    const bagsCell = row.insertCell(2);
    const bagsInput = document.createElement("input");
    bagsInput.type = "number";
    bagsInput.placeholder = "Bags";
    bagsInput.onkeyup = function(e){ calculateRow(this,e); };
    bagsCell.appendChild(bagsInput);

    // Quantity
    const qtyCell = row.insertCell(3);
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.placeholder = "Quantity";
    qtyInput.onkeyup = function(e){ calculateRow(this,e); };
    qtyCell.appendChild(qtyInput);

    // Total Quantity
    const totalCell = row.insertCell(4);
    const totalInput = document.createElement("input");
    totalInput.type = "number";
    totalInput.readOnly = true;
    totalCell.appendChild(totalInput);

    // Focus code input
    codeInput.focus();
}

// Fill Name based on Code
function fillNameAndCalculate(input,event){
    const row = input.parentElement.parentElement;
    const product = products.find(p=>p.code===input.value);
    row.cells[1].querySelector("input").value = product ? product.name : "";
    calculateRow(input,event);
}

// Calculate total quantity and handle Enter
function calculateRow(input,event){
    const row = input.parentElement.parentElement;
    const bags = parseFloat(row.cells[2].querySelector("input").value)||0;
    const qty = parseFloat(row.cells[3].querySelector("input").value)||0;
    row.cells[4].querySelector("input").value = (bags*qty).toFixed(2);

    updateTotals();

    // Enter key adds new row
    if(event.key === "Enter"){
        addRow();
        const newRow = document.querySelector("#itemTable tbody tr:last-child");
        newRow.cells[0].querySelector("input").focus();
    }
}

// Update Footer totals
function updateTotals(){
    let totalBags = 0;
    let grandTotalQty = 0;

    document.querySelectorAll("#itemTable tbody tr").forEach(row=>{
        const bags = parseFloat(row.cells[2].querySelector("input").value)||0;
        const totalQty = parseFloat(row.cells[4].querySelector("input").value)||0;

        totalBags += bags;
        grandTotalQty += totalQty;
    });

    document.getElementById("totalBags").innerText = totalBags + " Bags";
    document.getElementById("grandTotalQty").innerText = grandTotalQty + " Pcs";
}

// Save transaction
function saveTransaction(){

let type = localStorage.getItem("type");

// Agar null aaye to fallback
if(!type){

if(window.location.pathname.includes("dispatch")){
type="dispatch";
}
else{
type="receive";
}

}

console.log("TYPE =",type);

const items=[];

document.querySelectorAll("#itemTable tbody tr").forEach(row=>{

const code=row.cells[0].querySelector("input").value;
const name=row.cells[1].querySelector("input").value;
const totalQty=row.cells[4].querySelector("input").value;

if(code){

items.push({
code,
name,
totalQty
});

}

});


fetch("http://localhost:3000/transactions",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

type:type,
items:items

})

})

.then(res=>res.json())

.then(data=>{

alert(type + " Saved Successfully");

location.reload();

});

}

// Excel download
function downloadExcel(){
    let table = document.getElementById("itemTable");
    let rows = table.querySelectorAll("tr");
    let csvContent = "";

    rows.forEach((row)=>{
        const colOrder = [0,1,2,3,4];
        let rowData = [];
        colOrder.forEach(i=>{
            const cell = row.cells[i];
            if(cell){
                const input = cell.querySelector("input");
                rowData.push(input ? input.value || "" : cell.innerText || "");
            } else {
                rowData.push("");
            }
        });
        csvContent += rowData.join(",") + "\n";
    });

    let blob = new Blob([csvContent], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
}