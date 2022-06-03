import FS from "@isomorphic-git/lightning-fs"
import Button from '@mui/material/Button'
import git from "isomorphic-git"
import http from "isomorphic-git/http/web"
import { useEffect } from 'react'
import oldImages from "../images.json"


const fs = new FS("fs", { wipe: true });
const pfs = fs.promises;
const dir = "/";
const fileName = "images.json";

window.global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;

const ImageContainer = () => {
    
    const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA0CAIAAACSFii2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAC6SURBVGhD7dOxDQMhDEZhSsbIeJRswRiMwWiUBB3WKVKKg3R++V/pik/YYfxZAtMTmJ7AX7XWXle1Vht57hk8qeEqxggwP4NLKQs8m2abum3rhj/NNnLbLmD+7QJPvI18tgvOOS+w90veBffe7092fckHN8m45LOnGzcEv1t9BgZs9Rn43uqUko285fgaf0tgegLTE5iewPQEpicwPYHpCUxPYHoC0xOYnsD0BKYnMD2B6QlMT2B2Y7wBN1obcIglYkUAAAAASUVORK5CYII="

    useEffect(() => {
        git
          .clone({
            fs,
            http,
            dir,
            corsProxy: "https://cors.isomorphic-git.org",
            url: "PAT",
            singleBranch: true,
            depth: 1,
          })
          .then(() => console.log("cloned successfully"));
      }, []);

      const onSubmit= async () => {

        await git.addRemote({
          fs,
          dir: '/',
          remote: 'upstream',
          url: 'PAT'
        })
        console.log('done')

        //git remote add origin https://github.com/swxk19/readme-editor-db.git
        await pfs.writeFile(
          `${dir}${fileName}`,
          JSON.stringify([image, ...oldImages], null, 2),
          "utf8"
        );

        await git.add({ fs, dir, filepath: fileName });
        const status = await git.status({
          fs,
          dir,
          filepath: fileName,
        });
        console.log("file status: ", status);
        await git.commit({
          fs,
          dir,
          message: `test`,
          author: {
            name: "Admin",
            email: "Admin@kelvin.com",
          },
        });
        await git.push({
          fs,
          http,
          dir,
          remote: "origin",
          // onAuth: () => ({
          //   username: "swxk19",
          //   password: 
          
          // }),
          force: true,
        });
        alert(
          "Pushed successfully!"
        );
      }

  return (
    <div>
      <Button variant = 'contained' onClick = {onSubmit}>Upload Image </Button>
    </div>
  )
}

export default ImageContainer