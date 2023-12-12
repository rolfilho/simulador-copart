// app.js (client-side)
document.addEventListener('DOMContentLoaded', function () {
    // Populate default values on page load
    populateProcedureInputs();
    calculateEstimates();
});

function populateProcedureInputs() {
    const procedures = [
        { category: "Consultas Eletivas", frequency: 4, cost: 100 },
        { category: "Visita ao PS", frequency: 2, cost: 250 },
        { category: "Exames Simples", frequency: 17, cost: 15 },
        { category: "Exames Complexos", frequency: 1, cost: 250 },
        { category: "Terapia", frequency: 3, cost: 75 }
    ];

    const outputTableYear = document.getElementById("outputTableYear");

    procedures.forEach((procedure, index) => {
        const row = outputTableYear.insertRow();
        row.insertCell(0).textContent = procedure.category;
        row.insertCell(1).textContent = getExamples(procedure.category);

        const frequencyCell = row.insertCell(2);
        frequencyCell.innerHTML = `<input type="number" min="0" value="${procedure.frequency}" onchange="calculateEstimates()">`;

        const costCell = row.insertCell(3);
        costCell.innerHTML = `<input type="number" min="0" value="${procedure.cost}" onchange="calculateEstimates()">`;

        const copaymentCell = row.insertCell(4);
        copaymentCell.textContent = "R$ 0,00";
    });
}

function calculateEstimates() {
    const familyMembers = parseInt(document.getElementById("familyMembers").value);
    const additionalFee = document.getElementById("additionalFee").value === "true";

    const totalPeopleForCalculations = familyMembers + 1; // Main policyholder plus additional family members

    const outputTableYear = document.getElementById("outputTableYear");
    let totalCopaymentYear = 0;

    for (let i = 0; i < outputTableYear.rows.length; i++) {
        const procedure = {
            frequency: parseInt(outputTableYear.rows[i].cells[2].querySelector('input').value),
            cost: parseInt(outputTableYear.rows[i].cells[3].querySelector('input').value)
        };

        const copayment = procedure.frequency * procedure.cost * 0.2 * totalPeopleForCalculations;
        totalCopaymentYear += copayment;

        outputTableYear.rows[i].cells[4].textContent = `R$ ${copayment.toFixed(2)}`;
    }

    // Update the total copayment row
    document.getElementById("totalCopaymentYear").textContent = `R$ ${totalCopaymentYear.toFixed(2)}`;

    const totalCurrentCost = additionalFee ? (totalPeopleForCalculations-1) * 200 * 12 : 0;
    const savingsYear = Math.max(0, totalCurrentCost - totalCopaymentYear);

    document.getElementById("totalCurrentCost").textContent = `R$ ${totalCurrentCost.toFixed(2)}`;
    document.getElementById("savingsYear").textContent = `R$ ${savingsYear.toFixed(2)}`;
}



function getExamples(category) {
    switch (category) {
        case "Consultas Eletivas":
            return "Consulta com ginecologista, dermatologista";
        case "Visita ao PS":
            return "Consulta e procedimentos em Pronto Socorro";
        case "Exames Simples":
            return "Glicose, Colesterol";
        case "Exames Complexos":
            return "Ressonância Magnética, Tomografia";
        case "Terapia":
            return "Terapia com Psicólogo ou Fonoaudiólogo";
        default:
            return "";
    }
}
