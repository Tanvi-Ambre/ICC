import React, { useEffect, useRef, useState  } from "react";
import { toast } from "react-toastify";
import Canvas from "./Canvas";


const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const [color, setColor] = useState("#000000");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [tool, setTool] = useState("pencil");

    useEffect(() => {
        socket.on("message", (data) => {
            toast.info(data.message);
        });
    }, []);
    useEffect(() => {
        socket.on("users", (data) => {
            setUsers(data);
            setUserNo(data.length);
        });
    }, []);
    useEffect(() => {
        socket.on("canvasImage", (data) => {
            imgRef.current.src = data;
        });
    }, []);
    return (
        <div className="container-fluid">
            <div className="row pb-2">
                <h1 className="display-5 pt-4 pb-3 text-center">
                    React Drawing App - users online:{userNo}
                </h1>
            </div>
            <div className="row mt-5">
                <div
                    className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
          mt-3"
                    style={{ height: "500px" }}
                >
                    <img className="w-100 h-100" ref={imgRef} src="" alt="image" />
                </div>
            </div>
        </div>
    )

    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("drawing", canvasImage);
 [elements];


    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setElements([]);
    };

    const undo = () => {
        setHistory((prevHistory) => [
            ...prevHistory,
            elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
            prevElements.filter((ele, index) => index !== elements.length - 1)
        );
    };
    const redo = () => {
        setElements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]);
        setHistory((prevHistory) =>
            prevHistory.filter((ele, index) => index !== history.length - 1)
        );
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="display-5 pt-4 pb-3 text-center">
                    React Drawing App - users online:{userNo}
                </h1>
            </div>
            <div className="row justify-content-center align-items-center text-center py-2">
                <div className="col-md-2">
                    <div className="color-picker d-flex align-items-center justify-content-center">
                        Color Picker : &nbsp;
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tools"
                            id="pencil"
                            value="pencil"
                            checked={tool === "pencil"}
                            onClick={(e) => setTool(e.target.value)}
                            readOnly={true}
                        />
                        <label className="form-check-label" htmlFor="pencil">
                            Pencil
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tools"
                            id="line"
                            value="line"
                            checked={tool === "line"}
                            onClick={(e) => setTool(e.target.value)}
                            readOnly={true}
                        />
                        <label className="form-check-label" htmlFor="line">
                            Line
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tools"
                            id="rect"
                            value="rect"
                            checked={tool === "rect"}
                            onClick={(e) => setTool(e.target.value)}
                            readOnly={true}
                        />
                        <label className="form-check-label" htmlFor="rect">
                            Rectangle
                        </label>
                    </div>
                </div>

                <div className="col-md-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        disabled={elements.length === 0}
                        onClick={() => undo()}
                    >
                        Undo
                    </button>
                    &nbsp;&nbsp;
                    <button
                        type="button"
                        className="btn btn-outline-primary ml-1"
                        disabled={history.length < 1}
                        onClick={() => redo()}
                    >
                        Redo
                    </button>
                </div>
                <div className="col-md-1">
                    <div className="color-picker d-flex align-items-center justify-content-center">
                        <input
                            type="button"
                            className="btn btn-danger"
                            value="clear canvas"
                            onClick={clearCanvas}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <Canvas
                    canvasRef={canvasRef}
                    ctx={ctx}
                    color={color}
                    setElements={setElements}
                    elements={elements}
                    tool={tool}
                    socket={socket}
                />
            </div>
        </div>
        )
        
    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div
            className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
            style={{ height: "500px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <canvas ref={canvasRef} />
        </div>
        )
};

export default ClientRoom;
