import { FC } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import { Layout } from "../container/layout";
import { KnowledgeGraph } from "../container/graph";

export const IndexPage: FC = () => {
  // const [windowVisible, setWindowVisible] = useState<boolean>(false);
  // const [windowPosition, setWindowPosition] = useState<{
  //   x: number;
  //   y: number;
  // }>({ x: 168, y: 36 });

  // const handleButtonClick = () => {
  //   setWindowVisible(!windowVisible);
  // };

  // const handleTitleMouseDown = (event: any) => {
  //   event.preventDefault();
  //   const initialMousePosition = { x: event.clientX, y: event.clientY };

  //   const handleMouseMove = (moveEvent: any) => {
  //     const deltaX = moveEvent.clientX - initialMousePosition.x;
  //     const deltaY = moveEvent.clientY - initialMousePosition.y;

  //     setWindowPosition((prevPos) => {
  //       const newX = Math.max(
  //         0,
  //         Math.min(window.innerWidth - 200, prevPos.x + deltaX)
  //       );
  //       const newY = Math.max(
  //         0,
  //         Math.min(window.innerHeight - 200, prevPos.y + deltaY)
  //       );
  //       return { x: newX, y: newY };
  //     });

  //     initialMousePosition.x = moveEvent.clientX;
  //     initialMousePosition.y = moveEvent.clientY;
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

  return (
    <Layout>
      <div
        style={{
          backgroundColor: "#333",
          width: "100%",
          height: "100%",
        }}
      >
        <KnowledgeGraph />
      </div>

      {/* {windowVisible && (
        <Paper
          style={{
            position: "absolute",
            zIndex: 10,
            width: 580,
            height: 420,
            top: `${windowPosition.y}px`,
            left: `${windowPosition.x}px`,
          }}
        >
          <Typography
            style={{
              cursor: "move",
              paddingLeft: 8,
            }}
            variant="h6"
            component="div"
            onMouseDown={handleTitleMouseDown}
          >
            0U Attack Pattern
          </Typography>
          <div
            style={{
              position: "absolute",
              top: 32,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <PatternGraph />
          </div>
        </Paper>
      )} */}
    </Layout>
  );
};
