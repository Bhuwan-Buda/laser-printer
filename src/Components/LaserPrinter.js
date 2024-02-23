import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal/Modal";
import { FaEdit, FaPrint, FaTrash } from "react-icons/fa";
import { CiImageOn, CiText } from "react-icons/ci";
import { FiRefreshCw } from "react-icons/fi";
import { Stage, Layer, Text, Image } from "react-konva";

const LaserPrinter = () => {
  const [print, setPrint] = useState(false);

  const [textInformation, setTextInformation] = useState({
    text: "",
    fontSize: 32,
    x: 100,
    y: 10,
  });
  const [imageInformation, setImageInformation] = useState({
    image: "",
    width: 100,
    height: 100,
    x: 100,
    y: 10,
  });
  const [textDetails, setTextDetails] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  function pixelsToMillimeters(pixels, dpi = 96) {
    // 1 inch = 25.4 mm
    const inches = pixels / dpi;
    const millimeters = inches * 25.4;
    return millimeters;
  }
  useEffect(() => {
    if (print && (imageDetails?.length > 0 || textDetails?.length > 0)) {
      const unit = "mm";
      const format = [482.6, 44.45];
      const orientation = "landscape";
      const doc = new jsPDF(orientation, unit, format);
      if (textDetails?.length > 0) {
        for (let i = 0; i < textDetails?.length; i++) {
          const updatedLeft = pixelsToMillimeters(Number(textDetails[i].x));
          const updatedTop = pixelsToMillimeters(Number(textDetails[i].y));
          doc.setFontSize(textDetails[i].fontSize);
          doc.text(
            textDetails[i].text,
            Number(updatedLeft),
            Number(updatedTop)
          );
        }
      }
      if (imageDetails?.length > 0) {
        for (let i = 0; i < imageDetails?.length; i++) {
          const updatedLeft = pixelsToMillimeters(Number(imageDetails[i].x));
          const updatedTop = pixelsToMillimeters(Number(imageDetails[i].y));
          const updatedWidth = pixelsToMillimeters(
            Number(imageDetails[i].width)
          );
          const updatedHeight = pixelsToMillimeters(
            Number(imageDetails[i].height)
          );
          doc.addImage(
            imageDetails[i].image,
            "*",
            Number(updatedLeft),
            Number(updatedTop),
            Number(updatedWidth),
            Number(updatedHeight)
          );
        }
      }
      doc.setProperties({
        title: "Laser Printer",
      });
      doc.autoPrint();
      window.open(URL.createObjectURL(doc.output("blob")), "_blank");
      setPrint(false);
    }
  }, [textDetails, imageDetails, print, setPrint]);

  const handleSaveText = () => {
    if (textInformation?.text !== "") {
      const updatedInputData = {
        ...textInformation,
        text: textInformation?.text,
        fontSize: textInformation?.fontSize,
        unique: uuidv4(),
      };
      setTextDetails([...textDetails, updatedInputData]);
      setTextInformation({
        text: "",
        fontSize: 32,
        x: 100,
        y: 20,
      });
      setShowTextModal(false);
    }
  };

  const handleSaveImage = () => {
    if (imageInformation?.image) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageDataUrl = e.target.result;

        const updatedImageData = {
          ...imageInformation,
          image: imageDataUrl,
          width: imageInformation?.width,
          height: imageInformation?.height,
          unique: uuidv4(),
        };

        setImageDetails([...imageDetails, updatedImageData]);

        document.getElementById("image").value = "";
        setImageInformation({
          image: "",
          width: 100,
          height: 100,
          x: 100,
          y: 10,
        });
        setShowImageModal(false);
      };

      reader.readAsDataURL(imageInformation?.image);
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

  const handleEditText = (unique) => {
    const specificTextInformation = textDetails?.find(
      (detail) => detail.unique === unique
    );
    const filteredTextDetails = textDetails?.filter(
      (detail) => detail.unique !== unique
    );
    setTextInformation(specificTextInformation);
    setTextDetails(filteredTextDetails);
    setShowTextModal(true);
  };

  const handleEditImage = (unique) => {
    const specificImageInformation = imageDetails?.find(
      (detail) => detail.unique === unique
    );
    const filteredImageDetails = imageDetails?.filter(
      (detail) => detail.unique !== unique
    );
    setImageInformation({
      ...specificImageInformation,
      image: base64ToFile(specificImageInformation?.image),
    });
    setImageDetails(filteredImageDetails);
    setShowImageModal(true);
  };

  const base64ToFile = (base64String) => {
    const dataTypeMatch = base64String.match(/^data:([a-zA-Z]+\/[a-zA-Z]+);/);
    const dataType = dataTypeMatch
      ? dataTypeMatch[1]
      : "application/octet-stream";
    const timestamp = new Date().getTime();
    const fileName = `image_${timestamp}`;
    const binaryString = window.atob(base64String.split(",")[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: dataType });
    const file = new File([blob], fileName, { type: dataType });
    return file;
  };

  const disablePrint = () => {
    if (textDetails?.length === 0 && imageDetails?.length === 0) {
      return true;
    } else {
      if (textDetails?.length > 0 || imageDetails?.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-2">
        <div
          className="border border-2 rounded-2 border-black panel-container"
          style={{ width: "1824px", height: "168px" }}
        >
          <Stage width={1824} height={168} className="w-auto">
            <Layer>
              {textDetails?.length > 0 &&
                textDetails?.map((detail, i) => {
                  return (
                    <Text
                      id={detail.unique}
                      key={detail.unique}
                      text={detail.text}
                      x={detail.x}
                      y={detail.y}
                      fontSize={detail.fontSize}
                      draggable
                      fill="white"
                      onDragEnd={(e) => {
                        const newX = e.target.x();
                        const newY = e.target.y();

                        // Ensure the new position is within the stage boundaries
                        const updatedX = Math.max(
                          0,
                          Math.min(newX, 1824 - e.target.width())
                        );
                        const updatedY = Math.max(
                          0,
                          Math.min(newY, 168 - e.target.height())
                        );

                        const filteredTextDetail = textDetails?.filter(
                          (text) => text.unique !== detail.unique
                        );

                        const updatedDetail = {
                          ...detail,
                          isDragging: false,
                          x: updatedX,
                          y: updatedY,
                        };

                        setTextDetails([updatedDetail, ...filteredTextDetail]);
                      }}
                    />
                  );
                })}
              {imageDetails?.length > 0 &&
                imageDetails?.map((detail, i) => {
                  let image = new window.Image();
                  image.src = detail.image;
                  return (
                    <Image
                      id={detail.unique}
                      key={detail.unique}
                      x={detail.x}
                      y={detail.y}
                      width={detail.width}
                      height={detail.height}
                      image={image}
                      draggable
                      onDragEnd={(e) => {
                        const newX = e.target.x();
                        const newY = e.target.y();

                        // Ensure the new position is within the stage boundaries
                        const updatedX = Math.max(
                          0,
                          Math.min(newX, 1824 - e.target.width())
                        );
                        const updatedY = Math.max(
                          0,
                          Math.min(newY, 168 - e.target.height())
                        );

                        const filteredImageDetail = imageDetails?.filter(
                          (image) => image.unique !== detail.unique
                        );

                        const updatedDetail = {
                          ...detail,
                          isDragging: false,
                          x: updatedX,
                          y: updatedY,
                        };

                        setImageDetails([
                          updatedDetail,
                          ...filteredImageDetail,
                        ]);
                      }}
                    />
                  );
                })}
            </Layer>
          </Stage>
        </div>
      </div>
      <div className="d-flex p-0 flex-column justify-content-start align-items-center">
        <div className="d-flex justify-content-center gap-4 w-100 mt-4">
          <div
            className="text-details border border-success border-2 rounded-1"
            style={{ width: "40%", height: "fit-content" }}
          >
            <h4 className="text-center bg-success text-white p-2">
              Text Records
            </h4>
            {textDetails?.length > 0 ? (
              <div className="p-2 h-auto">
                <table className="table text-center table-bordered border-success">
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
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEditText(unique)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveText(unique)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-danger">No records.</p>
            )}
          </div>
          <div
            className="image-details border border-success border-2 rounded-1"
            style={{ width: "40%", height: "fit-content" }}
          >
            <h4 className="text-center bg-success text-white p-2">
              Image Records
            </h4>
            {imageDetails?.length > 0 ? (
              <div className="p-2 h-auto">
                <table className="table text-center table-bordered border-success">
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
                        return (
                          <tr key={unique}>
                            <td className="fw-bold">{i + 1}</td>
                            <td>
                              <img
                                src={image}
                                width={40}
                                height={30}
                                alt="random"
                              />
                            </td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEditImage(unique)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveImage(unique)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-danger">No records.</p>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100 gap-4 mt-4">
          <button
            type="button"
            className="btn btn-success btn-md"
            onClick={() => setShowTextModal(true)}
          >
            <CiText /> Add Text
          </button>
          <button
            type="button"
            className="btn btn-success btn-md"
            onClick={() => setShowImageModal(true)}
          >
            <CiImageOn /> Add Image
          </button>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            disabled={disablePrint()}
            onClick={() => setPrint(true)}
          >
            <FaPrint /> Print
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm "
            onClick={() => {
              setImageDetails([]);
              setTextDetails([]);
              setPrint(false);
            }}
          >
            <FiRefreshCw /> Reset PDF
          </button>
        </div>
      </div>
      {showTextModal && (
        <Modal
          showModal={showTextModal}
          setShowModal={setShowTextModal}
          header={"Text Modal"}
        >
          <div className="card d-flex flex-column align-items-between p-4 w-100">
            <div className="mb-2">
              <label htmlFor="text" className="fw-bold">
                Text
              </label>
              <input
                type="text"
                id="text"
                required
                value={textInformation?.text}
                onChange={(e) =>
                  setTextInformation({
                    ...textInformation,
                    text: e.target.value.trimStart(),
                  })
                }
                placeholder="Enter your text..."
                className="form-control"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="font-size" className="fw-bold">
                Font Size (px)
              </label>
              <input
                type="number"
                id="font-size"
                required
                value={textInformation?.fontSize}
                onChange={(e) =>
                  setTextInformation({
                    ...textInformation,
                    fontSize: e.target.value.trimStart(),
                  })
                }
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
        </Modal>
      )}
      {showImageModal && (
        <Modal
          showModal={showImageModal}
          setShowModal={setShowImageModal}
          header={"Image Modal"}
        >
          <div className="card d-flex flex-column align-items-between p-4 w-100">
            <div className="mb-2">
              <label htmlFor="image" className="fw-bold">
                Image
              </label>
              <input
                type="file"
                id="image"
                required
                className="form-control"
                onChange={(e) =>
                  setImageInformation({
                    ...imageInformation,
                    image: e.target.files[0] || imageInformation.image,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="image-width" className="fw-bold">
                Image Width (mm)
              </label>
              <input
                type="number"
                id="image-width"
                required
                value={imageInformation?.width}
                onChange={(e) =>
                  setImageInformation({
                    ...imageInformation,
                    width: e.target.value.trimStart(),
                  })
                }
                placeholder="Image Width"
                className="form-control"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="image-height" className="fw-bold">
                Image Height (mm)
              </label>
              <input
                type="number"
                id="image-height"
                required
                value={imageInformation?.height}
                onChange={(e) =>
                  setImageInformation({
                    ...imageInformation,
                    height: e.target.value.trimStart(),
                  })
                }
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
        </Modal>
      )}
    </>
  );
};

export default LaserPrinter;
