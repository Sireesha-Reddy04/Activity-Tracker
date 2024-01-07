// pages/activity--tracker/index.jsx
import React, { useState, useEffect } from 'react';
import './ActivityTracker.css';
import { useAddActivities } from '../../hooks/useAddActivities';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase-config';
import { v4 as uuidv4 } from 'uuid';

export const ActivityTracker = () => {
  const { addActivities } = useAddActivities();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [totalSteps, setTotalSteps] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [sedentaryReminder, setSedentaryReminder] = useState(false);
  const [goalSteps, setGoalSteps] = useState(0);
  const [shareAchievement, setShareAchievement] = useState('');

  const predefinedActivities = [
    { name: 'Walking', steps: 2000, calories: 100, heartRateIncrease: 10 },
    { name: 'Running', steps: 5000, calories: 300, heartRateIncrease: 20 },
    { name: 'Cycling', steps: 0, calories: 500, heartRateIncrease: 15 },
    { name: 'Jogging', steps: 4000, calories: 150, heartRateIncrease: 18 },
    { name: 'Exercise', steps: 0, calories: 250, heartRateIncrease: 25 },
  ];

  const loadPreviousActivities = async () => {
    try {
      const activitiesCollection = collection(db, 'activities');
      const querySnapshot = await getDocs(activitiesCollection);

      const previousActivities = [];
      querySnapshot.forEach((doc) => {
        previousActivities.push(doc.data());
      });

      setActivities(previousActivities);
    } catch (error) {
      console.error('Error fetching previous activities:', error);
    }
  };

  const addActivity = async () => {
    if (newActivity.trim() !== '') {
      const predefinedActivity = predefinedActivities.find(
        (activity) => activity.name.toLowerCase() === newActivity.toLowerCase()
      );

      const activityData = {
        userID: uuidv4(),
        name: newActivity,
        steps: predefinedActivity ? predefinedActivity.steps : 0,
        calories: predefinedActivity ? predefinedActivity.calories : 0,
        heartRateIncrease: predefinedActivity ? predefinedActivity.heartRateIncrease : 0,
      };

      // Add activity to the database
      await addActivities({ activity: activityData });

      // Update state with the new activity
      setActivities([...activities, activityData]);

      // Update total steps, calories, and heart rate for every added activity
      setTotalSteps((prevSteps) => prevSteps + activityData.steps);
      setTotalCalories((prevCalories) => prevCalories + activityData.calories);
      setHeartRate((prevHeartRate) => prevHeartRate + activityData.heartRateIncrease);

      // Clear the input field
      setNewActivity('');
    }
  };

  useEffect(() => {
    const sedentaryTimeout = setTimeout(() => {
      setSedentaryReminder(true);
    }, 30 * 60 * 1000);

    return () => clearTimeout(sedentaryTimeout);
  }, [totalSteps]);

  const handleSetGoal = () => {
    if (goalSteps > 0) {
      const newGoalMessage = `New Goal Set: ${goalSteps} steps. Steps to complete: ${goalSteps - totalSteps} Hurry Up...!!!!🚶‍♂️🚶‍♂️🚶‍♂️`;
      alert(newGoalMessage);
      setGoalSteps(0);
    }
  };

  const handleShareAchievement = () => {
    setShareAchievement(`Achievement: Reached ${totalSteps} steps today! 🚶‍♂️`);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('auth');
      navigate('/pages/auth/index');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="activity--tracker">
      <div className="container">
        <h1>Daily Activity Tracker</h1>
        <div className="activity-form">
          <input
            type="text"
            placeholder="Add a new activity"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <button onClick={addActivity}>Add</button>
          <button onClick={loadPreviousActivities}>Past Achievements</button>
        </div>
        <div className="activity-list">
          <h2>Today's Activities</h2>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>{activity.name}</li>
            ))}
          </ul>
        </div>
        <div className="totals">
          <div className="step-counter">
            <h2>Total Steps</h2>
            <p>{totalSteps}</p>
          </div>
          <div className="calorie-counter">
            <h2>Total Calories Burned</h2>
            <p>{totalCalories.toFixed(2)} calories</p>
          </div>
          <div className="heart-rate-monitor">
            <h2>Heart Rate</h2>
            <p>{heartRate} bpm</p>
          </div>
        </div>
        <div className="extras">
          <div className="sedentary-reminder">
            <h2>Sedentary Reminder</h2>
            {sedentaryReminder && <p>It's time to move!</p>}
          </div>
          <div className="customizable-goals">
            <h2>Customizable Goals</h2>
            <input
              type="number"
              placeholder="Set a new step goal"
              value={goalSteps}
              onChange={(e) => setGoalSteps(parseInt(e.target.value, 10) || 0)}
            />
            <button onClick={handleSetGoal}>Set Goal</button>
          </div>
          <div className="social-sharing">
            <h2>Social Sharing</h2>
            <button onClick={handleShareAchievement}>Share Achievement</button>
            {shareAchievement && (
              <p style={{ fontWeight: 'bold', textAlign: 'center' }}>{shareAchievement}</p>
            )}
          </div>
          <div className="sign-out">
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};