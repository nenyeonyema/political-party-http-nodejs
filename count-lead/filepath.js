const fs = require('fs');
const path = require('path');
const baseDir = path.join(__dirname, '../party');

// console.log(baseDir);
class FilePath{
    // Utilities
    readDirectory() {
        const files = fs.readdirSync(baseDir);
        return files;
    }

    writeToFile(file, content) {
        fs.writeFile(file, content, function(err) {
            if (err) {
                throw err;
            }
            // else{
            //     console.log("Party Created");
            // }
        });
        return;
        // return "Party Created Successfully";
    }

    partyFileName(file) {
        return path.join(baseDir, file);
    }

    readFilePath(){
        // Reads all files
        const allFiles = this.readDirectory();
        let filesContents = [];

        allFiles.forEach(function(file) {
            const filePath = path.join(baseDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            filesContents.push(JSON.parse(fileContent))
        });
        // console.log(filesContents)
        return filesContents
    }

    deletePartyFile(filename) {
        // const files = this.readDirectory();
        const pathfile = this.partyFileName(filename);
        fs.unlink(pathfile, (err) => {
            if (err) {
              throw err;
            }
        });
    }

    readWriteFile(filename) {
        const pathfile = this.partyFileName(filename);
        const readContent = fs.readFileSync(pathfile, 'utf-8');
        const fileObject = JSON.parse(readContent);
        
        fileObject.vote_count += 1;
        const fileString = JSON.stringify(fileObject);
        this.writeToFile(pathfile, fileString);
    }

    // Validations 

    validateNumParty() {
        // Validates if the number of parties are more than 3
        const files = this.readDirectory();
        if (files.length >= 3){
            return false
        }
        return true;
    }

    validatefilepath(file_name) {
        const files = this.readDirectory();
        const valid_name = files.find((filename) => filename === file_name);

        if (!valid_name) {
            return false;
        }
        return true;
    }

    validatePartyExist() {
        // Validates if any party exist
        const files = this.readDirectory();
        if (files.length < 1){
            return false
        }
        return true;
    }
}

const filepaths = new FilePath();
module.exports = filepaths;

// const newfile = new FilePath()
// newfile.readFilePath();