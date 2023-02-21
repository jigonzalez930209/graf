import _ from "lodash";
import { read, utils, write } from "xlsx";

import { extractSerialPoint, fileType } from "./common";

const readAllWebProcess = async (
  allFiles: { content: string; name: string }[]
) => {
  let notSupported: string[] = [];
  const results = await Promise.all(
    allFiles
      .filter((file) => {
        if (!["csv", "teq4", "teq4z"].includes(fileType(file.name))) {
          console.log(`File type not supported '${file.name}'`);
          notSupported.push(file.name);
          return false;
        }
        return true;
      })
      .map(async (file, i) => {
        if (fileType(file.name) === "csv") {
          const contentXLSX = read(file.content, { type: "string" });
          const content: string[][] = Object.values(
            utils.sheet_to_json(contentXLSX.Sheets[contentXLSX.SheetNames[0]])
          ).map((i) => Object.values(i));

          const columnsRow: string[] = Object.keys(
            utils.sheet_to_json(
              contentXLSX.Sheets[contentXLSX.SheetNames[0]]
            )[0]
          );
          const invariableContent = [columnsRow, ...content];

          const selectedInvariableContentIndex = invariableContent.reduce(
            (acc, curr, index) =>
              curr.length > acc.value
                ? { value: curr.length, index: index }
                : acc,
            { index: 0, value: content[0].length }
          ).index;

          const columns: string[] = invariableContent[
            selectedInvariableContentIndex
          ] as string[];
          const value = {
            content,
            name: file.name,
            invariableContent,
            selectedInvariableContentIndex,
            columns,
          };
          return value;
        }
        return { content: file.content, name: file.name };
      })
  );

  return { results, notSupported };
};

const readFileContentsUsingJS = async (file) => {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  });
};

const readAllFilesUsingJS = async (AllFiles) => {
  const results = await Promise.all(
    AllFiles.map(async (file) => {
      const fileContents = await readFileContentsUsingJS(file);
      return fileContents;
    })
  );
  return results;
};

const readAllFilesUsingWebProcess = async (files: FileList) => {
  const response = await readAllFilesUsingJS(
    Object.keys(files).map((i) => files[i])
  );
  const readAllFiles = await readAllWebProcess(
    response.map((content, i) => ({ content, name: files[i].name }))
  );
  const ret = {
    contents: await extractSerialPoint(
      (await readAllFiles.results).map((f, i) => ({ ...f, id: i as number }))
    ),
    notSupported: readAllFiles.notSupported,
  };

  return ret;
};

export {
  readAllFilesUsingWebProcess,
  readAllFilesUsingJS,
  readAllWebProcess,
  readFileContentsUsingJS,
};
