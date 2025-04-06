function load() {

    var tableHTML = "";

    for (let i = 0; i < phoneIds.length; i++) {
        let phoneId = phoneIds[i];
        let phone = phones[phoneId];
        tableHTML += "<tr>";
        tableHTML += "<td>";
        tableHTML += "<a target='_blank' href='" + phone.href + "'>";
        tableHTML += "<img src='img/" + phone.imgSrc + "' width='350' />";
        tableHTML += "</a>";
        tableHTML += "</td>";
        tableHTML += "<td style='width:100%'>";
        tableHTML += "<table class='price'>";
        tableHTML += "<tr>";
        tableHTML += "<td colspan='2'><h3>" + phone.name + "</h3></td>";
        tableHTML += "</tr>";
        tableHTML += "<tr>";
        tableHTML += "<td>Price</td>";
        tableHTML += "<td><button onClick= 'showPrice(\"" + phone.id + "\")'>Show</button></td>";
        tableHTML += "</tr>";
        tableHTML += "</table>";
        tableHTML += "</td>";
        tableHTML += "</tr>";
    }

    document.getElementById("phone_table").innerHTML = tableHTML;
}

function showPrice(phoneId) {
    let phone = phones[phoneId];
    var modal = document.getElementById("phone_price");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];


    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var iFrame = document.getElementById("phone_details");
    iFrame.src = phone.href + "#top-page-title";

    modal.style.display = "block";
}