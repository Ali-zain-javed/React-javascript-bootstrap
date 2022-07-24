import React from 'react'
export const download = function (data) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", "download.csv");

  // Performing a download with click
  a.click();
};

export const csvmaker = function (data) {
  if (data && data.length > 0) {
    // Empty array for storing the values
    let csvRows = [];
    // Headers is basically a keys of an
    // object which is id, name, and
    // profession

    // As for making csv format, headers
    // must be separated by comma and
    // pushing it into array

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (let i = 0; i < data.length; i++) {
      // Pushing Object values into array
      // with comma separation
      const values = Object.values(data[i]).join(",");
      csvRows.push(values);
    }
    // Returning the array joining with new line
    return csvRows.join("\n");
  }
  return [];
};


