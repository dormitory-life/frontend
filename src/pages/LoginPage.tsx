import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"

import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import { getApiErrorText } from "../utils/http"

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorText, setErrorText] = useState("")

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("refreshToken", res.data.refresh_token)
      localStorage.setItem("userId", res.data.user_id)
      localStorage.setItem("dormitoryId", res.data.dormitory_id)

      navigate("/dormitories")
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const textFieldSx = {
    "& .MuiInputBase-root": {
      backgroundColor: "#ffffff",
      color: "#111827",
    },
    "& .MuiInputBase-input": {
      color: "#111827",
      WebkitTextFillColor: "#111827",
    },
    "& .MuiInputLabel-root": {
      color: "#6b7280",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1976d2",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d1d5db",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9ca3af",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1976d2",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
      WebkitTextFillColor: "#111827",
      transition: "background-color 9999s ease-out 0s",
    },
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dormitory Life
        </Typography>

        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          autoComplete="email"
          sx={{ ...textFieldSx, mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          autoComplete="current-password"
          sx={{ ...textFieldSx, mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={login}
        >
          Login
        </Button>
      </Box>

      <Snackbar
        open={Boolean(errorText)}
        autoHideDuration={3000}
        onClose={() => setErrorText("")}
      >
        <Alert severity="error" onClose={() => setErrorText("")}>
          {errorText}
        </Alert>
      </Snackbar>
    </Container>
  )
}