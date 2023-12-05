

export const gatherAllInputStringFromDir = (dir: string): {
    [key: string]: {
        rawString: string,
        lines: string[]
    }
} => {
    const fs = require("fs");
    const path = require("path");
    const inputFolders = fs.readdirSync(dir);
    const inputStringMap: {
        [key: string]: {
            rawString: string,
            lines: string[]
        }
    } = {};

    for (const folder of inputFolders) {
        const inputFiles = fs.readdirSync(path.join(dir, folder));
        for (const file of inputFiles) {
            // name = folder/file
            const fileName = `${folder}/${file.split(".")[0]}`;
            const rawString = fs.readFileSync(path.join(dir, folder, file), "utf-8");
            const lines = rawString.split("\n");
            inputStringMap[fileName] = {
                rawString,
                lines
            };
        }
    }
  
    return inputStringMap;
}

