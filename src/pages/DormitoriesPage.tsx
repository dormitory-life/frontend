import { useEffect, useState } from "react"

import api from "../api/api"
import type { Dormitory } from "../types/types"
import DormitoryCard from "../components/DormitoryCard"
import { Container, Typography, Grid } from "@mui/material"

export default function DormitoriesPage() {
  const [dorms, setDorms] = useState<Dormitory[]>([])

  useEffect(() => {
    api.get("/core/dormitories").then((res) => setDorms(res.data.dormitories))
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Общежития
      </Typography>

      <Grid container spacing={3}>
        {dorms.map((d) => (
          <Grid key={d.id} size={{ xs: 12 }}>
            <DormitoryCard dorm={d} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}