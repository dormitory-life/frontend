import type { AvgGrade } from "../types/types"
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material"

interface Props {
  grade: AvgGrade
}

function formatScore(value: number): string {
  return Number(value || 0).toFixed(1)
}

function scoreToProgress(value: number): number {
  return Math.max(0, Math.min(100, (value / 5) * 100))
}

function GradeRow({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.5 }}
      >
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>
          {formatScore(value)} / 5
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={scoreToProgress(value)}
        sx={{ height: 8, borderRadius: 999 }}
      />
    </Box>
  )
}

export default function GradesCard({ grade }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6">Средние оценки</Typography>
            <Typography color="text.secondary" variant="body2">
              Период: {new Date(grade.period_date).toLocaleDateString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              color="primary"
              label={`Общая: ${formatScore(grade.overall_average)}`}
            />
            <Chip
              variant="outlined"
              label={`Оценок: ${grade.total_ratings}`}
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <GradeRow
          label="Чистота санузлов"
          value={grade.avg_bathroom_cleanliness}
        />
        <GradeRow
          label="Чистота коридоров"
          value={grade.avg_corridor_cleanliness}
        />
        <GradeRow
          label="Чистота кухни"
          value={grade.avg_kitchen_cleanliness}
        />
        <GradeRow
          label="Регулярность уборки"
          value={grade.avg_cleaning_frequency}
        />
        <GradeRow
          label="Просторность комнат"
          value={grade.avg_room_spaciousness}
        />
        <GradeRow
          label="Просторность коридоров"
          value={grade.avg_corridor_spaciousness}
        />
        <GradeRow
          label="Просторность кухни"
          value={grade.avg_kitchen_spaciousness}
        />
        <GradeRow
          label="Удобство расположения душа"
          value={grade.avg_shower_location_convenience}
        />
        <GradeRow
          label="Состояние бытового оборудования"
          value={grade.avg_equipment_maintenance}
        />
        <GradeRow
          label="Состояние окон"
          value={grade.avg_window_condition}
        />
        <GradeRow
          label="Шумоизоляция"
          value={grade.avg_noise_isolation}
        />
        <GradeRow
          label="Оснащение общих зон"
          value={grade.avg_common_areas_equipment}
        />
        <GradeRow
          label="Транспортная доступность"
          value={grade.avg_transport_accessibility}
        />
        <GradeRow
          label="Качество работы администрации"
          value={grade.avg_administration_quality}
        />
        <GradeRow
          label="Общая атмосфера"
          value={grade.avg_residents_culture_level}
        />
      </CardContent>
    </Card>
  )
}