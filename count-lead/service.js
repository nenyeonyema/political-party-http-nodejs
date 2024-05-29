const filepaths = require('./filepath');


class PoliticalParties {
    // Handles requests
    createParty(file_name, content) {
        let validnumparty = filepaths.validateNumParty();
        let partyfilename = filepaths.partyFileName(file_name);
        console.log(partyfilename);
        if(validnumparty) {
            // let validFiles = readDirectory();
            filepaths.writeToFile(partyfilename, content);
            console.log("Party Created")
            return "Party Created Successfully";
        }
        else {
            return "Maximum Number of party reached";
        }
    }

    readAllParties(){
        const validatepartyExist = filepaths.validatePartyExist()
        if (validatepartyExist) {
            const fileContent = filepaths.readFilePath();
            return fileContent;
        }
        else {
            return "Party does not exist";
        }
        
    }
    readoneParty(partyName) {
        let filename = `${partyName}.json`;

        let partyUpper = partyName.toUpperCase();
        let validateIfPartyExist = filepaths.validatefilepath(filename);

        if (validateIfPartyExist) {
            const filesContent = filepaths.readFilePath();
            let partyContent = []

            for (let i = 0; i < filesContent.length; i++) {

                if (filesContent[i].party_name === partyUpper){
                    partyContent.push(filesContent[i]);
                    console.log(partyContent);
                    return partyContent;
                }
            }
        }
        else {
            // return {[partyName]: "Does not exist"};
            return "Party does not exist";
        }

    }
    deleteoneParty(partyName) {
        let file_name = `${partyName}.json`;
        let valid_name = filepaths.validatefilepath(file_name);
        if (valid_name) {
            filepaths.deletePartyFile(file_name);
            return "Party deleted successfully"
        }
        else {
            return "Party does not exist"
        }
    }

    updateVoteCount(partyName) {
        let file_name = `${partyName}.json`;
        let valid_name = filepaths.validatefilepath(file_name);
        if (valid_name) {
            filepaths.readWriteFile(file_name);
            return "Voted successfully"
        }
        else {
            return "Party does not exist"
        }
        
    }
    leaderboard() {
        const sortedResult = filepaths.readFilePath();

        for (let i = 0; i < sortedResult.length; i++) {
            for (let j = 0; j < sortedResult.length - 1 - i; j++) {
                if (sortedResult[j].vote_count < sortedResult[j + 1].vote_count) {
                    let temp_object = sortedResult[j + 1];
                    sortedResult[j + 1] = sortedResult[j]; 
                    sortedResult[j] = temp_object;
                }
            }
    
        }
        return sortedResult;
        // sortedResult.sort((a, b) =>  b.vote_count - a.vote_count);
        // return sortedResult;
    }
}

const party = new PoliticalParties();
module.exports = party;

// party.readAllParties();