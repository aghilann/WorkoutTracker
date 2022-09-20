interface WorkoutSchema {
  workoutID: string;
  exercises: Exercise[];
}

interface Exercise {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

export { WorkoutSchema, Exercise };
