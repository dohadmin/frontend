
export const superCleanerData = (trainingData) => {
  if (!Array.isArray(trainingData)) {
    return [];
  }

  const trainings = [];

  console.log(trainingData)

  trainingData.forEach(trainee => {
    let trainees = [];
    trainee.trainees.forEach(subTrainee => {
      trainees.push({
        id: subTrainee.trainees.id._id,
        status: subTrainee.trainees.status,
        score: subTrainee.trainees.score
      });
    });

    trainings.push({
      createdAt: trainee.createdAt,
      description: trainee.description,
      title: trainee.title,
      trainerId: trainee.trainerId, // Assuming trainerId is directly accessible
      trainees: trainees
    });
  });


  return trainings; // Corrected return value
}
