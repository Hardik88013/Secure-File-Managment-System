let fileArray = []; // Array to hold encrypted file objects

function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const uploadPassword = document.getElementById('uploadPassword');
    const fileList = document.getElementById('fileList');

    // Get the selected files
    const files = fileInput.files;
    const password = uploadPassword.value;

    if (!password) {
        alert("Please set a password for the file.");
        return;
    }

    // Loop through the files and encrypt them
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileData = event.target.result;
            const encryptedData = CryptoJS.AES.encrypt(fileData, password).toString();
            fileArray.push({ name: file.name, size: file.size, data: encryptedData, password: password });
            displayFiles();
        };

        reader.readAsBinaryString(file);
    }

    // Clear the file input and password
    fileInput.value = '';
    uploadPassword.value = '';
}

function displayFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear previous list

    // Loop through the fileArray and create a list item for each file
    fileArray.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = `File Name: ${file.name}, Size: ${file.size} bytes`;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFile(index);

        // Create a decrypt button
        const decryptButton = document.createElement('button');
        decryptButton.className = 'decrypt-button';
        decryptButton.textContent = 'Decrypt';
        decryptButton.onclick = () => promptForPassword(index);

        // Append buttons to the file item
        fileItem.appendChild(decryptButton);
        fileItem.appendChild(deleteButton);
        fileList.appendChild(fileItem);
    });
}

function deleteFile(index) {
    fileArray.splice(index, 1); // Remove the file from the array
    displayFiles(); // Refresh the file list
}

function promptForPassword(index) {
    const password = prompt("Enter the password to decrypt the file:");
    if (password) {
        decryptFile(index, password);
    }
}

function decryptFile(index, password) {
    const file = fileArray[index];
    const decryptedData = CryptoJS.AES.decrypt(file.data, password);
    const originalData = decryptedData.toString(CryptoJS.enc.Utf8);

    if (originalData) {
        alert(`Decrypted Data: ${originalData}`);
    } else {
        alert('Decryption failed. Please check your password.');
    }
}