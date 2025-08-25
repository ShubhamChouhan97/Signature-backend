import fs from "fs-extra";

fs.ensureDirSync('./public/frontend-build');

fs.cp('./Signature-frontend/dist', './public/frontend-build', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Files copied successfully!');
});