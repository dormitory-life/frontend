import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "light",

    background: {
      default: "#f7f8fa",
      paper: "#ffffff",
    },

    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },

  typography: {
    fontFamily: [
      "Manrope",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),

    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#111827",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#111827",
          fontWeight: 700,
          fontSize: "1.25rem",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
})

export default theme