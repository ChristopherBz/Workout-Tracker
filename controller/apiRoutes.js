const router = require('express').Router();
const db = require('../models');

// Get all workouts
router.get("/workouts", async (req,res)=>{
    try{
        const workoutData = await db.Workout.aggregate([{
            $addFields:{
                totalDuration:{$sum:"$exercises.duration"}
            }
        }]);
        res.status(200).json(workoutData)
    } catch(err){
        res.status(500).json(err)
    }
})

// Add an exercise within a workout id
router.put("/workouts/:id", async (req,res)=>{
    try{
        console.log(req.body)
        const newExercise = req.body
        console.log('adding new exercise by ID')
        const workoutData = await db.Workout.findByIdAndUpdate(req.params.id,{
                $push:{exercises:req.body}
            },
            {
                runValidators:true,
                new:true
            });
        console.log(workoutData)
        res.status(200).json(workoutData)
    } catch(err){
        res.status(500).json(err)
    }
})

// Add a new workout
router.post("/workouts", async (req,res)=>{
    try{
        const workoutData = await db.Workout.create({});
        console.log(workoutData)
        res.status(200).json(workoutData)
    } catch(err){
        res.status(500).json(err)
    }
})

// Get the last 7 workouts
router.get("/workouts/range", async (req,res)=>{
    try{
        const workoutData = await db.Workout.aggregate([{
            $addFields:{
                totalDuration:{$sum:"$exercises.duration"}
                }
            }])
            .skip(await db.Workout.count() - 7)
        console.log(workoutData)
        res.status(200).json(workoutData)
    } catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;