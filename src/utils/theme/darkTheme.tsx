const dark = {
  palette: {
    type: "dark",
    primary: {
      main: "#ef6c00",
    },
    secondary: {
      main: "#f50057",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  overrides: {
    MuiAppBar: {
      colorInherit: {
        backgroundColor: "#202124",
        color: "#fff",
      },
    },
    MuiDrawer: {
      root: {
        width: 240,
      },
      paper: {
        background: "#000",
        color: "#fff",
        width: 240,
      },
    },
    MuiButton: {
      root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 48,
        padding: "0 30px",
      },
    },
    MuiSwitch: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
        zIndex: "1202",
        position: "relative",
        alignItems: "flex-end",
        justifyContent: "center",
      },
      switchBase: {
        padding: 1,
        "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + $track": {
            opacity: 1,
            border: "none",
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: "1px solid #bdbdbd",
        opacity: 1,
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    },
  },
  props: {
    MuiAppBar: {
      color: "inherit",
    },
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
};
export default dark;
