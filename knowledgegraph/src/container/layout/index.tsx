import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { FC, PropsWithChildren } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { bottomVisible, toggleBottomSwitcher } from "./store";
import { BottomPanel } from "../bottom";
import { drawerHeight } from "../../common/style-constant";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginBottom: 64,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginBottom: drawerHeight + 64,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: "100%", //`calc( - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginBottom: drawerHeight,
  }),
  bottom: 0,
  top: "auto",
}));

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const open = useAppSelector(bottomVisible);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Main open={open}>{children}</Main>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            Transaction Details
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={() => dispatch(toggleBottomSwitcher())}
            // sx={{ ...(open && { display: "none" }) }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          height: drawerHeight,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            height: drawerHeight,
          },
        }}
        variant="persistent"
        anchor="bottom"
        open={open}
      >
        <BottomPanel />
      </Drawer>
    </Box>
  );
};
