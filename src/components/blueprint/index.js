import React from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import propTypes from "prop-types";
import Button from "../Button";
import Input from "../InputField";
import "./blueprint.css";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class Blueprint extends React.Component {
  state = {
    add: false,
    confirm: true,
    deleted: false,
    room: { width: "", height: "", roomName: "" },
    shapes: [],
    selectedshapeName: "",
    show: true
  };

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        homeWidth: Number(this.props.location.state.width),
        homeHeight: Number(this.props.location.state.height),
        blueprintName: this.props.match.params.name
      });
    } else {
      const arr = JSON.parse(
        localStorage.getItem(this.props.match.params.name)
      );
      this.setState({
        homeWidth: arr.canvasWidth,
        homeHeight: arr.canvasHeight,
        blueprintName: this.props.match.params.name,
        shapes: arr.shapes
      });
    }
  }

  componentDidUpdate() {
    if (this.state.add) {
      this.checkNode();
    }
  }

  checkNode() {
    const stage = this.stageRef.getStage();
    const selectedNode = stage.findOne("." + this.state.selectedshapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }
    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  handleStageMouseDown = e => {
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedshapeName: ""
      });
      return;
    }
    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    const name = e.target.name();
    const shape = this.state.shapes.find(r => r.roomName === name);
    if (shape && !shape.confirm) {
      this.setState({
        selectedshapeName: name
      });
    } else {
      this.setState({
        selectedshapeName: ""
      });
    }
  };

  handleChange = e => {
    this.setState({
      room: { ...this.state.room, [e.target.name]: e.target.value },
      selectedshapeName: "",
      confirm: true
    });
  };

  isNatural = (s, homeDimension) => {
    const n = parseInt(s, 10);
    return n > 0 && n.toString() === s && n < homeDimension;
  };

  handleAdd = () => {
    const room = { ...this.state.room };
    const shapes = [...this.state.shapes];
    if (
      !(
        this.isNatural(room.height, this.state.homeHeight) &&
        this.isNatural(room.width, this.state.homeWidth) &&
        !shapes.some(elem => elem.roomName === room.roomName)
      )
    ) {
      alert("Incorrect Input (Use different name/dimension) ");
      this.setState({ room: { width: "", height: "", roomName: "" } });
      return;
    }

    let newShape = {
      roomName: room.roomName,
      x: this.state.x,
      y: this.state.y,
      width: Number(room.width),
      height: Number(room.height),
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      confirm: false,
      strokeColor: "black"
    };
    this.setState({
      shapes: [...this.state.shapes, newShape],
      add: true,
      confirm: false,
      selectedshapeName: newShape.roomName
    });
  };

  confirmHandler = () => {
    let lastShape = [...this.state.shapes];
    const lastItem = lastShape[this.state.shapes.length - 1];
    if (lastItem) {
      lastItem.confirm = true;
      this.setState(
        {
          shapes: lastShape,
          room: { width: "", height: "", roomName: "" },
          confirm: false,
          add: false,
          selectedshapeName: "",
          saveFlag: true
        },
        () => {
          this.transformer.detach();
        }
      );
    }
  };

  deleteHandler = () => {
    const shapes = [...this.state.shapes];
    shapes.pop();
    this.setState({
      shapes: shapes,
      deleted: true,
      room: { width: "", height: "", roomName: "" },
      confirm: true,
      saveFlag: true
    });
  };

  handleRectChange = e => {
    const shape = e.currentTarget;
    const { shapes } = this.state;
    let tempArr = [...shapes],
      lastShape = tempArr.length - 1;
    const width = shape.width(),
      height = shape.height(),
      scaleX = shape.scaleX(),
      scaleY = shape.scaleY(),
      x = Math.round(shape.x()),
      y = Math.round(shape.y()),
      rotation = Math.round(shape.rotation());
    tempArr[lastShape] = {
      ...tempArr[lastShape],
      width: width,
      height: height,
      scaleX: scaleX,
      scaleY: scaleY,
      x: x,
      y: y,
      rotation: rotation
    };

    this.setState({
      shapes: [...tempArr],
      room: {
        ...this.state.room,
        width: Math.round(
          Number(tempArr[lastShape].width) * Number(tempArr[lastShape].scaleX)
        ),
        height: Math.round(
          Number(tempArr[lastShape].height) * Number(tempArr[lastShape].scaleY)
        )
      }
    });
  };

  dragHandle = e => {
    const { shapes } = this.state;
    let tempArr = [...shapes],
      lastShape = tempArr.length - 1;
    const { room } = this.state;
    const width = Math.round(
        Number(tempArr[lastShape].width) * Number(tempArr[lastShape].scaleX)
      ),
      height = Math.round(
        Number(tempArr[lastShape].height) * Number(tempArr[lastShape].scaleY)
      );
    if (tempArr[lastShape].rotation !== 0) {
      let topleft = { x: tempArr[lastShape].x, y: tempArr[lastShape].y },
        topright = {
          x: Number(tempArr[lastShape].x) + Number(room.width),
          y: Number(tempArr[lastShape].y)
        },
        bottomleft = {
          x: Number(tempArr[lastShape].x),
          y: Number(tempArr[lastShape].y) + Number(room.height)
        },
        bottomright = {
          x: Number(tempArr[lastShape].x) + Number(room.width),
          y: Number(tempArr[lastShape].y) + Number(room.height)
        };
      console.log(topleft, topright, bottomleft, bottomright);
    }

    let newY = this.checkBound(e.y, height, this.state.homeHeight);
    let newX = this.checkBound(e.x, width, this.state.homeWidth);
    return {
      x: newX,
      y: newY
    };
  };

  checkBound = (coordinate, shape, x) => {
    return coordinate < 0 ? 0 : coordinate + shape > x ? x - shape : coordinate;
  };

  downloadURI = (uri, name) => {
    this.aRef.download = name;
    this.aRef.href = uri;
    this.aRef.click();
  };

  printHandler = e => {
    const dataURL = this.stageRef.getStage().toDataURL({
      mimeType: "image/png"
    });
    this.downloadURI(dataURL, "blueprint");
  };

  saveHandler = () => {
    const arr = [...this.state.shapes];
    arr.map(shape => {
      shape.width = Math.round(Number(shape.width) * Number(shape.scaleX));
      shape.height = Math.round(Number(shape.height) * Number(shape.scaleY));
      shape.scaleX = 1;
      shape.scaleY = 1;
    });
    const obj = {
      canvasWidth: this.state.homeWidth,
      canvasHeight: this.state.homeHeight,
      shapes: arr
    };
    localStorage.setItem(this.state.blueprintName, JSON.stringify(obj));
    // DataHandle.postData(API_CONSTANTS.CREATE_BLUEPRINT, obj);
    alert("saved");
    this.props.history.push("/Home");
  };

  check = () =>
    this.state.confirm && this.state.room.width && this.state.room.height;

  render() {
    return (
      <div>
        <div className="dimensions">
          <form className="dimension-form">
            <Link to={ROUTES.HOME}>
              <Button type="button" text="BACK" className="canvas-btn" />
            </Link>
            <Input
              className="canvas-input"
              type="text"
              name="roomName"
              value={this.state.room.roomName}
              onChange={this.handleChange}
              placeholder="Room Name"
              required
            />
            <Input
              className="canvas-input"
              type="number"
              id="width"
              name="width"
              value={this.state.room.width}
              onChange={this.handleChange}
              placeholder="Width"
              min={1}
              max={this.state.homeWidth}
              required
            />
            <Input
              className="canvas-input"
              type="number"
              id="height"
              name="height"
              value={this.state.room.height}
              placeholder="height"
              min={1}
              max={this.state.homeHeight}
              onChange={this.handleChange}
              required
            />
            {this.state.confirm &&
              this.state.room.width &&
              this.state.room.height && (
                <Button
                  type="button"
                  text="ADD"
                  onClick={this.handleAdd}
                  className="canvas-btn"
                />
              )}
            {this.state.add && (
              <Button
                type="button"
                text="CONFIRM"
                onClick={this.confirmHandler}
                className="canvas-btn"
              />
            )}
            {this.state.add && (
              <Button
                type="button"
                text="DELETE"
                onClick={this.deleteHandler}
                className="canvas-btn"
              />
            )}
            {this.state.saveFlag && (
              <Button
                type="button"
                text="SAVE"
                onClick={this.saveHandler}
                className="canvas-btn"
              />
            )}
            <Button
              type="button"
              text="PRINT"
              onClick={this.printHandler}
              className="canvas-btn"
            />
          </form>
        </div>
        <div className="container">
          <div className="canvas-container">
            <Stage
              ref={ref => {
                this.stageRef = ref;
              }}
              width={this.state.homeWidth}
              height={this.state.homeHeight}
              onMouseDown={this.handleStageMouseDown}
              style={{
                backgroundColor: "lightgrey",
                overflow: "hidden"
              }}
            >
              <Layer>
                {this.state.shapes &&
                  this.state.shapes.map((shape, i) => (
                    <Rect
                      key={i}
                      name={shape.roomName}
                      width={Number(shape.width)}
                      height={Number(shape.height)}
                      stroke={shape.strokeColor}
                      x={shape.x}
                      y={shape.y}
                      rotation={shape.rotation}
                      opacity={0.2}
                      dragBoundFunc={this.dragHandle}
                      onTransformEnd={this.handleRectChange}
                      onDragEnd={this.handleRectChange}
                      strokeScaleEnabled={false}
                      draggable={shape.confirm ? false : true}
                      onMouseMove={this.handletooltip}
                    />
                  ))}
                <Transformer
                  ref={node => {
                    this.transformer = node;
                  }}
                  selectedshapeName={this.state.selectedshapeName}
                  keepRatio={false}
                  centeredScaling={false}
                  ignoreStroke={true}
                  boundBoxFunc={(oldbox, newbox) => {
                    if (
                      newbox.width > this.state.homeWidth ||
                      newbox.height > this.state.homeHeight
                    ) {
                      return oldbox;
                    }
                    return newbox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
        </div>
        <a
          ref={ref => {
            this.aRef = ref;
          }}
        />
      </div>
    );
  }
}
Blueprint.propTypes = {
  width: propTypes.number,
  height: propTypes.number
};

export default Blueprint;
