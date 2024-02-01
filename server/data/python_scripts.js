import { unlinkSync, rmSync } from "fs";
import { PythonShell } from "python-shell";

const spleeter = async (filePath) => {
  console.log("Spleeter starts");

  const result = new Promise((resolve,reject) =>{
/*
    PythonShell.run("./lib/python_scripts/install_package.py", { args: ["spleeter"] }, (err, results) => {
      console.log("script ran"); //never runs
      if (err)return reject(err);
      console.log("did not error in first script");
      PythonShell.run("./lib/python_scripts/spleeter_stems.py", { args: ["-i", inputFilePath ] }, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
*/
    try {

      PythonShell.run("./lib/python_scripts/install_package.py", { args: ["spleeter"] }).then(messages=>{
        console.log('first script ran');
        console.log("Splitting audio file.");
        const inputFilePath = "./songs/sample_song.mp3";

          // Configure Spleeter options
          const spleeterOptions = {
            args: ["-i", inputFilePath ], //"-o", outputDirectory
          };

          // Split audio into stems and clean up
          PythonShell.run("./lib/python_scripts/spleeter_stems.py", spleeterOptions).then(messages=>{
            console.log("Successfully split track into five stems");
            console.log(messages);
            //unlinkSync(filePath);
            //rmSync("pretrained_models", { recursive: true });
            //console.log(
            //    "Removed pretrained_models directory and local audio file"
            //);
            resolve();
          });
        
      })
      
      
    } catch(e) {
      reject();
    }


  })
  console.log(result.stdout);
 /*PythonShell.run("./lib/python_scripts/install_package.py", { args: ["spleeter"] }).then(messages=>{
    console.log('first script ran');
  }).catch((err) => {
    console.error("Error:", err);
  });*/
 
  /*
  PythonShell.run(
    "./lib/python_scripts/install_package.py",
    { args: ["spleeter"] },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Splitting audio file.");
        //const outputDirectory = "./output_stems/";
        //if (!existsSync(outputDirectory)) {
        //  mkdirSync(outputDirectory, { recursive: true });
        //  console.log("Output directory created:", outputDirectory);
        //}
        const inputFilePath = filePath;

        // Configure Spleeter options
        const spleeterOptions = {
          args: ["-i", inputFilePath ],, //"-o", outputDirectory
        };

        // Split audio into stems and clean up
        PythonShell.run(
          "./lib/python_scripts/spleeter_stems.py",
          spleeterOptions,
          (err) => {
            if (err) {
              throw err;
            } else {
              console.log("Successfully split track into five stems");
              unlinkSync(filePath);
              rmSync("pretrained_models", { recursive: true });
              console.log(
                  "Removed pretrained_models directory and local audio file"
              );
            }
          }
        );
      }
    }
  );*/
};

export default spleeter;