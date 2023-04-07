import { ImageList, ImageListItem } from "@mui/material";
import { FC } from "react";
import { ClusterData } from "./type";

function srcset(imageUrl: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${imageUrl}`,
  };
}

export const QuiltedImageList: FC<{
  data: ClusterData[];
  onClick: (id: string) => void;
}> = ({ data, onClick }) => {
  return (
    <ImageList
      sx={{ width: "100%", height: 340 }}
      variant="quilted"
      cols={1}
      rowHeight={121}
    >
      {data.map((item) => (
        <ImageListItem key={item.id} cols={1} rows={1}>
          <img
            {...srcset(item.thumb, 121)}
            alt={item.id}
            loading="lazy"
            style={{
              cursor: "pointer",
              backgroundColor:
                item.id === "0x102a457be62ee0cda23f722af1930de1f72762c2"
                  ? "#455a64"
                  : "#444",

              // "#444",
              objectFit: "contain",
            }}
            onClick={() => onClick(item.id)}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
