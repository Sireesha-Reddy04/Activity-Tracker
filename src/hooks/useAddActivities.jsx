// hooks/useAddActivities.jsx
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { v4 as uuidv4 } from 'uuid';

export const useAddActivities = () => {
  const activitiesCollection = collection(db, 'activities');

  const addActivities = async ({ activity }) => {
    try {
      const activityData = {
        userID: uuidv4(),
        name: activity,
        createdAt: serverTimestamp(),
      };

      await addDoc(activitiesCollection, activityData);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return { addActivities };
};
