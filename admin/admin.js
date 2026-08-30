/* =========================================================
   IDREMIS ADMIN PORTAL - INTERACTIVE FORMS
   ========================================================= */


/* =========================================================
   NEW INCIDENT LOG
   ========================================================= */

const newIncidentBtn = document.getElementById("newIncidentBtn");
const incidentModal = document.getElementById("incidentModal");
const closeIncidentBtn = document.getElementById("closeIncidentBtn");
const cancelIncidentBtn = document.getElementById("cancelIncidentBtn");
const incidentForm = document.getElementById("incidentForm");
const incidentTable = document.getElementById("incidentTable");


/* Open Incident Modal */

newIncidentBtn.addEventListener("click", function () {
    incidentModal.classList.add("show");
});


/* Close Incident Modal */

closeIncidentBtn.addEventListener("click", function () {
    incidentModal.classList.remove("show");
});


cancelIncidentBtn.addEventListener("click", function () {
    incidentModal.classList.remove("show");
    incidentForm.reset();
});


/* Submit New Incident */

incidentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    /* Get form values */

    const incidentId =
        document.getElementById("incidentId").value.trim();

    const incidentLocation =
        document.getElementById("incidentLocation").value.trim();

    const emergencyType =
        document.getElementById("emergencyType").value;

    const affectedPeople =
        document.getElementById("affectedPeople").value;

    const severity =
        document.getElementById("severity").value;

    const assignedUnit =
        document.getElementById("assignedUnit").value;

    const incidentStatus =
        document.getElementById("incidentStatus").value;


    /* Determine badge style */

    let severityClass = "";

    if (severity === "Critical") {
        severityClass = "critical";
    }
    else if (severity === "High") {
        severityClass = "danger";
    }
    else if (severity === "Medium") {
        severityClass = "warning";
    }
    else {
        severityClass = "success";
    }


    /* Create new table row */

    const tableBody = incidentTable.querySelector("tbody");

    const newRow = document.createElement("tr");


    newRow.innerHTML = `
        <td>${incidentId}</td>
        <td>${incidentLocation}</td>
        <td>${emergencyType}</td>
        <td>${affectedPeople}</td>

        <td>
            <span class="badge ${severityClass}">
                ${severity}
            </span>
        </td>

        <td>${assignedUnit}</td>

        <td>${incidentStatus}</td>

        <td>
            <button
                class="table-btn"
                type="button"
                onclick="updateIncident(this)">
                Update
            </button>
        </td>
    `;


    /* Add row to table */

    tableBody.appendChild(newRow);


    /* Close modal */

    incidentModal.classList.remove("show");


    /* Clear form */

    incidentForm.reset();


    /* Confirmation */

    alert("Incident successfully added to the Incident Log.");

});



/* =========================================================
   UPDATE INCIDENT BUTTON
   ========================================================= */

function updateIncident(button) {

    const row = button.closest("tr");

    const incidentId = row.cells[0].textContent;

    alert(
        "Update function selected for Incident " +
        incidentId +
        "."
    );

}



/* =========================================================
   ADD EVACUATION FACILITY
   ========================================================= */

const addFacilityBtn =
    document.getElementById("addFacilityBtn");

const facilityModal =
    document.getElementById("facilityModal");

const closeFacilityBtn =
    document.getElementById("closeFacilityBtn");

const cancelFacilityBtn =
    document.getElementById("cancelFacilityBtn");

const facilityForm =
    document.getElementById("facilityForm");

const facilityTableBody =
    document.getElementById("facilityTableBody");


/* Open Facility Modal */

addFacilityBtn.addEventListener("click", function () {

    facilityModal.classList.add("show");

});


/* Close Facility Modal */

closeFacilityBtn.addEventListener("click", function () {

    facilityModal.classList.remove("show");

});


cancelFacilityBtn.addEventListener("click", function () {

    facilityModal.classList.remove("show");

    facilityForm.reset();

});



/* Submit New Facility */

facilityForm.addEventListener("submit", function (event) {

    event.preventDefault();


    /* Get form values */

    const centerId =
        document.getElementById("centerId").value.trim();

    const facilityName =
        document.getElementById("facilityName").value.trim();

    const facilityBarangay =
        document.getElementById("facilityBarangay").value.trim();

    const capacity =
        Number(
            document.getElementById("facilityCapacity").value
        );

    const occupants =
        Number(
            document.getElementById("facilityOccupants").value
        );

    const medicalStaff =
        document.getElementById("medicalStaff").value.trim();


    /* Calculate occupancy */

    const occupancyPercentage =
        Math.round((occupants / capacity) * 100);


    /* Determine occupancy status */

    let occupancyText = "";
    let occupancyClass = "";


    if (occupancyPercentage >= 90) {

        occupancyText =
            occupancyPercentage + "% Full";

        occupancyClass =
            "danger";

    }

    else if (occupancyPercentage >= 60) {

        occupancyText =
            occupancyPercentage + "% Moderate";

        occupancyClass =
            "warning";

    }

    else {

        occupancyText =
            occupancyPercentage + "% Available";

        occupancyClass =
            "success";

    }


    /* Create new facility row */

    const newRow =
        document.createElement("tr");


    newRow.innerHTML = `

        <td>${centerId}</td>

        <td>${facilityName}</td>

        <td>${facilityBarangay}</td>

        <td>${capacity}</td>

        <td>${occupants}</td>

        <td>${medicalStaff}</td>

        <td>
            <span class="badge ${occupancyClass}">
                ${occupancyText}
            </span>
        </td>

    `;


    /* Add row */

    facilityTableBody.appendChild(newRow);


    /* Close modal */

    facilityModal.classList.remove("show");


    /* Clear form */

    facilityForm.reset();


    /* Confirmation */

    alert(
        "Evacuation facility successfully added."
    );

});



/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

window.addEventListener("click", function (event) {

    if (event.target === incidentModal) {

        incidentModal.classList.remove("show");

        incidentForm.reset();

    }


    if (event.target === facilityModal) {

        facilityModal.classList.remove("show");

        facilityForm.reset();

    }

});



/* =========================================================
   SIDEBAR NAVIGATION ACTIVE STATE
   ========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {

            nav.classList.remove("active");

        });

        item.classList.add("active");

    });

});