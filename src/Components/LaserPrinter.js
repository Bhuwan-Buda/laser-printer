import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";

const LaserPrinter = () => {
  const [url, setUrl] = useState("");
  const [print, setPrint] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textTop, setTextTop] = useState(0);
  const [textLeft, setTextLeft] = useState(0);
  const [textFontSize, setTextFontSize] = useState(10);
  const [imageInput, setImageInput] = useState("");
  const [imageTop, setImageTop] = useState(0);
  const [imageLeft, setImageLeft] = useState(0);
  const [imageWidth, setImageWidth] = useState(5);
  const [imageHeight, setImageHeight] = useState(5);
  const [textDetails, setTextDetails] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);

  useEffect(() => {
    const unit = "mm";
    const format = [150, 50];
    const orientation = "landscape";
    const doc = new jsPDF(orientation, unit, format);
    if (textDetails?.length > 0) {
      for (let i = 0; i < textDetails?.length; i++) {
        doc.setFontSize(textDetails[i].fontSize);
        doc.text(textDetails[i].text, textDetails[i].left, textDetails[i].top);
      }
    }
    if (imageDetails?.length > 0) {
      for (let i = 0; i < imageDetails?.length; i++) {
        doc.addImage(
          imageDetails[i].image,
          "JPG",
          Number(imageDetails[i].left),
          Number(imageDetails[i].top),
          Number(imageDetails[i].width),
          Number(imageDetails[i].height)
        );
      }
    }
    doc.setProperties({
      title: "Laser Printer",
    });
    setUrl(doc.output("datauristring"));
    if (print && imageDetails?.length > 0 && textDetails?.length > 0) {
      doc.save("Laser-Printer.pdf");
      setImageDetails([]);
      setTextDetails([]);
      setPrint(false);
    }
  }, [textDetails, imageDetails, print, setPrint]);

  const handleSaveText = () => {
    if (textInput !== "") {
      const updatedInputData = {
        text: textInput,
        top: textTop,
        left: textLeft,
        fontSize: textFontSize,
        unique: uuidv4(),
      };
      setTextDetails([...textDetails, updatedInputData]);
      setTextInput("");
      setTextTop(0);
      setTextLeft(0);
      setTextFontSize(10);
    }
  };
  const handleSaveImage = () => {
    if (imageInput) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageDataUrl = e.target.result;

        const updatedImageData = {
          image: imageDataUrl,
          top: imageTop,
          left: imageLeft,
          width: imageWidth,
          height: imageHeight,
          unique: uuidv4(),
        };

        setImageDetails([...imageDetails, updatedImageData]);

        document.getElementById("image").value = "";
        setImageInput("");
        setImageTop(0);
        setImageLeft(0);
        setImageWidth(5);
        setImageHeight(5);
      };

      reader.readAsDataURL(imageInput);
    }
  };

  const handleRemoveText = (unique) => {
    const updated = textDetails?.filter((detail) => detail.unique !== unique);
    setTextDetails(updated);
  };
  const handleRemoveImage = (unique) => {
    const updated = imageDetails?.filter((detail) => detail.unique !== unique);
    setImageDetails(updated);
  };

  return (
    <div className="d-flex flex-column justify-content-start align-items-center">
      <div className="row w-100">
        <div className="col-8">
          <iframe
            type="application/pdf"
            width="100%"
            src={url}
            height="260px"
          ></iframe>
        </div>
        <div className="col-4 d-flex justify-content-between">
          <div className="text-details">
            <h4>Text Details</h4>
            {textDetails?.length > 0 ? (
              <>
                <table className="table text-center table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">S.N.</th>
                      <th scope="col">Text</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {textDetails?.length > 0 &&
                      textDetails.map((detail, i) => {
                        const { text, unique } = detail;
                        return (
                          <tr key={unique}>
                            <td className="fw-bold">{i + 1}</td>
                            <td>{text}</td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveText(unique)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <i>No records.</i>
            )}
          </div>
          <div className="image-details">
            <h4>Image Details</h4>
            {imageDetails?.length > 0 ? (
              <>
                <table className="table text-center table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">S.N.</th>
                      <th scope="col">Image</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imageDetails?.length > 0 &&
                      imageDetails.map((detail, i) => {
                        const { image, unique } = detail;
                        console.log(image, "image");
                        return (
                          <tr key={unique}>
                            <td className="fw-bold">{i + 1}</td>
                            <td>{image?.name}</td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveImage(unique)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <i>No records.</i>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-around align-items-start w-75 mt-4 gap-4">
        <div className="card d-flex flex-column align-items-between p-4 w-50">
          <div className="mb-2">
            <label htmlFor="text" className="fw-bold">
              Text
            </label>
            <input
              type="text"
              id="text"
              required
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.trimStart())}
              placeholder="Enter your text..."
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="top" className="fw-bold">
              Top
            </label>
            <input
              type="number"
              id="top"
              required
              value={textTop}
              onChange={(e) => setTextTop(e.target.value.trimStart())}
              placeholder="Top position"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="left" className="fw-bold">
              Left
            </label>
            <input
              type="number"
              id="left"
              required
              value={textLeft}
              onChange={(e) => setTextLeft(e.target.value.trimStart())}
              placeholder="Left position"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="font-size" className="fw-bold">
              Font Size
            </label>
            <input
              type="number"
              id="font-size"
              required
              value={textFontSize}
              onChange={(e) => setTextFontSize(e.target.value.trimStart())}
              placeholder="Font Size"
              className="form-control"
            />
          </div>
          <button
            type="button"
            className="btn btn-md btn-success"
            onClick={handleSaveText}
          >
            Save
          </button>
        </div>
        <div className="card d-flex flex-column align-items-between p-4 w-50">
          <div className="mb-2">
            <label htmlFor="image" className="fw-bold">
              Image
            </label>
            <input
              type="file"
              id="image"
              required
              className="form-control"
              onChange={(e) => setImageInput(e.target.files[0])}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="image-top" className="fw-bold">
              Image Top
            </label>
            <input
              type="number"
              id="image-top"
              required
              value={imageTop}
              onChange={(e) => setImageTop(e.target.value.trimStart())}
              placeholder="Top position"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="image-left" className="fw-bold">
              Image Left
            </label>
            <input
              type="number"
              id="image-left"
              required
              value={imageLeft}
              onChange={(e) => setImageLeft(e.target.value.trimStart())}
              placeholder="Left position"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="image-width" className="fw-bold">
              Image Width
            </label>
            <input
              type="number"
              id="image-width"
              required
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value.trimStart())}
              placeholder="Image Width"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="image-height" className="fw-bold">
              Image Height
            </label>
            <input
              type="number"
              id="image-height"
              required
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value.trimStart())}
              placeholder="Image Height"
              className="form-control"
            />
          </div>
          <button
            type="button"
            className="btn btn-md btn-success"
            onClick={handleSaveImage}
          >
            Save
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={() => setPrint(true)}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default LaserPrinter;
