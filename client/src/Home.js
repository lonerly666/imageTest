import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
export default function Home() {
  useEffect(() => {
    const ac = new AbortController();
    getImage();
    return () => {
      ac.abort();
    };
  }, []);
  const [percent, setPercent] = useState(0);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [files, setFiles] = useState([]);
  async function getImage() {
    await axios
      .get("/file/abc", {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPercent(percentage);
          if (percentage === 100) {
            setTimeout(() => {
              setLoading(false);
            }, 400);
          }
          // const current = progressEvent.currentTarget.response.length;

          // let percentCompleted = Math.floor((current / total) * 100);
          // console.log("completed: ", percentCompleted);
        },
      })
      .then((res) => {
        let blob = new Blob([res.data], { type: res.headers["content-type"] });
        let imgUrl = URL.createObjectURL(blob);
        setUrl(imgUrl);
      });
  }
  async function upload(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.set("height", height);
    formdata.set("width", width);
    formdata.set("id", "abc");
    files.forEach((file) => {
      formdata.append("uploaded", file);
    });
    await axios
      .post("/upload", formdata)
      .then((res) => res.data)
      .catch((err) => console.log(err))
      .then((res) => {
        console.log(res);
      });
  }
  function showDetails(e) {
    console.log(e.target.files);
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 20;
      const scaleSize = MAX_WIDTH / img.width;
      const MAX_HEIGHT = img.height * scaleSize;
      const canvas = document.createElement("canvas");
      canvas.height = MAX_HEIGHT;
      canvas.width = MAX_WIDTH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const url = ctx.canvas.toDataURL(img, "image/png");
      const preview = document.getElementById("resize");
      ctx.canvas.toBlob((blob) => {
        const fr = new FileReader();
        fr.readAsArrayBuffer(blob);
        fr.onload=(t)=>{
            const res = t.target.result;
            const temp = new File([res],"resize");
            console.log(res);
            setFiles([e.target.files[0], temp]);
        }
        preview.src = URL.createObjectURL(blob);
      });
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  }
  return (
    <div>
      <div className="loading-div" style={{ width: "500px", height: "700px" }}>
        {loading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress variant="determinate" value={percent} />
          </div>
        ) : (
          <img src={url} />
        )}
      </div>
      <img id="resize" />
      <form onSubmit={upload} onChange={showDetails}>
        <input type="file" name="test" accept="image/*" />
        <input type="submit" />
      </form>
    </div>
  );
}
