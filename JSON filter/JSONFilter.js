// Reads the selected JSON file and displays its data on the webpage
function readJSON(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const json = JSON.parse(e.target.result);
                const filterInput = document.getElementById('filterInput').value;
                const filteredJSON = filterJSON(json, filterInput);
                const jsonString = JSON.stringify(filteredJSON, null, 2);
                saveJSON(jsonString);
            } catch {
                alert('Error: Invalid JSON file');
            }
        }
        reader.readAsText(input.files[0]);
    }
}

// Filters the JSON data using the filter input
function filterJSON(json, filterInput) {
    try {
        const regex = new RegExp(filterInput);
        return json.filter(function (item) {
            for (var key in item) {
                if (regex.test(item[key])) {
                    return true;
                }
            }
            return false;
        });
    } catch (error) {
        return json.filter(function (item) {
            for (var key in item) {
                if (item[key].includes(filterInput)) {
                    return true;
                }
            }
            return false;
        });
    }
}

// Saves the JSON data as a new file
function saveJSON(json) {
    const jsonBlob = new Blob([json], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.style.display = 'none';
    jsonLink.href = jsonUrl;
    jsonLink.download = 'filtered.json';
    jsonLink.click();
    document.body.removeChild(jsonLink);

    var docDefinition = {
        content: [
            JSON.parse(json).map(function (item) {
                return { text: item.body, linebreak: true }
            })
        ]
    };

    pdfMake.createPdf(docDefinition).download("filtered.pdf");
}